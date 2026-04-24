import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  addDoc, 
  serverTimestamp,
  writeBatch,
  getDocs
} from 'firebase/firestore';
import { auth, db, handleFirestoreError } from '../lib/firebase';

export interface ToolHistory {
  id: string;
  slug: string;
  name: string;
  timestamp: string;
  url?: string;
  score?: number;
}

export interface UserPreferences {
  name: string;
  email: string;
  company?: string;
  goals: string[];
  theme?: 'light' | 'dark' | 'system';
  favorites?: string[];
}

interface UserContextType {
  user: FirebaseUser | null;
  loading: boolean;
  preferences: UserPreferences;
  history: ToolHistory[];
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  addToHistory: (entry: Omit<ToolHistory, 'timestamp'>) => Promise<void>;
  clearHistory: () => Promise<void>;
  toggleFavorite: (toolSlug: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('seo_user_preferences');
      const savedGoals = localStorage.getItem('seo_score_user_goals');
      const goals = savedGoals ? JSON.parse(savedGoals) : [];
      
      if (saved) {
        const parsed = JSON.parse(saved);
        return { 
          ...parsed, 
          goals: goals.length > 0 ? goals : parsed.goals || [],
          favorites: parsed.favorites || []
        };
      }
      return { name: '', email: '', goals, favorites: [] };
    } catch (e) {
      return { name: '', email: '', goals: [], favorites: [] };
    }
  });

  const [history, setHistory] = useState<ToolHistory[]>(() => {
    try {
      const saved = localStorage.getItem('seo_tool_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Handle Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  // Sync Preferences from Firestore
  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as UserPreferences;
        setPreferences(data);
      } else {
        // Initial sync of local data to cloud if new user
        const initialPrefs: UserPreferences = {
          name: user.displayName || preferences.name || '',
          email: user.email || preferences.email || '',
          goals: preferences.goals || [],
          company: preferences.company || '',
          favorites: preferences.favorites || [],
          updatedAt: serverTimestamp() as any
        } as any;
        setDoc(userDocRef, initialPrefs).catch(e => handleFirestoreError(e, 'create', `users/${user.uid}`));
      }
      setLoading(false);
    }, (error) => {
      console.error("Preferences sync error:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // Sync History from Firestore
  useEffect(() => {
    if (!user) return;

    const historyRef = collection(db, 'analysis_history');
    const q = query(
      historyRef, 
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: ToolHistory[] = snapshot.docs.map(d => {
        const data = d.data();
        return {
          id: data.toolId,
          slug: data.toolSlug,
          name: data.toolName,
          url: data.url,
          score: data.score,
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : new Date().toISOString()
        };
      });
      
      // If we have local history but zero cloud history, migrate
      if (items.length === 0 && history.length > 0) {
        const batch = writeBatch(db);
        history.slice(0, 10).forEach(h => {
          const newDoc = doc(collection(db, 'analysis_history'));
          batch.set(newDoc, {
            userId: user.uid,
            toolId: h.id,
            toolSlug: h.slug,
            toolName: h.name,
            url: h.url || null,
            score: h.score || null,
            timestamp: serverTimestamp()
          });
        });
        batch.commit().catch(e => console.error("Migration error:", e));
      } else if (items.length > 0) {
        setHistory(items);
      }
    });

    return unsubscribe;
  }, [user]);

  // Update Local Storage
  useEffect(() => {
    localStorage.setItem('seo_user_preferences', JSON.stringify(preferences));
    localStorage.setItem('seo_score_user_goals', JSON.stringify(preferences.goals));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem('seo_tool_history', JSON.stringify(history));
  }, [history]);

  const updatePreferences = async (prefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...prefs };
    setPreferences(updated);

    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          ...updated,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (e) {
        handleFirestoreError(e, 'update', `users/${user.uid}`);
      }
    }
  };

  const addToHistory = async (entry: Omit<ToolHistory, 'timestamp'>) => {
    const newEntry: ToolHistory = {
      ...entry,
      timestamp: new Date().toISOString(),
    };

    setHistory(prev => {
      const filtered = prev.filter(h => h.slug !== entry.slug || h.url !== entry.url);
      return [newEntry, ...filtered].slice(0, 50);
    });

    if (user) {
      try {
        await addDoc(collection(db, 'analysis_history'), {
          userId: user.uid,
          toolId: entry.id,
          toolSlug: entry.slug,
          toolName: entry.name,
          url: entry.url || null,
          score: entry.score || null,
          timestamp: serverTimestamp()
        });
      } catch (e) {
        console.error("Failed to save history to cloud:", e);
      }
    }
  };

  const clearHistory = async () => {
    setHistory([]);
    if (user) {
      try {
        const q = query(collection(db, 'analysis_history'), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        const batch = writeBatch(db);
        snapshot.docs.forEach((d) => batch.delete(d.ref));
        await batch.commit();
      } catch (e) {
        handleFirestoreError(e, 'delete', 'analysis_history');
      }
    }
  };

  const toggleFavorite = async (toolSlug: string) => {
    const currentFavorites = preferences.favorites || [];
    const isFavorite = currentFavorites.includes(toolSlug);
    
    let newFavorites: string[];
    if (isFavorite) {
      newFavorites = currentFavorites.filter(slug => slug !== toolSlug);
    } else {
      newFavorites = [...currentFavorites, toolSlug];
    }

    await updatePreferences({ favorites: newFavorites });
  };

  return (
    <UserContext.Provider value={{ user, loading, preferences, history, updatePreferences, addToHistory, clearHistory, toggleFavorite }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
