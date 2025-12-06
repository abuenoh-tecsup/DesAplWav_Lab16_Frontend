"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  stats: {
    abiertos: number;
    enProgreso: number;
    cerrados: number;
  };
};

export default function StatsCard({ stats }: Props) {
  const statsData = [
    { label: "Abiertos", value: stats.abiertos, color: "bg-green-100 text-green-800" },
    { label: "En Progreso", value: stats.enProgreso, color: "bg-yellow-100 text-yellow-800" },
    { label: "Cerrados", value: stats.cerrados, color: "bg-red-100 text-red-800" },
  ];

  return (
    <Card className="flex-1 p-6">
      <CardHeader>
        <CardTitle>Estadísticas</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {statsData.map((stat) => (
          <div
            key={stat.label}
            className={`flex items-center justify-between p-4 rounded-lg shadow ${stat.color}`}
          >
            <span className="text-lg font-medium">{stat.label}</span>
            <span className="text-2xl font-bold">{stat.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
