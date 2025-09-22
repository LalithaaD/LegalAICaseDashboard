export interface LegalCase {
  id: string;
  clientName: string;
  caseType: 'Personal Injury' | 'Medical Malpractice' | 'Employment' | 'Corporate' | 'Family Law' | 'Criminal Defense' | 'Product Liability' | 'Contract Dispute' | 'Real Estate';
  status: 'Open' | 'Closed' | 'Pending' | 'Settlement';
  filingDate: string;
  estimatedPayout?: number;
  actualPayout?: number;
  aiPrediction: {
    outcome: 'Favorable' | 'Uncertain' | 'Unfavorable';
    confidence: number;
    predictedPayout: number;
  };
  severity: 'Low' | 'Medium' | 'High';
  attorney: string;
  description: string;
}

// AI Prediction Algorithm
export const generateAIPrediction = (caseType: string, severity: string, status: string, estimatedPayout?: number) => {
  const basePayouts = {
    'Personal Injury': 75000,
    'Medical Malpractice': 250000,
    'Employment': 45000,
    'Corporate': 150000,
    'Family Law': 25000,
    'Criminal Defense': 15000,
    'Product Liability': 150000,
    'Contract Dispute': 80000,
    'Real Estate': 45000
  };

  const severityMultipliers = {
    'Low': 0.7,
    'Medium': 1.0,
    'High': 1.5
  };

  const basePayout = basePayouts[caseType as keyof typeof basePayouts] || 50000;
  const multiplier = severityMultipliers[severity as keyof typeof severityMultipliers];
  const variation = 0.7 + Math.random() * 0.6; // 70% to 130% variation
  
  const predictedPayout = Math.round(basePayout * multiplier * variation);
  const confidence = Math.floor(60 + Math.random() * 35); // 60-95% confidence

  let outcome: 'Favorable' | 'Uncertain' | 'Unfavorable';
  if (confidence > 80) outcome = 'Favorable';
  else if (confidence > 65) outcome = 'Uncertain';
  else outcome = 'Unfavorable';

  return {
    outcome,
    confidence,
    predictedPayout
  };
};

