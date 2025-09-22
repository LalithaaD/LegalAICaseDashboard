import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, ExternalLink, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EmailTemplatePreviewProps {
  inviteData: {
    email: string;
    role: string;
    message: string;
    inviterName: string;
    inviterEmail: string;
    lawFirm: string;
    inviteLink: string;
  };
}

export function EmailTemplatePreview({ inviteData }: EmailTemplatePreviewProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Email content has been copied to your clipboard.",
    });
  };

  const emailContent = `
Subject: You're invited to join ${inviteData.lawFirm} on LegalAI Dashboard

Dear ${inviteData.email.split('@')[0]},

${inviteData.inviterName} has invited you to join ${inviteData.lawFirm} on our LegalAI Dashboard.

Your Role: ${inviteData.role}
${inviteData.message}

To accept this invitation, click the link below:
${inviteData.inviteLink}

This invitation will expire in 7 days.

Best regards,
The ${inviteData.lawFirm} Team

---
This email was sent from LegalAI Dashboard
  `.trim();

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">To:</span>
            <span className="text-sm">{inviteData.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">From:</span>
            <span className="text-sm">{inviteData.inviterName} &lt;{inviteData.inviterEmail}&gt;</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Subject:</span>
            <span className="text-sm">You're invited to join {inviteData.lawFirm} on LegalAI Dashboard</span>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-muted/50">
          <div className="space-y-3">
            <div>
              <p className="text-sm">
                Dear {inviteData.email.split('@')[0]},
              </p>
            </div>
            
            <div>
              <p className="text-sm">
                {inviteData.inviterName} has invited you to join {inviteData.lawFirm} on our LegalAI Dashboard.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Your Role:</span>
              <Badge variant="secondary">{inviteData.role}</Badge>
            </div>

            {inviteData.message && (
              <div>
                <p className="text-sm">{inviteData.message}</p>
              </div>
            )}

            <div className="pt-2">
              <Button size="sm" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                Accept Invitation
              </Button>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                This invitation will expire in 7 days.
              </p>
            </div>

            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Best regards,<br />
                The {inviteData.lawFirm} Team
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => copyToClipboard(emailContent)}
            className="flex-1"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Email Content
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => copyToClipboard(inviteData.inviteLink)}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Invite Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
