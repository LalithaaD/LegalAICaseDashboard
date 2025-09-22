import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/store/useAppStore';
import { LegalCase } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { Save, X } from 'lucide-react';

interface EditCaseModalProps {
  open: boolean;
  onClose: () => void;
  caseData: LegalCase | null;
}

export function EditCaseModal({ open, onClose, caseData }: EditCaseModalProps) {
  const { updateCase, clients, cases } = useAppStore();
  
  // Get all unique client names from existing clients and cases
  const existingClientNames = Array.from(new Set([
    ...clients.map(c => c.name),
    ...cases.map(c => c.clientName)
  ])).sort((a, b) => a.localeCompare(b));
  
  const [formData, setFormData] = useState({
    clientName: '',
    caseType: '',
    status: '',
    filingDate: '',
    estimatedPayout: '',
    actualPayout: '',
    attorney: '',
    description: '',
    severity: ''
  });

  const [loading, setLoading] = useState(false);

  // Update form data when caseData changes
  useEffect(() => {
    if (caseData) {
      setFormData({
        clientName: caseData.clientName,
        caseType: caseData.caseType,
        status: caseData.status,
        filingDate: caseData.filingDate,
        estimatedPayout: caseData.estimatedPayout?.toString() || '',
        actualPayout: caseData.actualPayout?.toString() || '',
        attorney: caseData.attorney,
        description: caseData.description,
        severity: caseData.severity
      });
    }
  }, [caseData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!caseData) return;

    setLoading(true);
    try {
      const updatedCase = {
        ...caseData,
        clientName: formData.clientName,
        caseType: formData.caseType as LegalCase['caseType'],
        status: formData.status as LegalCase['status'],
        filingDate: formData.filingDate,
        estimatedPayout: formData.estimatedPayout ? parseFloat(formData.estimatedPayout) : undefined,
        actualPayout: formData.actualPayout ? parseFloat(formData.actualPayout) : undefined,
        attorney: formData.attorney,
        description: formData.description,
        severity: formData.severity as LegalCase['severity']
      };

      updateCase(caseData.id, updatedCase);
      
      toast({
        title: "Case Updated",
        description: "The case has been updated successfully.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update case. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!caseData) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Edit Legal Case</span>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <Select value={formData.clientName} onValueChange={(value) => setFormData(prev => ({ ...prev, clientName: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select or type client name" />
                </SelectTrigger>
                <SelectContent>
                  {existingClientNames.map((clientName) => (
                    <SelectItem key={clientName} value={clientName}>
                      {clientName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="clientName"
                className="mt-2"
                placeholder="Or type a new client name"
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="attorney">Attorney</Label>
              <Input
                id="attorney"
                value={formData.attorney}
                onChange={(e) => setFormData(prev => ({ ...prev, attorney: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="caseType">Case Type</Label>
              <Select value={formData.caseType} onValueChange={(value) => setFormData(prev => ({ ...prev, caseType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select case type" />
                </SelectTrigger>
                <SelectContent>
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

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Settlement">Settlement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="filingDate">Filing Date</Label>
              <Input
                id="filingDate"
                type="date"
                value={formData.filingDate}
                onChange={(e) => setFormData(prev => ({ ...prev, filingDate: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="severity">Severity</Label>
              <Select value={formData.severity} onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estimatedPayout">Estimated Payout ($)</Label>
              <Input
                id="estimatedPayout"
                type="number"
                value={formData.estimatedPayout}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedPayout: e.target.value }))}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="actualPayout">Actual Payout ($)</Label>
              <Input
                id="actualPayout"
                type="number"
                value={formData.actualPayout}
                onChange={(e) => setFormData(prev => ({ ...prev, actualPayout: e.target.value }))}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[100px]"
              placeholder="Case description..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Updating...' : 'Update Case'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
