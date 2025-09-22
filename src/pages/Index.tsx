import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { CaseCharts } from '@/components/dashboard/CaseCharts';
import { ResponsiveCaseTable } from '@/components/dashboard/ResponsiveCaseTable';
import { mockCases, getCaseStatistics } from '@/data/mockData';

const Index = () => {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const stats = getCaseStatistics();

  // Prepare chart data
  const caseTypeData = Object.entries(stats.caseTypeDistribution).map(([name, value]) => ({
    name: name.replace(' ', '\n'), // Break long names for better display
    value
  }));

  const statusData = [
    { name: 'Open', value: stats.openCases, color: 'hsl(45 95% 55%)' },
    { name: 'Closed', value: stats.closedCases, color: 'hsl(142 70% 40%)' },
    { name: 'Pending', value: stats.pendingCases, color: 'hsl(215 75% 25%)' },
    { name: 'Settlement', value: stats.settlementCases, color: 'hsl(215 65% 45%)' }
  ];

  // Mock monthly data for trends
  const monthlyData = [
    { month: 'Jan', cases: 8, payouts: 125000 },
    { month: 'Feb', cases: 12, payouts: 145000 },
    { month: 'Mar', cases: 10, payouts: 132000 },
    { month: 'Apr', cases: 15, payouts: 168000 },
    { month: 'May', cases: 11, payouts: 142000 },
    { month: 'Jun', cases: 14, payouts: 156000 }
  ];

  const handleCaseSelect = (caseId: string) => {
    setSelectedCase(caseId);
    // Here you could show a detailed view or modal
    console.log('Selected case:', caseId);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Legal Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              AI-powered insights for your legal practice
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Last updated</p>
            <p className="text-sm font-medium text-foreground">
              {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Charts */}
        <CaseCharts 
          caseTypeData={caseTypeData}
          statusData={statusData}
          monthlyData={monthlyData}
        />

        {/* Cases Table */}
        <ResponsiveCaseTable 
          cases={mockCases}
          onCaseSelect={handleCaseSelect}
        />
      </div>
    </DashboardLayout>
  );
};

export default Index;
