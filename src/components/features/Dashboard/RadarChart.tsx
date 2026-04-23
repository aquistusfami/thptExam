"use client";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface RadarData {
  subject: string;
  A: number;
  fullMark: number;
}

export default function CompetencyRadarChart({ data }: { data: RadarData[] }) {
  return (
    <div className="w-full h-[300px] bg-white rounded-2xl p-4">
      <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Biểu đồ năng lực</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Học sinh"
            dataKey="A"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
