import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_legal_dashboard';
const EMAILJS_TEMPLATE_ID = 'template_team_invite';
const EMAILJS_PUBLIC_KEY: string = 'your_public_key_here'; // You'll need to get this from EmailJS

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export interface TeamInviteData {
  email: string;
  role: string;
  message: string;
  inviterName: string;
  inviterEmail: string;
  lawFirm: string;
  inviteLink: string;
}

export interface PasswordResetData {
  email: string;
  resetLink: string;
  userName: string;
}

export interface CaseUpdateData {
  email: string;
  caseTitle: string;
  caseId: string;
  updateType: string;
  updateMessage: string;
  caseLink: string;
}

class EmailService {
  private isConfigured = false;

  constructor() {
    // Check if EmailJS is properly configured
    this.isConfigured = EMAILJS_PUBLIC_KEY !== 'your_public_key_here' && 
                       EMAILJS_PUBLIC_KEY.length > 0;
  }

  /**
   * Send team invitation email
   */
  async sendTeamInvite(data: TeamInviteData): Promise<boolean> {
    if (!this.isConfigured) {
      console.warn('EmailJS not configured. Email would be sent with data:', data);
      return this.simulateEmailSend('Team Invitation', data);
    }

    try {
      const templateParams = {
        to_email: data.email,
        to_name: data.email.split('@')[0],
        role: data.role,
        message: data.message,
        inviter_name: data.inviterName,
        inviter_email: data.inviterEmail,
        law_firm: data.lawFirm,
        invite_link: data.inviteLink,
        reply_to: data.inviterEmail
      };

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      console.log('Email sent successfully:', result);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(data: PasswordResetData): Promise<boolean> {
    if (!this.isConfigured) {
      console.warn('EmailJS not configured. Password reset email would be sent with data:', data);
      return this.simulateEmailSend('Password Reset', data);
    }

    try {
      const templateParams = {
        to_email: data.email,
        to_name: data.userName,
        reset_link: data.resetLink,
        reply_to: 'noreply@legalai.com'
      };

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        'template_password_reset',
        templateParams
      );

      console.log('Password reset email sent successfully:', result);
      return true;
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return false;
    }
  }

  /**
   * Send case update notification
   */
  async sendCaseUpdate(data: CaseUpdateData): Promise<boolean> {
    if (!this.isConfigured) {
      console.warn('EmailJS not configured. Case update email would be sent with data:', data);
      return this.simulateEmailSend('Case Update', data);
    }

    try {
      const templateParams = {
        to_email: data.email,
        case_title: data.caseTitle,
        case_id: data.caseId,
        update_type: data.updateType,
        update_message: data.updateMessage,
        case_link: data.caseLink,
        reply_to: 'noreply@legalai.com'
      };

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        'template_case_update',
        templateParams
      );

      console.log('Case update email sent successfully:', result);
      return true;
    } catch (error) {
      console.error('Failed to send case update email:', error);
      return false;
    }
  }

  /**
   * Simulate email sending when EmailJS is not configured
   */
  private async simulateEmailSend(type: string, data: any): Promise<boolean> {
    console.log(`📧 ${type} Email Simulation:`);
    console.log('To:', data.email || data.to_email);
    console.log('Data:', data);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  }

  /**
   * Check if email service is configured
   */
  isEmailConfigured(): boolean {
    return this.isConfigured;
  }

  /**
   * Get configuration status
   */
  getConfigurationStatus() {
    return {
      configured: this.isConfigured,
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID,
      publicKey: this.isConfigured ? '***configured***' : 'not configured'
    };
  }
}

export const emailService = new EmailService();
