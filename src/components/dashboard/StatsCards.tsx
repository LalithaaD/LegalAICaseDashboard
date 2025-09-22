import { TrendingUp, FileText, Users, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StatsCardsProps {
  stats: {
    totalCases: number;
    openCases: number;
    closedCases: number;
    pendingCases: number;
    settlementCases: number;
    successRate: number;
    averagePayout: number;
  };
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Cases',
      value: stats.totalCases.toString(),
      icon: FileText,
      description: 'All cases in system',
      trend: null,
      color: 'text-primary'
    },
    {
      title: 'Active Cases',
      value: stats.openCases.toString(),
      icon: AlertCircle,
      description: 'Currently open',
      trend: null,
      color: 'text-warning'
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      icon: CheckCircle,
      description: 'AI favorable predictions',
      trend: '+12% from last month',
      color: 'text-success'
    },
    {
      title: 'Avg. Payout',
      value: formatCurrency(stats.averagePayout),
      icon: DollarSign,
      description: 'Expected settlement value',
      trend: '+8% from last month',
      color: 'text-primary'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, index) => (
        <Card key={index} className="shadow-card hover:shadow-elevated transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-1">
              {card.value}
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {card.description}
            </p>
            {card.trend && (
              <Badge variant="secondary" className="text-xs">
                {card.trend}
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}