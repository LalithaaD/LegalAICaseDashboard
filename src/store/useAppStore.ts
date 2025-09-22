import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LegalCase, mockCases } from '@/data/mockData';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  joinDate: string;
  totalCases: number;
  activeCases: number;
  totalPayout: number;
  status: 'active' | 'inactive';
}

interface Settings {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  layout: 'compact' | 'comfortable';
  autoSave: boolean;
}

interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  lawFirm: string;
  jobTitle: string;
  bio: string;
}

interface AISettings {
  predictions: boolean;
  recommendations: boolean;
  confidenceThreshold: 'low' | 'medium' | 'high';
  autoAnalysis: boolean;
  riskAssessment: boolean;
  documentAnalysis: boolean;
  caseSimilarity: boolean;
  predictionModel: 'basic' | 'advanced' | 'premium';
  learningEnabled: boolean;
}

interface SystemSettings {
  autoBackup: boolean;
  backupFrequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  dataRetention: '1year' | '3years' | '7years' | 'forever';
  performanceMonitoring: boolean;
  errorReporting: boolean;
  analyticsTracking: boolean;
  cacheEnabled: boolean;
  compressionEnabled: boolean;
}

interface AdvancedNotifications {
  caseDeadlines: boolean;
  courtDates: boolean;
  clientUpdates: boolean;
  systemAlerts: boolean;
  securityAlerts: boolean;
  backupStatus: boolean;
  performanceAlerts: boolean;
  emailDigest: 'daily' | 'weekly' | 'monthly' | 'never';
  quietHours: { enabled: boolean; start: string; end: string };
}

interface AppState {
  // Cases
  cases: LegalCase[];
  selectedCase: LegalCase | null;
  caseFilters: {
    search: string;
    status: string;
    caseType: string;
    dateRange: { from?: Date; to?: Date };
  };
  
  // Clients
  clients: Client[];
  selectedClient: Client | null;
  clientFilters: {
    search: string;
    status: string;
  };
  
  // Settings
  settings: Settings;
  profile: Profile;
  aiSettings: AISettings;
  systemSettings: SystemSettings;
  advancedNotifications: AdvancedNotifications;
  
  // UI State
  isLoading: boolean;
  
  // Actions
  setCases: (cases: LegalCase[]) => void;
  addCase: (caseData: Omit<LegalCase, 'id'>) => void;
  updateCase: (id: string, updates: Partial<LegalCase>) => void;
  deleteCase: (id: string) => void;
  setSelectedCase: (caseItem: LegalCase | null) => void;
  setCaseFilters: (filters: Partial<typeof this.caseFilters>) => void;
  
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  setSelectedClient: (client: Client | null) => void;
  setClientFilters: (filters: Partial<typeof this.clientFilters>) => void;
  
  updateSettings: (settings: Partial<Settings>) => void;
  updateProfile: (profile: Partial<Profile>) => void;
  updateAISettings: (aiSettings: Partial<AISettings>) => void;
  updateSystemSettings: (systemSettings: Partial<SystemSettings>) => void;
  updateAdvancedNotifications: (notifications: Partial<AdvancedNotifications>) => void;
  setLoading: (loading: boolean) => void;
}

