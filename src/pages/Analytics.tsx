import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore } from '@/store/useAppStore';
import { getCaseStatistics } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, Filter, TrendingUp, DollarSign, Briefcase, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Analytics() {
  const { cases } = useAppStore();
  const [timeRange, setTimeRange] = useState('6months');
  const [caseTypeFilter, setCaseTypeFilter] = useState('all');
  
  // Filter cases based on time range
  const getFilteredCasesByTimeRange = (cases: any[], range: string) => {
    const now = new Date();
    let startDate = new Date();
    
    switch (range) {
      case '1month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return cases;
    }
    
    return cases.filter(case_ => new Date(case_.filingDate) >= startDate);
  };

  // Filter cases based on case type
  const getFilteredCasesByType = (cases: any[], type: string) => {
    if (type === 'all') return cases;
    return cases.filter(case_ => case_.caseType === type);
  };

  // Apply filters
  const timeFilteredCases = getFilteredCasesByTimeRange(cases, timeRange);
  const filteredCases = getFilteredCasesByType(timeFilteredCases, caseTypeFilter);
  
  // Calculate filtered statistics
  const filteredStats = {
    totalCases: filteredCases.length,
    openCases: filteredCases.filter(c => c.status === 'Open').length,
    closedCases: filteredCases.filter(c => c.status === 'Closed').length,
    pendingCases: filteredCases.filter(c => c.status === 'Pending').length,
    settlementCases: filteredCases.filter(c => c.status === 'Settlement').length,
    caseTypeDistribution: filteredCases.reduce((acc, case_) => {
      acc[case_.caseType] = (acc[case_.caseType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    aiPredictionSuccessRate: filteredCases.length > 0 ? 
      Math.round((filteredCases.filter(c => 
        (c.actualPayout && c.aiPrediction.predictedPayout) ? 
        Math.abs(c.actualPayout - c.aiPrediction.predictedPayout) / c.aiPrediction.predictedPayout <= 0.15 : false
      ).length / filteredCases.length) * 100) : 0
  };

  // Prepare chart data based on filtered cases
  const caseTypeData = Object.entries(filteredStats.caseTypeDistribution).map(([name, value]) => ({
    name,
    value,
    percentage: ((value / filteredCases.length) * 100).toFixed(1)
  }));

  const statusData = [
    { name: 'Open', value: filteredStats.openCases, color: '#FCD34D' },
    { name: 'Closed', value: filteredStats.closedCases, color: '#10B981' },
    { name: 'Pending', value: filteredStats.pendingCases, color: '#1E40AF' },
    { name: 'Settlement', value: filteredStats.settlementCases, color: '#3B82F6' }
  ];

  // Generate monthly trends data based on filtered cases
  const generateMonthlyTrends = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const trends = [];
    
    // Get last 6 months of data
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthName = months[monthIndex];
      const monthStart = new Date();
      monthStart.setMonth(currentMonth - i, 1);
      const monthEnd = new Date();
      monthEnd.setMonth(currentMonth - i + 1, 0);
      
      const monthCases = filteredCases.filter(c => {
        const caseDate = new Date(c.filingDate);
        return caseDate >= monthStart && caseDate <= monthEnd;
      });
      
      const monthPayouts = monthCases.reduce((sum, c) => sum + (c.actualPayout || c.estimatedPayout || 0), 0);
      const avgAccuracy = monthCases.length > 0 ? 
        Math.round((monthCases.filter(c => 
          (c.actualPayout && c.aiPrediction.predictedPayout) ? 
          Math.abs(c.actualPayout - c.aiPrediction.predictedPayout) / c.aiPrediction.predictedPayout <= 0.15 : false
        ).length / monthCases.length) * 100) : 0;
      
      trends.push({
        month: monthName,
        cases: monthCases.length,
        payouts: monthPayouts,
        predictions: avgAccuracy
      });
    }
    
    return trends;
  };

  const monthlyTrends = generateMonthlyTrends();

  // Generate payout trends data based on filtered cases
  const generatePayoutTrends = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const trends = [];
    
    // Get last 6 months of data
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthName = months[monthIndex];
      const monthStart = new Date();
      monthStart.setMonth(currentMonth - i, 1);
      const monthEnd = new Date();
      monthEnd.setMonth(currentMonth - i + 1, 0);
      
      const monthCases = filteredCases.filter(c => {
        const caseDate = new Date(c.filingDate);
        return caseDate >= monthStart && caseDate <= monthEnd;
      });
      
      const actualPayouts = monthCases.filter(c => c.actualPayout).map(c => c.actualPayout!);
      const predictedPayouts = monthCases.map(c => c.aiPrediction.predictedPayout);
      
      const avgActual = actualPayouts.length > 0 ? 
        actualPayouts.reduce((sum, p) => sum + p, 0) / actualPayouts.length : 0;
      const avgPredicted = predictedPayouts.length > 0 ? 
        predictedPayouts.reduce((sum, p) => sum + p, 0) / predictedPayouts.length : 0;
      
      trends.push({
        month: monthName,
        average: Math.round(avgActual),
        predicted: Math.round(avgPredicted)
      });
    }
    
    return trends;
  };

  const payoutTrends = generatePayoutTrends();

  const handleExportReport = () => {
    // Create CSV content for Excel
    const headers = [
      'Case ID',
      'Client Name',
      'Case Type',
      'Status',
      'Filing Date',
      'Estimated Payout',
      'Actual Payout',
      'AI Predicted Payout',
      'AI Prediction Outcome',
      'AI Confidence %',
      'Severity',
      'Attorney',
      'Description'
    ];

    const csvContent = [
      // Summary section
      ['ANALYTICS REPORT SUMMARY'],
      ['Generated At:', new Date().toLocaleString()],
      ['Time Range Filter:', timeRange === '6months' ? 'Last 6 Months' : 
                           timeRange === '1month' ? 'Last Month' : 
                           timeRange === '3months' ? 'Last 3 Months' : 
                           timeRange === '1year' ? 'Last Year' : 'All Time'],
      ['Case Type Filter:', caseTypeFilter === 'all' ? 'All Case Types' : caseTypeFilter],
      ['Total Cases:', filteredCases.length],
      ['Total Payout:', `$${totalPayout.toLocaleString()}`],
      ['Average Payout:', `$${Math.round(averagePayout).toLocaleString()}`],
      ['AI Success Rate:', `${successRate}%`],
      [''],
      ['CASE DETAILS'],
      headers,
      // Case data
      ...filteredCases
        .sort((a, b) => a.clientName.localeCompare(b.clientName))
        .map(case_ => [
          case_.id,
          case_.clientName,
          case_.caseType,
          case_.status,
          new Date(case_.filingDate).toLocaleDateString(),
          case_.estimatedPayout ? `$${case_.estimatedPayout.toLocaleString()}` : '',
          case_.actualPayout ? `$${case_.actualPayout.toLocaleString()}` : '',
          `$${case_.aiPrediction.predictedPayout.toLocaleString()}`,
          case_.aiPrediction.outcome,
          `${case_.aiPrediction.confidence}%`,
          case_.severity,
          case_.attorney,
          case_.description
        ])
    ];

    // Convert to CSV format
    const csvString = csvContent.map(row => 
      row.map(cell => {
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        const cellStr = String(cell || '');
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(',')
    ).join('\n');

    // Create and download CSV file (Excel can open CSV files)
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Report Generated",
      description: "Analytics report has been exported as Excel file successfully.",
    });
  };

  const totalPayout = filteredCases.reduce((sum, c) => sum + (c.actualPayout || c.estimatedPayout), 0);
  const averagePayout = filteredCases.length > 0 ? totalPayout / filteredCases.length : 0;
  const successRate = filteredStats.aiPredictionSuccessRate;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
          <p className="text-muted-foreground mt-2">
            Detailed analytics and performance metrics for your legal practice
          </p>
        </div>

        {/* Filters & Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={caseTypeFilter} onValueChange={setCaseTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by case type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Case Types</SelectItem>
                  <SelectItem value="Personal Injury">Personal Injury</SelectItem>
                  <SelectItem value="Medical Malpractice">Medical Malpractice</SelectItem>
                  <SelectItem value="Employment">Employment</SelectItem>
                  <SelectItem value="Corporate">Corporate</SelectItem>
                  <SelectItem value="Family Law">Family Law</SelectItem>
                  <SelectItem value="Criminal Defense">Criminal Defense</SelectItem>
                  <SelectItem value="Product Liability">Product Liability</SelectItem>
                  <SelectItem value="Contract Dispute">Contract Dispute</SelectItem>
                  <SelectItem value="Real Estate">Real Estate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Active Filters Indicator */}
            {(timeRange !== '6months' || caseTypeFilter !== 'all') && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span>Active filters:</span>
                {timeRange !== '6months' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary">
                    Time: {timeRange === '1month' ? 'Last Month' : 
                           timeRange === '3months' ? 'Last 3 Months' : 
                           timeRange === '1year' ? 'Last Year' : 'Last 6 Months'}
                  </span>
                )}
                {caseTypeFilter !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary">
                    Type: {caseTypeFilter}
                  </span>
                )}
                <span className="text-xs">
                  Showing {filteredCases.length} of {cases.length} cases
                </span>
              </div>
            )}
          </div>
          
          <Button onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredCases.length}</div>
              <p className="text-xs text-muted-foreground">
                {filteredCases.length !== cases.length ? `Filtered from ${cases.length} total cases` : '+12% from last month'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalPayout.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Payout</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${Math.round(averagePayout).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Success Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{successRate}%</div>
              <p className="text-xs text-muted-foreground">
                +2.5% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Case Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Case Status Distribution</CardTitle>
              <CardDescription>
                Breakdown of {filteredCases.length} filtered cases by status
                {filteredCases.length !== cases.length && ` (from ${cases.length} total cases)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Donut Chart */}
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={0}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Case Details by Status */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-muted-foreground">Cases by Status</h4>
                  {statusData.map((status) => {
                    const casesInStatus = filteredCases.filter(c => c.status === status.name);
                    if (casesInStatus.length === 0) return null;
                    
                    return (
                      <div key={status.name} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: status.color }}
                          />
                          <span className="font-medium text-sm">{status.name} ({status.value})</span>
                        </div>
                        <div className="ml-5 space-y-1">
                          {casesInStatus.map((case_) => (
                            <div key={case_.id} className="text-xs text-muted-foreground">
                              <div className="font-medium">{case_.clientName}</div>
                              <div className="text-xs">
                                {case_.caseType} • Filed: {new Date(case_.filingDate).toLocaleDateString()}
                              </div>
                              <div className="text-xs">
                                ${(case_.actualPayout || case_.estimatedPayout || 0).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Case Types */}
          <Card>
            <CardHeader>
              <CardTitle>Case Types</CardTitle>
              <CardDescription>
                Distribution of {filteredCases.length} filtered cases by type
                {filteredCases.length !== cases.length && ` (from ${cases.length} total cases)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={caseTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Case Trends</CardTitle>
              <CardDescription>
                {filteredCases.length} filtered cases and payouts over the last 6 months
                {filteredCases.length !== cases.length && ` (from ${cases.length} total cases)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="cases" fill="hsl(var(--primary))" name="Cases" />
                  <Line yAxisId="right" type="monotone" dataKey="predictions" stroke="hsl(var(--destructive))" name="AI Accuracy %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Payout Predictions */}
          <Card>
            <CardHeader>
              <CardTitle>Payout Predictions vs Actual</CardTitle>
              <CardDescription>
                AI prediction accuracy for {filteredCases.length} filtered cases over the last 6 months
                {filteredCases.length !== cases.length && ` (from ${cases.length} total cases)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={payoutTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                  <Legend />
                  <Line type="monotone" dataKey="average" stroke="hsl(var(--primary))" name="Actual Average" />
                  <Line type="monotone" dataKey="predicted" stroke="hsl(var(--destructive))" strokeDasharray="5 5" name="AI Predicted" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}