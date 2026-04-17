import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { cn } from '../../lib/utils';

const MOCK_TREND_DATA = [
  { day: 'Day 1', score: 65, traffic: 1200 },
  { day: 'Day 2', score: 68, traffic: 1100 },
  { day: 'Day 3', score: 75, traffic: 1500 },
  { day: 'Day 4', score: 72, traffic: 1400 },
  { day: 'Day 5', score: 85, traffic: 1900 },
  { day: 'Day 6', score: 88, traffic: 2200 },
  { day: 'Day 7', score: 92, traffic: 2500 },
];

export const SEOPerformanceChart = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">SEO Growth Trends</h3>
          <p className="text-sm text-slate-500 font-medium">Weekly performance and organic visibility impact</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-indigo-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">SEO Score</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-indigo-200 dark:bg-indigo-900" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Traffic Impact</span>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MOCK_TREND_DATA}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
              dy={10}
            />
            <YAxis 
              hide 
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                border: 'none', 
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
              itemStyle={{ color: '#818cf8' }}
              cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
            />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="#4f46e5" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorScore)" 
              animationDuration={1500}
            />
            <Area 
              type="monotone" 
              dataKey="traffic" 
              stroke="#e2e8f0" 
              strokeWidth={2}
              fill="transparent"
              strokeDasharray="5 5"
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const PerformanceBenchmarkChart = ({ currentSpeed, industryAvg = 3.5 }: { currentSpeed: number, industryAvg?: number }) => {
  const data = [
    { name: 'Your Site', value: currentSpeed, color: currentSpeed < industryAvg ? '#10b981' : '#f43f5e' },
    { name: 'Industry Average', value: industryAvg, color: '#94a3b8' },
    { name: 'Top 10%', value: 1.2, color: '#6366f1' },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
      <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 text-center">Load Time Benchmark (Seconds)</h4>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 30 }}>
            <XAxis type="number" hide domain={[0, Math.max(currentSpeed, industryAvg, 5)]} />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }}
              width={100}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-tight mt-4">
        {currentSpeed < industryAvg ? '🚀 You are faster than the industry average!' : '⚠️ Speed optimization recommended to match competitors.'}
      </p>
    </div>
  );
};

export const TrafficDistributionChart = () => {
  const data = [
    { name: 'Direct', value: 40, color: '#6366f1' },
    { name: 'Organic', value: 30, color: '#10b981' },
    { name: 'Social', value: 20, color: '#f59e0b' },
    { name: 'Referral', value: 10, color: '#ec4899' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm h-full">
      <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-6">Traffic Distribution</h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
            />
            <Tooltip 
              cursor={{ fill: '#f1f5f9', opacity: 0.1 }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{item.name}: {item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
