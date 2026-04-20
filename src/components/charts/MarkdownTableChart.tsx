import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';

interface MarkdownTableChartProps {
  content: string;
}

export const MarkdownTableChart: React.FC<MarkdownTableChartProps> = ({ content }) => {
  const data = React.useMemo(() => {
    // Basic markdown table parser
    const lines = content.trim().split('\n');
    if (lines.length < 3) return null;

    // Filter out separator line (e.g., |---|---|)
    const tableLines = lines.filter(line => line.includes('|') && !line.match(/^[|:\-\s]+$/));
    if (tableLines.length < 2) return null;

    const headers = tableLines[0].split('|').map(h => h.trim()).filter(Boolean);
    const rows = tableLines.slice(1).map(row => 
      row.split('|').map(c => c.trim()).filter(c => c !== '')
    );

    // Find numeric columns
    const numericColIndices = headers.map((_, idx) => {
      const isNumeric = rows.every(row => {
        const val = row[idx]?.replace(/[%,]/g, '');
        return val !== undefined && !isNaN(parseFloat(val));
      });
      return isNumeric ? idx : -1;
    }).filter(idx => idx !== -1);

    if (numericColIndices.length === 0) return null;

    const primaryNumericIdx = numericColIndices[0];
    const labelIdx = headers.findIndex((h, idx) => numericColIndices.indexOf(idx) === -1) || 0;

    const chartData = rows.map(row => ({
      name: row[labelIdx] || 'N/A',
      value: parseFloat(row[primaryNumericIdx]?.replace(/[%,]/g, '') || '0'),
      label: headers[primaryNumericIdx]
    })).slice(0, 10); // Limit to top 10

    return {
      data: chartData,
      metricName: headers[primaryNumericIdx]
    };
  }, [content]);

  if (!data || data.data.length === 0) return null;

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6'];

  return (
    <div className="my-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          Visual Analysis: {data.metricName}
        </h4>
        <span className="text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">Top 10 Insights</span>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.data} layout="vertical" margin={{ left: 20, right: 40, top: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" opacity={0.5} />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false}
              width={80}
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#0f172a', color: '#fff', fontSize: '12px' }}
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={20}>
              {data.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
