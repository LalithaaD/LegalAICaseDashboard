import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CaseChartsProps {
  caseTypeData: Array<{ name: string; value: number; }>;
  statusData: Array<{ name: string; value: number; color: string; }>;
  monthlyData: Array<{ month: string; cases: number; payouts: number; }>;
}

const COLORS = {
  primary: 'hsl(215 75% 25%)',
  success: 'hsl(142 70% 40%)', 
  warning: 'hsl(45 95% 55%)',
  destructive: 'hsl(0 75% 55%)',
  muted: 'hsl(215 15% 45%)'
};

export function CaseCharts({ caseTypeData, statusData, monthlyData }: CaseChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Case Types Distribution */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Case Types Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={caseTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 15% 88%)" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(0 0% 100%)',
                  border: '1px solid hsl(215 15% 88%)',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="value" 
                fill={COLORS.primary}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Case Status Breakdown */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Case Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(0 0% 100%)',
                  border: '1px solid hsl(215 15% 88%)',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {statusData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {entry.name} ({entry.value})
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card className="shadow-card lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Monthly Case & Payout Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 15% 88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(0 0% 100%)',
                  border: '1px solid hsl(215 15% 88%)',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => [
                  name === 'payouts' ? `$${value?.toLocaleString()}` : value,
                  name === 'payouts' ? 'Average Payout' : 'New Cases'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="cases" 
                stroke={COLORS.primary} 
                strokeWidth={3}
                dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="payouts" 
                stroke={COLORS.success} 
                strokeWidth={3}
                dot={{ fill: COLORS.success, strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}