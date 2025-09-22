import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Puzzle, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  Settings,
  MessageSquare,
  Calendar,
  FileText,
  Database,
  Zap
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface IntegrationSetupModalProps {
  open: boolean;
  onClose: () => void;
  service: string;
}

interface IntegrationConfig {
  enabled: boolean;
  webhookUrl?: string;
  apiKey?: string;
  syncFrequency: 'realtime' | 'hourly' | 'daily';
  syncCases: boolean;
  syncClients: boolean;
  syncCalendar: boolean;
  notifications: boolean;
}

const serviceConfigs = {
  'Slack': {
    icon: MessageSquare,
    description: 'Get case updates and notifications in your Slack workspace',
    features: ['Case notifications', 'Deadline alerts', 'Team updates'],
    setupSteps: [
      'Create a Slack app in your workspace',
      'Configure webhook URL',
      'Set notification preferences'
    ]
  },
  'Microsoft Teams': {
    icon: MessageSquare,
    description: 'Collaborate with your team and receive case updates in Teams',
    features: ['Team collaboration', 'Case notifications', 'Document sharing'],
    setupSteps: [
      'Create a Teams app',
      'Configure webhook URL',
      'Set up notification channels'
    ]
  },
  'Google Calendar': {
    icon: Calendar,
    description: 'Sync court dates, deadlines, and appointments with Google Calendar',
    features: ['Court date sync', 'Deadline reminders', 'Appointment scheduling'],
    setupSteps: [
      'Authorize Google Calendar access',
      'Configure sync settings',
      'Set up calendar preferences'
    ]
  },
  'Zapier': {
    icon: Zap,
    description: 'Connect with 5000+ apps and automate your legal workflows',
    features: ['Workflow automation', 'Data sync', 'Custom integrations'],
    setupSteps: [
      'Create Zapier account',
      'Set up webhook triggers',
      'Configure automation rules'
    ]
  }
};

export function IntegrationSetupModal({ open, onClose, service }: IntegrationSetupModalProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'setup' | 'configure' | 'complete'>('setup');
  const [config, setConfig] = useState<IntegrationConfig>({
    enabled: false,
    syncFrequency: 'hourly',
    syncCases: true,
    syncClients: true,
    syncCalendar: false,
    notifications: true
  });
  const [formData, setFormData] = useState({
    webhookUrl: '',
    apiKey: ''
  });

  const serviceInfo = serviceConfigs[service as keyof typeof serviceConfigs];

  const handleSetup = async () => {
    setLoading(true);
    try {
      // Simulate API call to initiate setup
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep('configure');
      toast({
        title: "Setup Initiated",
        description: `Starting ${service} integration setup...`,
      });
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "Failed to initiate integration setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfigure = async () => {
    setLoading(true);
    try {
      // Simulate API call to configure integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep('complete');
      toast({
        title: "Integration Configured",
        description: `${service} has been successfully connected to your dashboard.`,
      });
    } catch (error) {
      toast({
        title: "Configuration Failed",
        description: "Failed to configure integration. Please check your settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('setup');
    setConfig({
      enabled: false,
      syncFrequency: 'hourly',
      syncCases: true,
      syncClients: true,
      syncCalendar: false,
      notifications: true
    });
    setFormData({ webhookUrl: '', apiKey: '' });
    onClose();
  };

  const ServiceIcon = serviceInfo?.icon || Puzzle;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ServiceIcon className="h-5 w-5" />
            Connect {service}
          </DialogTitle>
          <DialogDescription>
            {serviceInfo?.description || `Connect ${service} to your legal dashboard.`}
          </DialogDescription>
        </DialogHeader>

        {step === 'setup' && (
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <ServiceIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{service} Integration</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {serviceInfo?.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {serviceInfo?.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Setup Requirements</h4>
              <div className="space-y-2">
                {serviceInfo?.setupSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">{index + 1}</span>
                    </div>
                    <span className="text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You'll need admin access to {service} to complete this integration. 
                Make sure you have the necessary permissions before proceeding.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSetup} disabled={loading}>
                {loading ? 'Setting up...' : 'Start Setup'}
              </Button>
            </div>
          </div>
        )}

        {step === 'configure' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  value={formData.webhookUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, webhookUrl: e.target.value }))}
                  placeholder="https://hooks.slack.com/services/..."
                />
                <p className="text-sm text-muted-foreground">
                  Enter the webhook URL from your {service} app configuration
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key (Optional)</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="Enter your API key"
                />
                <p className="text-sm text-muted-foreground">
                  Some integrations require an API key for enhanced functionality
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Sync Settings</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sync Frequency</Label>
                    <p className="text-sm text-muted-foreground">How often to sync data</p>
                  </div>
                  <select
                    value={config.syncFrequency}
                    onChange={(e) => setConfig(prev => ({ ...prev, syncFrequency: e.target.value as any }))}
                    className="px-3 py-1 border rounded-md text-sm"
                  >
                    <option value="realtime">Real-time</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sync Cases</Label>
                    <p className="text-sm text-muted-foreground">Send case updates to {service}</p>
                  </div>
                  <Switch
                    checked={config.syncCases}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, syncCases: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sync Clients</Label>
                    <p className="text-sm text-muted-foreground">Send client updates to {service}</p>
                  </div>
                  <Switch
                    checked={config.syncClients}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, syncClients: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sync Calendar</Label>
                    <p className="text-sm text-muted-foreground">Sync court dates and appointments</p>
                  </div>
                  <Switch
                    checked={config.syncCalendar}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, syncCalendar: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications in {service}</p>
                  </div>
                  <Switch
                    checked={config.notifications}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, notifications: checked }))}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStep('setup')}>
                Back
              </Button>
              <Button onClick={handleConfigure} disabled={loading || !formData.webhookUrl}>
                {loading ? 'Configuring...' : 'Connect & Configure'}
              </Button>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">{service} Connected Successfully!</h3>
              <p className="text-muted-foreground">
                Your {service} integration is now active and configured.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Integration Status</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Connection Active</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Webhook Configured</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Sync Enabled</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Notifications On</span>
                </div>
              </div>
            </div>

            <Alert>
              <Settings className="h-4 w-4" />
              <AlertDescription>
                You can manage this integration settings anytime from the Integrations tab in Settings.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={handleClose}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Go to Settings
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
