import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Level } from '../types';
import { ALL_ITEMS, LEVELS } from '../constants';

interface DashboardScreenProps {
  totalPoints: number;
  currentLevel: Level;
  dailyChecks: Record<string, number[]>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-700">{`${payload[0].payload.fullDate}`}</p>
        <p className="text-purple-600 font-bold">{`ポイント: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function DashboardScreen({ totalPoints, currentLevel, dailyChecks }: DashboardScreenProps) {
  const nextLevel = useMemo(() => {
    return LEVELS.find(l => l.points > totalPoints);
  }, [totalPoints]);

  const progressPercentage = useMemo(() => {
    if (!nextLevel) return 100;
    const levelStartPoints = currentLevel.points;
    const levelEndPoints = nextLevel.points;
    const pointsInLevel = totalPoints - levelStartPoints;
    const levelPointRange = levelEndPoints - levelStartPoints;
    if (levelPointRange === 0) return 100;
    return (pointsInLevel / levelPointRange) * 100;
  }, [totalPoints, currentLevel, nextLevel]);

  const chartData = useMemo(() => {
    const activeDates = Object.keys(dailyChecks)
      .filter(date => dailyChecks[date]?.length > 0)
      .sort();
    
    if (activeDates.length === 0) return [];

    return activeDates.slice(-7).map(date => {
      const points = dailyChecks[date].reduce((sum, itemId) => {
        const item = ALL_ITEMS.find(i => i.id === itemId);
        return sum + (item?.points || 0);
      }, 0);
      // Create date object in a way that respects the local timezone from the YYYY-MM-DD string
      const dateObj = new Date(date + 'T00:00:00');
      const formattedDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
      return { 
          name: formattedDate, 
          points, 
          fullDate: dateObj.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' }) 
      };
    });
  }, [dailyChecks]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Level and Points Card */}
      <div className="bg-gradient-to-r from-purple-500 to-rose-500 text-white p-6 rounded-2xl shadow-lg text-center">
        <p className="text-sm uppercase tracking-widest">{currentLevel.name}</p>
        <h2 className="font-display text-3xl my-1">{currentLevel.title}</h2>
        <p className="font-bold text-4xl mt-3">{totalPoints.toLocaleString()} <span className="text-xl font-normal">pts</span></p>
      </div>

      {/* Progress to Next Level */}
      {nextLevel && (
        <div className="bg-white/70 p-4 rounded-2xl shadow-lg">
          <div className="flex justify-between items-baseline mb-2 text-sm font-semibold text-gray-600">
            <span>次のレベル: {nextLevel.title}</span>
            <span>{nextLevel.points.toLocaleString()} pts</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-teal-400 to-cyan-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Daily Points Chart */}
      <div className="bg-white/70 p-4 rounded-2xl shadow-lg">
        <h3 className="font-display text-lg text-gray-700 mb-4">過去7日間の獲得ポイント</h3>
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#888888" fontSize={12} />
              <YAxis stroke="#888888" fontSize={12} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(219, 198, 255, 0.4)'}} />
              <Bar dataKey="points" name="ポイント" fill="url(#colorPoints)" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}