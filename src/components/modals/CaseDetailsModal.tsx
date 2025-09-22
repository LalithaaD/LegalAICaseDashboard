import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LegalCase } from '@/data/mockData';
import { Calendar, User, DollarSign, Briefcase, Target } from 'lucide-react';

interface CaseDetailsModalProps {
  open: boolean;
  onClose: () => void;
  caseData: LegalCase | null;
}

export function CaseDetailsModal({ open, onClose, caseData }: CaseDetailsModalProps) {
  if (!caseData) return null;

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'destructive';
      case 'closed': return 'success';
      case 'settlement': return 'warning';
      case 'pending': return 'outline';
      default: return 'secondary';
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome.toLowerCase()) {
      case 'favorable': return 'text-status-closed';
      case 'uncertain': return 'text-status-settlement';
      case 'unfavorable': return 'text-status-open';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Case Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{caseData.clientName}</h3>
              <p className="text-muted-foreground">{caseData.caseType}</p>
            </div>
            <Badge variant={getStatusVariant(caseData.status)}>
              {caseData.status}
            </Badge>
          </div>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Case Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Filing Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(caseData.filingDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Attorney</p>
                    <p className="text-sm text-muted-foreground">{caseData.attorney}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Case Description</p>
                <p className="text-sm text-muted-foreground">{caseData.description}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Severity Level</p>
                <Badge variant={caseData.severity === 'High' ? 'destructive' : 
                             caseData.severity === 'Medium' ? 'warning' : 'secondary'}>
                  {caseData.severity}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Financial Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Estimated Payout</p>
                  <p className="text-lg font-bold">${caseData.estimatedPayout.toLocaleString()}</p>
                </div>
                {caseData.actualPayout && (
                  <div>
                    <p className="text-sm font-medium">Actual Payout</p>
                    <p className="text-lg font-bold">${caseData.actualPayout.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Prediction */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4" />
                AI Prediction Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Predicted Outcome</p>
                  <p className={`text-sm font-semibold ${getOutcomeColor(caseData.aiPrediction.outcome)}`}>
                    {caseData.aiPrediction.outcome}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Confidence Level</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${caseData.aiPrediction.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{caseData.aiPrediction.confidence}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium">AI Predicted Payout</p>
                <p className="text-lg font-bold">${caseData.aiPrediction.predictedPayout.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on historical data and case complexity analysis
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}