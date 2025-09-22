import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useAppStore } from '@/store/useAppStore';
import { generateAIPrediction } from '@/data/mockData';

interface AddCaseModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddCaseModal({ open, onClose }: AddCaseModalProps) {
  const { addCase, clients, cases } = useAppStore();
  const [loading, setLoading] = useState(false);
  
  // Get all unique client names from existing clients and cases
  const existingClientNames = Array.from(new Set([
    ...clients.map(c => c.name),
    ...cases.map(c => c.clientName)
  ])).sort((a, b) => a.localeCompare(b));
  
  const [formData, setFormData] = useState({
    clientName: '',
    caseType: '',
    status: 'Open',
    estimatedPayout: '',
    severity: 'Medium',
    attorney: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newCase = {
        clientName: formData.clientName,
        caseType: formData.caseType as any,
        status: formData.status as any,
        filingDate: new Date().toISOString().split('T')[0],
        estimatedPayout: parseInt(formData.estimatedPayout) || 0,
        actualPayout: null,
        aiPrediction: generateAIPrediction(formData.caseType as any, formData.severity as any, formData.status as any),
        severity: formData.severity as any,
        attorney: formData.attorney,
        description: formData.description
      };

      addCase(newCase);
      
      toast({
        title: "Case Added Successfully",
        description: `New ${formData.caseType} case for ${formData.clientName} has been created.`,
      });
      
      setFormData({
        clientName: '',
        caseType: '',
        status: 'Open',
        estimatedPayout: '',
        severity: 'Medium',
        attorney: '',
        description: ''
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create case. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Legal Case</DialogTitle>
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
                  <SelectItem value="Contract Dispute">Contract Dispute</SelectItem>
                  <SelectItem value="Employment Law">Employment Law</SelectItem>
                  <SelectItem value="Product Liability">Product Liability</SelectItem>
                  <SelectItem value="Real Estate">Real Estate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Settlement">Settlement</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
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
                min="0"
                required
              />
            </div>

            <div>
              <Label htmlFor="severity">Severity</Label>
              <Select value={formData.severity} onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Case Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Case'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}