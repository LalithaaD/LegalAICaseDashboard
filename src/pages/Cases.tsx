import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveCaseTable } from '@/components/dashboard/ResponsiveCaseTable';
import { AddCaseModal } from '@/components/modals/AddCaseModal';
import { CaseDetailsModal } from '@/components/modals/CaseDetailsModal';
import { EditCaseModal } from '@/components/modals/EditCaseModal';
import { useAppStore } from '@/store/useAppStore';
import { LegalCase } from '@/data/mockData';
import { Plus, Search, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Cases() {
  const { cases, caseFilters, setCaseFilters } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);
  const [editingCase, setEditingCase] = useState<LegalCase | null>(null);

  // Ensure cases is an array and has data
  const safeCases = Array.isArray(cases) ? cases : [];
  
  // Filter cases based on current filters
  const filteredCases = safeCases.filter(caseItem => {
    const matchesSearch = !caseFilters.search || 
      caseItem.clientName.toLowerCase().includes(caseFilters.search.toLowerCase()) ||
      caseItem.caseType.toLowerCase().includes(caseFilters.search.toLowerCase()) ||
      caseItem.attorney.toLowerCase().includes(caseFilters.search.toLowerCase());
    
    const matchesStatus = !caseFilters.status || caseItem.status === caseFilters.status;
    const matchesCaseType = !caseFilters.caseType || caseItem.caseType === caseFilters.caseType;
    
    return matchesSearch && matchesStatus && matchesCaseType;
  });

  const handleCaseSelect = (caseId: string) => {
    const selectedCase = filteredCases.find(c => c.id === caseId);
    if (selectedCase) {
      setSelectedCase(selectedCase);
    }
  };

  const handleCaseEdit = (caseId: string) => {
    const editingCase = filteredCases.find(c => c.id === caseId);
    if (editingCase) {
      setEditingCase(editingCase);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Legal Cases</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive overview of all legal cases in the system
          </p>
        </div>

        {/* Actions & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Case
          </Button>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cases..."
                className="pl-8 w-[250px]"
                value={caseFilters.search}
                onChange={(e) => setCaseFilters({ search: e.target.value })}
              />
            </div>
            
            <Select value={caseFilters.status || "all"} onValueChange={(value) => setCaseFilters({ status: value === "all" ? "" : value })}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Settlement">Settlement</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={caseFilters.caseType || "all"} onValueChange={(value) => setCaseFilters({ caseType: value === "all" ? "" : value })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Types" />
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

        {/* Cases Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredCases.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Open Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-open">
                {filteredCases.filter(c => c.status === 'Open').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Settlements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-settlement">
                {filteredCases.filter(c => c.status === 'Settlement').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Closed Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-closed">
                {filteredCases.filter(c => c.status === 'Closed').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cases Table */}
        <ResponsiveCaseTable 
          cases={filteredCases}
          onCaseSelect={handleCaseSelect}
          onCaseEdit={handleCaseEdit}
        />

        {/* Modals */}
        <AddCaseModal 
          open={showAddModal} 
          onClose={() => setShowAddModal(false)} 
        />
        
        <CaseDetailsModal 
          open={!!selectedCase} 
          onClose={() => setSelectedCase(null)} 
          caseData={selectedCase}
        />

        <EditCaseModal 
          open={!!editingCase} 
          onClose={() => setEditingCase(null)} 
          caseData={editingCase}
        />
      </div>
    </DashboardLayout>
  );
}