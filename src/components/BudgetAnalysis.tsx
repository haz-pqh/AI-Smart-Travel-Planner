import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TripPlan } from '../services/gemini';
import { DollarSign, TrendingUp } from 'lucide-react';

interface BudgetAnalysisProps {
  plan: TripPlan;
}

export function BudgetAnalysis({ plan }: BudgetAnalysisProps) {
  const data = plan.itinerary.map(day => ({
    name: `Day ${day.day}`,
    cost: day.items.reduce((sum, item) => sum + item.estimatedCost, 0)
  }));

  const totalCost = plan.totalEstimatedCost;
  const avgPerDay = totalCost / plan.duration;

  return (
    <div className="glass-card p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="text-blue-400" />
          Budget Visualization
        </h3>
        <div className="text-right">
          <p className="text-gray-400 text-sm uppercase font-bold tracking-wider">Total Estimated Cost</p>
          <p className="text-3xl font-bold text-blue-400">${totalCost.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <p className="text-gray-400 text-sm mb-1">Daily Average</p>
          <p className="text-2xl font-bold">${avgPerDay.toFixed(0)}</p>
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <p className="text-gray-400 text-sm mb-1">Most Expensive Day</p>
          <p className="text-2xl font-bold">Day {data.reduce((prev, curr) => prev.cost > curr.cost ? prev : curr).name.split(' ')[1]}</p>
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <p className="text-gray-400 text-sm mb-1">Budget Level</p>
          <p className="text-2xl font-bold capitalize text-blue-400">{plan.budget}</p>
        </div>
      </div>

      <div className="h-[300px] w-full mt-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="rgba(255,255,255,0.5)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.5)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(10, 10, 10, 0.9)', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff'
              }}
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            />
            <Bar dataKey="cost" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#60a5fa'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
