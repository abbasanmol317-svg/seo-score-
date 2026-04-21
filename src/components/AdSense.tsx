import React, { useEffect, useRef } from 'react';

/**
 * Google AdSense Component
 * This handles the script injection and auto-ads setup
 */
export const AdSenseProvider: React.FC<{ publisherId: string }> = ({ publisherId }) => {
  useEffect(() => {
    if (!publisherId || publisherId === 'ca-pub-PLACEHOLDER') return;

    try {
      // Check if script already exists
      if (document.querySelector('script[src*="adsbygoogle.js"]')) return;

      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);

      return () => {
        // We usually don't remove the script on unmount in single page apps
        // to avoid issues with re-insertion, but we can if strictly needed.
      };
    } catch (e) {
      console.error('AdSense script error:', e);
    }
  }, [publisherId]);

  return null;
};

/**
 * Individual Ad Unit Component
 */
interface AdUnitProps {
  slot: string;
  client?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  layout?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const AdUnit: React.FC<AdUnitProps> = ({ 
  slot, 
  client = 'ca-pub-6719705037005199',
  format = 'auto', 
  layout, 
  className = '',
  style 
}) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    const pushAd = () => {
      try {
        // Safety check: Don't push if the element already has a status (processed)
        if (adRef.current && adRef.current.getAttribute('data-adsbygoogle-status') !== 'done') {
          // Safety check: Don't push if the element has 0 width (causes "No slot size" error)
          if (adRef.current.clientWidth > 0) {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } else {
            // If width is 0, retry after a small delay
            setTimeout(pushAd, 200);
          }
        }
      } catch (e) {
        console.error('AdSense push error:', e);
      }
    };

    // Give the DOM a moment to stabilize
    const timer = setTimeout(pushAd, 300);
    
    return () => clearTimeout(timer);
  }, [slot]);

  // Placeholder styles when in development or without valid slot
  const isDev = !slot || slot === 'YOUR_SLOT_ID' || client === 'ca-pub-PLACEHOLDER';

  return (
    <div className={`adsense-container my-8 overflow-hidden flex flex-col items-center justify-center min-w-[250px] ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '90px', width: '100%', ...style }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        {...(layout ? { 'data-ad-layout': layout } : {})}
      />
      {isDev && (
        <div className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 min-h-[120px]">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          </div>
          <div className="text-center">
            <div className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-1">AdSense Placeholder</div>
            <div className="text-[9px] text-slate-500 italic max-w-[200px]">
              Ready for {slot === 'YOUR_SLOT_ID' ? 'Slot ID' : 'Pub ID'} configuration. 
              Visible to users after approval.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
