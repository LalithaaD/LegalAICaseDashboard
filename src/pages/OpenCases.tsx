import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ResponsiveCaseTable } from '@/components/dashboard/ResponsiveCaseTable';
import { CaseDetailsModal } from '@/components/modals/CaseDetailsModal';
import { EditCaseModal } from '@/components/modals/EditCaseModal';
import { useAppStore } from '@/store/useAppStore';
import { LegalCase } from '@/data/mockData';

export default function OpenCases() {
  const { cases } = useAppStore();
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);
  const [editingCase, setEditingCase] = useState<LegalCase | null>(null);

  // Filter cases to only show Open status
  const openCases = cases.filter(case_ => case_.status === 'Open');

  const handleCaseSelect = (caseId: string) => {
    const selectedCase = openCases.find(c => c.id === caseId);
    if (selectedCase) {
      setSelectedCase(selectedCase);
    }
  };

  const handleCaseEdit = (caseId: string) => {
    const editingCase = openCases.find(c => c.id === caseId);
    if (editingCase) {
      setEditingCase(editingCase);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Open Cases</h1>
          <p className="text-muted-foreground mt-2">
            Active legal cases currently being worked on
          </p>
        </div>
        <ResponsiveCaseTable 
          cases={openCases}
          statusFilter="Open" 
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