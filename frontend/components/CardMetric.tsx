import { Card, CardContent } from "@/components/ui/card";

export function CardMetric({ title, value, icon }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-center gap-4 p-6">
        {icon}
        <div>
          <p className="text-gray-600">{title}</p>
          <h2 className="text-2xl font-bold">{value}</h2>
        </div>
      </CardContent>
    </Card>
  );
}