export const mockCases: LegalCase[] = [
  {
    id: 'LC-001',
    clientName: 'Sarah Johnson',
    caseType: 'Personal Injury',
    status: 'Open',
    filingDate: '2024-01-15',
    estimatedPayout: 85000,
    aiPrediction: generateAIPrediction('Personal Injury', 'Medium', 'Open', 85000),
    severity: 'Medium',
    attorney: 'Michael Chen',
    description: 'Motor vehicle accident with back injuries'
  },
  {
    id: 'LC-002',
    clientName: 'Robert Martinez',
    caseType: 'Medical Malpractice',
    status: 'Pending',
    filingDate: '2023-11-08',
    estimatedPayout: 320000,
    aiPrediction: generateAIPrediction('Medical Malpractice', 'High', 'Pending', 320000),
    severity: 'High',
    attorney: 'Jessica Williams',
    description: 'Surgical error resulting in permanent disability'
  },
  {
    id: 'LC-003',
    clientName: 'Emily Davis',
    caseType: 'Employment',
    status: 'Closed',
    filingDate: '2023-08-22',
    estimatedPayout: 55000,
    actualPayout: 48000,
    aiPrediction: generateAIPrediction('Employment', 'Medium', 'Closed', 55000),
    severity: 'Medium',
    attorney: 'David Thompson',
    description: 'Wrongful termination and discrimination'
  },
  {
    id: 'LC-004',
    clientName: 'James Wilson',
    caseType: 'Corporate',
    status: 'Settlement',
    filingDate: '2024-02-10',
    estimatedPayout: 180000,
    actualPayout: 165000,
    aiPrediction: generateAIPrediction('Corporate', 'High', 'Settlement', 180000),
    severity: 'High',
    attorney: 'Sarah Anderson',
    description: 'Breach of contract and intellectual property theft'
  },
  {
    id: 'LC-005',
    clientName: 'Lisa Brown',
    caseType: 'Family Law',
    status: 'Open',
    filingDate: '2024-03-05',
    estimatedPayout: 28000,
    aiPrediction: generateAIPrediction('Family Law', 'Low', 'Open', 28000),
    severity: 'Low',
    attorney: 'Michael Chen',
    description: 'Child custody and support dispute'
  },
  {
    id: 'LC-006',
    clientName: 'Kevin Lee',
    caseType: 'Criminal Defense',
    status: 'Closed',
    filingDate: '2023-12-01',
    estimatedPayout: 12000,
    actualPayout: 15000,
    aiPrediction: generateAIPrediction('Criminal Defense', 'Medium', 'Closed', 12000),
    severity: 'Medium',
    attorney: 'Jessica Williams',
    description: 'White collar crime defense'
  },
  {
    id: 'LC-007',
    clientName: 'Amanda Taylor',
    caseType: 'Personal Injury',
    status: 'Pending',
    filingDate: '2024-01-28',
    estimatedPayout: 120000,
    aiPrediction: generateAIPrediction('Personal Injury', 'High', 'Pending', 120000),
    severity: 'High',
    attorney: 'David Thompson',
    description: 'Slip and fall with severe head trauma'
  },
  {
    id: 'LC-008',
    clientName: 'Christopher Garcia',
    caseType: 'Employment',
    status: 'Open',
    filingDate: '2024-02-14',
    estimatedPayout: 65000,
    aiPrediction: generateAIPrediction('Employment', 'Medium', 'Open', 65000),
    severity: 'Medium',
    attorney: 'Sarah Anderson',
    description: 'Workplace harassment and hostile environment'
  },
  {
    id: 'LC-009',
    clientName: 'Michelle Rodriguez',
    caseType: 'Medical Malpractice',
    status: 'Settlement',
    filingDate: '2023-09-15',
    estimatedPayout: 290000,
    actualPayout: 275000,
    aiPrediction: generateAIPrediction('Medical Malpractice', 'High', 'Settlement', 290000),
    severity: 'High',
    attorney: 'Jessica Williams',
    description: 'Misdiagnosis leading to delayed treatment'
  },
  {
    id: 'LC-010',
    clientName: 'Daniel Kim',
    caseType: 'Corporate',
    status: 'Open',
    filingDate: '2024-03-12',
    estimatedPayout: 95000,
    aiPrediction: generateAIPrediction('Corporate', 'Medium', 'Open', 95000),
    severity: 'Medium',
    attorney: 'Michael Chen',
    description: 'Partnership dispute and asset division'
  },
  {
    id: 'LC-011',
    clientName: 'Maria Rodriguez',
    caseType: 'Product Liability',
    status: 'Open',
    filingDate: '2024-03-15',
    estimatedPayout: 125000,
    aiPrediction: generateAIPrediction('Product Liability', 'High', 'Open', 125000),
    severity: 'High',
    attorney: 'David Thompson',
    description: 'Defective product causing injury - consumer electronics'
  }
];

export const getCaseStatistics = () => {
  const totalCases = mockCases.length;
  const openCases = mockCases.filter(c => c.status === 'Open').length;
  const closedCases = mockCases.filter(c => c.status === 'Closed').length;
  const pendingCases = mockCases.filter(c => c.status === 'Pending').length;
  const settlementCases = mockCases.filter(c => c.status === 'Settlement').length;

  const caseTypeDistribution = mockCases.reduce((acc, curr) => {
    acc[curr.caseType] = (acc[curr.caseType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const favorablePredictions = mockCases.filter(c => c.aiPrediction.outcome === 'Favorable').length;
  const successRate = Math.round((favorablePredictions / totalCases) * 100);

  const averagePayout = Math.round(
    mockCases
      .filter(c => c.actualPayout || c.aiPrediction.predictedPayout)
      .reduce((sum, c) => sum + (c.actualPayout || c.aiPrediction.predictedPayout), 0) / 
    mockCases.length
  );

  return {
    totalCases,
    openCases,
    closedCases,
    pendingCases,
    settlementCases,
    caseTypeDistribution,
    aiPredictionSuccessRate: successRate,
    successRate,
    averagePayout
  };
};