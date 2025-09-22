import { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, MoreVertical, Calendar, DollarSign, User, FileText, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LegalCase, mockCases } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface ResponsiveCaseTableProps {
  cases?: LegalCase[];
  statusFilter?: string;
  onCaseSelect?: (caseId: string) => void;
  onCaseEdit?: (caseId: string) => void;
}

type SortField = 'filingDate' | 'estimatedPayout' | 'aiPrediction.confidence' | 'clientName';
type SortDirection = 'asc' | 'desc';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Open': return 'destructive';
    case 'Closed': return 'success';
    case 'Pending': return 'outline';
    case 'Settlement': return 'warning';
    default: return 'default';
  }
};

const getPredictionColor = (outcome: string, confidence: number) => {
  if (outcome === 'Favorable' && confidence > 80) return 'text-success';
  if (outcome === 'Unfavorable' || confidence < 65) return 'text-destructive';
  return 'text-warning';
};

const getPredictionBg = (outcome: string, confidence: number) => {
  if (outcome === 'Favorable' && confidence > 80) return 'bg-success/10';
  if (outcome === 'Unfavorable' || confidence < 65) return 'bg-destructive/10';
  return 'bg-warning/10';
};

export function ResponsiveCaseTable({ cases = mockCases, statusFilter: initialStatusFilter, onCaseSelect, onCaseEdit }: ResponsiveCaseTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter || 'all');
  const [caseTypeFilter, setCaseTypeFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('filingDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Sync internal statusFilter with prop changes
  useEffect(() => {
    if (initialStatusFilter && initialStatusFilter !== statusFilter) {
      setStatusFilter(initialStatusFilter);
    }
  }, [initialStatusFilter, statusFilter]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedCases = useMemo(() => {
    let filtered = cases.filter(case_ => {
      const matchesSearch = case_.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           case_.caseType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           case_.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || case_.status === statusFilter;
      const matchesCaseType = caseTypeFilter === 'all' || case_.caseType === caseTypeFilter;
      
      return matchesSearch && matchesStatus && matchesCaseType;
    });

    // Sort the filtered cases
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      if (sortField === 'aiPrediction.confidence') {
        aValue = a.aiPrediction.confidence;
        bValue = b.aiPrediction.confidence;
      } else if (sortField === 'estimatedPayout') {
        aValue = a.estimatedPayout || a.aiPrediction.predictedPayout || 0;
        bValue = b.estimatedPayout || b.aiPrediction.predictedPayout || 0;
      } else if (sortField === 'filingDate') {
        aValue = new Date(a.filingDate);
        bValue = new Date(b.filingDate);
      } else {
        aValue = a[sortField as keyof LegalCase];
        bValue = b[sortField as keyof LegalCase];
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [cases, searchTerm, statusFilter, caseTypeFilter, sortField, sortDirection]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronDown className="h-4 w-4 opacity-30" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  // Mobile Card View
  const MobileCard = ({ case_ }: { case_: LegalCase }) => (
    <Card className="mb-3 hover:shadow-elevated transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 cursor-pointer" onClick={() => onCaseSelect?.(case_.id)}>
            <h3 className="font-semibold text-foreground mb-1">{case_.clientName}</h3>
            <p className="text-sm text-muted-foreground">{case_.caseType}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onCaseEdit?.(case_.id);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Badge variant={getStatusVariant(case_.status)}>
              {case_.status}
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {new Date(case_.filingDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {formatCurrency(case_.actualPayout || case_.estimatedPayout || case_.aiPrediction.predictedPayout)}
            </span>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-border">
          <div className={cn(
            "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
            getPredictionBg(case_.aiPrediction.outcome, case_.aiPrediction.confidence),
            getPredictionColor(case_.aiPrediction.outcome, case_.aiPrediction.confidence)
          )}>
            AI: {case_.aiPrediction.outcome} ({case_.aiPrediction.confidence}%)
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Legal Cases</span>
          <Badge variant="outline" className="ml-2">
            {filteredAndSortedCases.length} cases
          </Badge>
        </CardTitle>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cases, clients, or types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Settlement">Settlement</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={caseTypeFilter} onValueChange={setCaseTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Case Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
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
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Mobile View - Cards */}
        <div className="block md:hidden">
          {filteredAndSortedCases.map((case_) => (
            <MobileCard key={case_.id} case_={case_} />
          ))}
        </div>

        {/* Tablet/Desktop View - Table */}
        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-sm font-semibold text-muted-foreground">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('clientName')}
                      className="h-auto p-0 font-semibold"
                    >
                      Client
                      <SortIcon field="clientName" />
                    </Button>
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-muted-foreground hidden lg:table-cell">Case Type</th>
                  <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Status</th>
                  <th className="text-left p-3 text-sm font-semibold text-muted-foreground hidden xl:table-cell">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('filingDate')}
                      className="h-auto p-0 font-semibold"
                    >
                      Filed
                      <SortIcon field="filingDate" />
                    </Button>
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-muted-foreground">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('estimatedPayout')}
                      className="h-auto p-0 font-semibold"
                    >
                      Payout
                      <SortIcon field="estimatedPayout" />
                    </Button>
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-muted-foreground hidden lg:table-cell">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('aiPrediction.confidence')}
                      className="h-auto p-0 font-semibold"
                    >
                      AI Prediction
                      <SortIcon field="aiPrediction.confidence" />
                    </Button>
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedCases.map((case_) => (
                  <tr 
                    key={case_.id}
                    className="border-b border-border hover:bg-dashboard-hover transition-colors cursor-pointer group"
                    onClick={() => onCaseSelect?.(case_.id)}
                  >
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-foreground">{case_.clientName}</div>
                        <div className="text-xs text-muted-foreground">{case_.id}</div>
                        {/* Show case type on tablet when column is hidden */}
                        <div className="text-xs text-muted-foreground lg:hidden mt-1">
                          {case_.caseType}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground hidden lg:table-cell">{case_.caseType}</td>
                    <td className="p-3">
                      <Badge variant={getStatusVariant(case_.status)}>
                        {case_.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground hidden xl:table-cell">
                      {new Date(case_.filingDate).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-sm font-medium">
                      <div>
                        {formatCurrency(case_.actualPayout || case_.estimatedPayout || case_.aiPrediction.predictedPayout)}
                        {/* Show filing date on smaller screens when column is hidden */}
                        <div className="text-xs text-muted-foreground xl:hidden">
                          {new Date(case_.filingDate).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 hidden lg:table-cell">
                      <div className={cn(
                        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                        getPredictionBg(case_.aiPrediction.outcome, case_.aiPrediction.confidence),
                        getPredictionColor(case_.aiPrediction.outcome, case_.aiPrediction.confidence)
                      )}>
                        {case_.aiPrediction.outcome} ({case_.aiPrediction.confidence}%)
                      </div>
                    </td>
                    <td className="p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCaseEdit?.(case_.id);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}