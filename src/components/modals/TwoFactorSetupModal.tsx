import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, Smartphone, Copy, CheckCircle, AlertTriangle, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TwoFactorSetupModalProps {
  open: boolean;
  onClose: () => void;
}

export function TwoFactorSetupModal({ open, onClose }: TwoFactorSetupModalProps) {
  const [step, setStep] = useState<'setup' | 'verify' | 'complete'>('setup');
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [qrCodeData, setQrCodeData] = useState('');
  const [secretKey, setSecretKey] = useState('');

  // Generate mock data for demonstration
  useEffect(() => {
    if (open && step === 'setup') {
      // Generate a mock secret key and QR code data
      const mockSecret = 'JBSWY3DPEHPK3PXP';
      const mockQrData = `otpauth://totp/LegalAI%20Dashboard:user@example.com?secret=${mockSecret}&issuer=LegalAI%20Dashboard`;
      
      setSecretKey(mockSecret);
      setQrCodeData(mockQrData);
      
      // Generate backup codes
      const codes = Array.from({ length: 10 }, () => 
        Math.random().toString(36).substring(2, 8).toUpperCase()
      );
      setBackupCodes(codes);
    }
  }, [open, step]);

  const handleSetup2FA = async () => {
    setLoading(true);
    try {
      // Simulate API call to enable 2FA
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('verify');
      toast({
        title: "2FA Setup Initiated",
        description: "Please scan the QR code with your authenticator app and enter the verification code.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to setup 2FA. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to verify the code
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('complete');
      toast({
        title: "2FA Enabled Successfully",
        description: "Two-factor authentication has been enabled for your account.",
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: `${label} has been copied to your clipboard.`,
    });
  };

  const downloadBackupCodes = () => {
    const content = `LegalAI Dashboard - Backup Codes\n\nSave these codes in a secure location. Each code can only be used once.\n\n${backupCodes.join('\n')}\n\nGenerated: ${new Date().toLocaleString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'legalai-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Backup Codes Downloaded",
      description: "Your backup codes have been downloaded. Keep them in a secure location.",
    });
  };

  const handleClose = () => {
    setStep('setup');
    setVerificationCode('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Two-Factor Authentication Setup
          </DialogTitle>
          <DialogDescription>
            Add an extra layer of security to your account with two-factor authentication.
          </DialogDescription>
        </DialogHeader>

        {step === 'setup' && (
          <div className="space-y-6">
            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertDescription>
                You'll need an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Step 1: Scan QR Code</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Open your authenticator app and scan this QR code:
                </p>
                <div className="flex justify-center p-4 bg-white border rounded-lg">
                  {/* Mock QR Code - In a real app, you'd use a QR code library */}
                  <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-black rounded grid grid-cols-8 gap-1 p-2">
                        {Array.from({ length: 64 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 h-1 rounded-sm ${
                              Math.random() > 0.5 ? 'bg-white' : 'bg-black'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">QR Code</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Step 2: Manual Entry (Alternative)</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  If you can't scan the QR code, enter this secret key manually:
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    value={secretKey}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(secretKey, 'Secret key')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSetup2FA} disabled={loading}>
                {loading ? 'Setting up...' : 'Continue'}
              </Button>
            </div>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Enter the 6-digit code from your authenticator app to complete the setup.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <Label htmlFor="verificationCode">Verification Code</Label>
                <Input
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="text-center text-2xl font-mono tracking-widest"
                  maxLength={6}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStep('setup')}>
                Back
              </Button>
              <Button onClick={handleVerifyCode} disabled={loading || verificationCode.length !== 6}>
                {loading ? 'Verifying...' : 'Verify & Enable'}
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
              <h3 className="text-lg font-semibold">2FA Enabled Successfully!</h3>
              <p className="text-muted-foreground">
                Two-factor authentication is now active on your account.
              </p>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Save your backup codes in a secure location. 
                You can use these codes to access your account if you lose your authenticator device.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Backup Codes</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadBackupCodes}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 p-3 bg-muted rounded-lg">
                {backupCodes.map((code, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <code className="text-sm font-mono">{code}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(code, 'Backup code')}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Each backup code can only be used once. Generate new codes if you run out.
              </p>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleClose}>
                Complete Setup
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