// Mock clients data
const mockClients: Client[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    company: 'Johnson Enterprises',
    address: '123 Main St, New York, NY 10001',
    joinDate: '2023-01-15',
    totalCases: 3,
    activeCases: 1,
    totalPayout: 275000,
    status: 'active'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@techcorp.com',
    phone: '(555) 987-6543',
    company: 'TechCorp Solutions',
    address: '456 Tech Ave, San Francisco, CA 94105',
    joinDate: '2023-03-22',
    totalCases: 2,
    activeCases: 1,
    totalPayout: 450000,
    status: 'active'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@gmail.com',
    phone: '(555) 456-7890',
    address: '789 Oak St, Los Angeles, CA 90210',
    joinDate: '2022-11-08',
    totalCases: 4,
    activeCases: 0,
    totalPayout: 625000,
    status: 'inactive'
  },
  {
    id: '4',
    name: 'David Thompson',
    email: 'david.thompson@lawcorp.com',
    phone: '(555) 234-5678',
    company: 'Thompson Legal Group',
    address: '321 Legal Ave, Chicago, IL 60601',
    joinDate: '2023-05-10',
    totalCases: 5,
    activeCases: 2,
    totalPayout: 780000,
    status: 'active'
  },
  {
    id: '5',
    name: 'Jennifer Martinez',
    email: 'jennifer.martinez@gmail.com',
    phone: '(555) 345-6789',
    company: 'Martinez & Associates',
    address: '654 Justice St, Miami, FL 33101',
    joinDate: '2023-02-28',
    totalCases: 6,
    activeCases: 3,
    totalPayout: 920000,
    status: 'active'
  },
  {
    id: '6',
    name: 'Robert Wilson',
    email: 'robert.wilson@wilsonlaw.com',
    phone: '(555) 456-7890',
    company: 'Wilson Law Firm',
    address: '987 Court Blvd, Austin, TX 73301',
    joinDate: '2022-09-15',
    totalCases: 8,
    activeCases: 1,
    totalPayout: 1250000,
    status: 'active'
  },
  {
    id: '7',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@andersonlegal.com',
    phone: '(555) 567-8901',
    company: 'Anderson Legal Services',
    address: '147 Liberty Lane, Seattle, WA 98101',
    joinDate: '2023-07-03',
    totalCases: 3,
    activeCases: 2,
    totalPayout: 340000,
    status: 'active'
  },
  {
    id: '8',
    name: 'Mark Davis',
    email: 'mark.davis@davislaw.org',
    phone: '(555) 678-9012',
    company: 'Davis Law Office',
    address: '258 Constitution Way, Boston, MA 02101',
    joinDate: '2022-12-20',
    totalCases: 7,
    activeCases: 0,
    totalPayout: 890000,
    status: 'inactive'
  },
  {
    id: '9',
    name: 'Amanda Garcia',
    email: 'amanda.garcia@garcialegal.net',
    phone: '(555) 789-0123',
    company: 'Garcia Legal Consultants',
    address: '369 Counsel Court, Phoenix, AZ 85001',
    joinDate: '2023-04-12',
    totalCases: 4,
    activeCases: 1,
    totalPayout: 567000,
    status: 'active'
  },
  {
    id: '10',
    name: 'Christopher Brown',
    email: 'christopher.brown@brownlaw.com',
    phone: '(555) 890-1234',
    company: 'Brown & Partners',
    address: '741 Advocate Ave, Denver, CO 80201',
    joinDate: '2023-01-08',
    totalCases: 9,
    activeCases: 4,
    totalPayout: 1450000,
    status: 'active'
  }
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      cases: mockCases,
      selectedCase: null,
      caseFilters: {
        search: '',
        status: '',
        caseType: '',
        dateRange: {}
      },
      
      clients: mockClients,
      selectedClient: null,
      clientFilters: {
        search: '',
        status: ''
      },
      
      settings: {
        theme: 'system',
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        layout: 'comfortable',
        autoSave: true
      },
      
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        lawFirm: 'Doe & Associates',
        jobTitle: 'Senior Partner',
        bio: 'Brief professional summary...'
      },
      
      aiSettings: {
        predictions: true,
        recommendations: true,
        confidenceThreshold: 'medium',
        autoAnalysis: false,
        riskAssessment: true,
        documentAnalysis: true,
        caseSimilarity: true,
        predictionModel: 'advanced',
        learningEnabled: true
      },
      
      systemSettings: {
        autoBackup: true,
        backupFrequency: 'daily',
        dataRetention: '7years',
        performanceMonitoring: true,
        errorReporting: true,
        analyticsTracking: true,
        cacheEnabled: true,
        compressionEnabled: true
      },
      
      advancedNotifications: {
        caseDeadlines: true,
        courtDates: true,
        clientUpdates: true,
        systemAlerts: true,
        securityAlerts: true,
        backupStatus: false,
        performanceAlerts: false,
        emailDigest: 'weekly',
        quietHours: { enabled: false, start: '22:00', end: '08:00' }
      },
      
      isLoading: false,
      
      // Case actions
      setCases: (cases) => set({ cases }),
      
      addCase: (caseData) => {
        const newCase: LegalCase = {
          ...caseData,
          id: `case-${Date.now()}`,
        };
        set((state) => ({ cases: [...state.cases, newCase] }));
      },
      
      updateCase: (id, updates) => {
        set((state) => ({
          cases: state.cases.map((caseItem) =>
            caseItem.id === id ? { ...caseItem, ...updates } : caseItem
          )
        }));
      },
      
      deleteCase: (id) => {
        set((state) => ({
          cases: state.cases.filter((caseItem) => caseItem.id !== id)
        }));
      },
      
      setSelectedCase: (caseItem) => set({ selectedCase: caseItem }),
      
      setCaseFilters: (filters) => {
        set((state) => ({
          caseFilters: { ...state.caseFilters, ...filters }
        }));
      },
      
      // Client actions
      addClient: (clientData) => {
        const newClient: Client = {
          ...clientData,
          id: `client-${Date.now()}`,
        };
        set((state) => ({ 
          clients: [...state.clients, newClient].sort((a, b) => a.name.localeCompare(b.name))
        }));
      },
      
      updateClient: (id, updates) => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === id ? { ...client, ...updates } : client
          ).sort((a, b) => a.name.localeCompare(b.name))
        }));
      },
      
      deleteClient: (id) => {
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== id)
        }));
      },
      
      setSelectedClient: (client) => set({ selectedClient: client }),
      
      setClientFilters: (filters) => {
        set((state) => ({
          clientFilters: { ...state.clientFilters, ...filters }
        }));
      },
      
      // Settings actions
      updateSettings: (settings) => {
        set((state) => ({
          settings: { ...state.settings, ...settings }
        }));
      },
      
      updateProfile: (profile) => {
        set((state) => ({
          profile: { ...state.profile, ...profile }
        }));
      },
      
      updateAISettings: (aiSettings) => {
        set((state) => ({
          aiSettings: { ...state.aiSettings, ...aiSettings }
        }));
      },
      
      updateSystemSettings: (systemSettings) => {
        set((state) => ({
          systemSettings: { ...state.systemSettings, ...systemSettings }
        }));
      },
      
      updateAdvancedNotifications: (notifications) => {
        set((state) => ({
          advancedNotifications: { ...state.advancedNotifications, ...notifications }
        }));
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'legal-dashboard-storage',
      partialize: (state) => ({
        settings: state.settings,
        profile: state.profile,
        aiSettings: state.aiSettings,
        systemSettings: state.systemSettings,
        advancedNotifications: state.advancedNotifications,
        cases: state.cases,
        clients: state.clients
      }),
    }
  )
);