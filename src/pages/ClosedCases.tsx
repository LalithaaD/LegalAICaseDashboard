import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ResponsiveCaseTable } from '@/components/dashboard/ResponsiveCaseTable';
import { CaseDetailsModal } from '@/components/modals/CaseDetailsModal';
import { EditCaseModal } from '@/components/modals/EditCaseModal';
import { useAppStore } from '@/store/useAppStore';
import { LegalCase } from '@/data/mockData';

export default function ClosedCases() {
  const { cases } = useAppStore();
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);
  const [editingCase, setEditingCase] = useState<LegalCase | null>(null);

  // Filter cases to only show Closed status
  const closedCases = cases.filter(case_ => case_.status === 'Closed');

  const handleCaseSelect = (caseId: string) => {
    const selectedCase = closedCases.find(c => c.id === caseId);
    if (selectedCase) {
      setSelectedCase(selectedCase);
    }
  };

  const handleCaseEdit = (caseId: string) => {
    const editingCase = closedCases.find(c => c.id === caseId);
    if (editingCase) {
      setEditingCase(editingCase);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Closed Cases</h1>
          <p className="text-muted-foreground mt-2">
            Completed legal cases with final outcomes
          </p>
        </div>
        <ResponsiveCaseTable 
          cases={closedCases}
          statusFilter="Closed" 
          onCaseSelect={handleCaseSelect}
          onCaseEdit={handleCaseEdit}
        />
        
        {/* Case Details Modal */}
        <CaseDetailsModal 
          open={!!selectedCase} 
          onClose={() => setSelectedCase(null)} 
          caseData={selectedCase}
        />

        {/* Edit Case Modal */}
        <EditCaseModal 
          open={!!editingCase} 
          onClose={() => setEditingCase(null)} 
          caseData={editingCase}
        />
      </div>
    </DashboardLayout>
  );
}