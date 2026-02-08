import { useState, useEffect } from 'react';
import api from '../api.js';



import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Building,
  MapPin,
  Globe,
  Phone,
  Mail,
  Users,
  DollarSign,
  TrendingUp,
  Target,
  Calendar,
  Award,
  Edit3,
  Save,
  X,
} from 'lucide-react';

interface EditableProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StartupData {
  companyName: string;
  legalName: string;
  registrationStatus: string;
  industry: string;
  stage: string;
  location: string;
  website: string;
  email: string;
  phone: string;
  founders: {
    name: string;
    role: string;
    education: string;
    experience: string;
    equity: string;
    linkedin: string;
  }[];
  business: {
    problemStatement: string;
    solution: string;
    targetMarket: string;
    revenueModel: string;
    pricing: string;
    competitiveAdvantage: string;
  };
  market: {
    marketSize: string;
    currentCustomers: number;
    monthlyRevenue: string;
    growthRate: string;
    achievements: string[];
  };
  financial: {
    currentRevenue: string;
    burnRate: string;
    cashPosition: string;
    projectedRevenue: string;
    breakEvenTimeline: string;
  };
  funding: {
    requiredAmount: string;
    currentStage: string;
    previousFunding: string;
    useOfFunds: Record<string, string>;
    equityDilution: string;
    valuation: string;
  };
  team: {
    currentSize: number;
    keyMembers: string[];
    techStack: string[];
  };
}

// Default data for new users
const defaultStartupData = {
  companyName: 'TechFlow Solutions',
  legalName: 'TechFlow Solutions Pvt Ltd',
  registrationStatus: 'Pvt Ltd',
  industry: 'FinTech',
  stage: 'MVP',
  location: 'Bangalore, Karnataka',
  website: 'https://techflowsolutions.com',
  email: 'founder@techflowsolutions.com',
  phone: '+91 98765 43210',
  founders: [
    {
      name: 'John Smith',
      role: 'CEO & Co-Founder',
      education: 'MBA - IIM Bangalore, B.Tech - IIT Delhi',
      experience: '8 years in FinTech and Banking',
      equity: '40%',
      linkedin: 'linkedin.com/in/johnsmith'
    },
    {
      name: 'Sarah Johnson',
      role: 'CTO & Co-Founder',
      education: 'M.Tech - IIT Bombay, B.Tech - BITS Pilani',
      experience: '6 years in Software Development',
      equity: '35%',
      linkedin: 'linkedin.com/in/sarahjohnson'
    }
  ],
  business: {
    problemStatement: 'Small businesses struggle with complex financial management and lack access to affordable digital banking solutions.',
    solution: 'TechFlow provides an all-in-one financial management platform specifically designed for SMEs, offering automated bookkeeping, expense tracking, invoice management, and integrated payment solutions.',
    targetMarket: 'Small and Medium Enterprises (SMEs) with 10-500 employees',
    revenueModel: 'SaaS subscription model with tiered pricing',
    pricing: '₹2,999/month for basic, ₹7,999/month for premium',
    competitiveAdvantage: 'AI-powered financial insights and seamless integration with Indian banking systems'
  },
  market: {
    marketSize: '₹15,000 Cr TAM, ₹3,000 Cr SAM',
    currentCustomers: 450,
    monthlyRevenue: '₹12,50,000',
    growthRate: '25% MoM',
    achievements: ['Winner - TechCrunch Disrupt Bangalore 2024', 'Selected for Y Combinator India', '50+ Enterprise clients']
  },
  financial: {
    currentRevenue: '₹12,50,000',
    burnRate: '₹8,00,000',
    cashPosition: '₹45,00,000',
    projectedRevenue: '₹2.5 Cr (12 months), ₹8 Cr (24 months)',
    breakEvenTimeline: '18 months'
  },
  funding: {
    requiredAmount: '₹3.5 Cr',
    currentStage: 'Seed',
    previousFunding: '₹75 lakhs (Pre-seed)',
    useOfFunds: {
      'Product Development': '35%',
      'Marketing & Sales': '30%',
      'Team Expansion': '25%',
      'Operations': '10%'
    },
    equityDilution: '20%',
    valuation: '₹17.5 Cr'
  },
  team: {
    currentSize: 12,
    keyMembers: [
      'Rajesh Kumar - Head of Engineering',
      'Priya Sharma - Head of Marketing',
      'Amit Patel - Head of Sales'
    ],
    techStack: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker']
  }
};

export function EditableProfileModal({ isOpen, onClose }: EditableProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [startupData, setStartupData] = useState<StartupData | null>(defaultStartupData);

  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Fetch startup data from backend on mount (using email as a key for demo)
  useEffect(() => {
    async function fetchStartup() {
      try {
        // Replace with a real user/email lookup in production
        const email = 'founder@techflowsolutions.com';
        const res = await api.get(`/api/startups`);
        const found = res.data.find((s) => s.contact_email === email);
        if (found) {
          setStartupData({
            companyName: found.company_name || '',
            legalName: found.brand_name || '',
            registrationStatus: found.registration_status || '',
            industry: found.industry_sector || '',
            stage: found.stage || '',
            location: (found.location_city || '') + (found.location_state ? ', ' + found.location_state : ''),
            website: found.website || '',
            email: found.contact_email || '',
            phone: found.contact_phone || '',
            founders: found.founders || [], // This may need mapping if backend returns founders
            business: {
              problemStatement: found.problem_statement || '',
              solution: found.solution_description || '',
              targetMarket: found.target_market || '',
              revenueModel: found.revenue_model || '',
              pricing: found.pricing_strategy || '',
              competitiveAdvantage: found.competitive_advantage || '',
            },
            market: {
              marketSize: found.market_size_tam ? String(found.market_size_tam) : '',
              currentCustomers: found.current_customers || 0,
              monthlyRevenue: found.monthly_revenue ? String(found.monthly_revenue) : '',
              growthRate: found.growth_rate ? String(found.growth_rate) : '',
              achievements: found.key_achievements || [],
            },
            financial: {
              currentRevenue: found.monthly_revenue ? String(found.monthly_revenue) : '',
              burnRate: found.monthly_burn_rate ? String(found.monthly_burn_rate) : '',
              cashPosition: found.current_cash_position ? String(found.current_cash_position) : '',
              projectedRevenue: found.revenue_projections || '',
              breakEvenTimeline: found.break_even_timeline || '',
            },
            funding: {
              requiredAmount: found.funding_amount_required ? String(found.funding_amount_required) : '',
              currentStage: found.funding_stage || '',
              previousFunding: found.previous_funding ? String(found.previous_funding) : '',
              useOfFunds: found.use_of_funds || {},
              equityDilution: found.equity_dilution ? String(found.equity_dilution) : '',
              valuation: found.valuation_expectations ? String(found.valuation_expectations) : '',
            },
            team: {
              currentSize: found.team_size || 0,
              keyMembers: [],
              techStack: found.technology_stack || [],
            },
          });
        } else {
          // If not found, use default
          setStartupData(defaultStartupData);
        }
      } catch {
        setStartupData(defaultStartupData);
      }
    }
    fetchStartup();
  }, []);


  // Map the local state to the backend expected format
  function mapToBackend(data: StartupData) {
    return {
      company_name: data.companyName,
      brand_name: data.legalName,
      registration_status: data.registrationStatus,
      industry_sector: data.industry,
      stage: data.stage,
      location_city: data.location.split(',')[0],
      location_state: data.location.split(',')[1]?.trim() || '',
      website: data.website,
      contact_email: data.email,
      contact_phone: data.phone,
      founders: data.founders.map(f => ({
        name: f.name,
        role: f.role,
        education_degree: f.education,
        professional_experience: f.experience,
        equity_stake: parseFloat(f.equity) || 0,
        linkedin_profile: f.linkedin,
      })),
      problem_statement: data.business.problemStatement,
      solution_description: data.business.solution,
      target_market: data.business.targetMarket,
      revenue_model: data.business.revenueModel,
      pricing_strategy: data.business.pricing,
      competitive_advantage: data.business.competitiveAdvantage,
      market_size_tam: parseFloat(data.market.marketSize) || null,
      current_customers: data.market.currentCustomers,
      monthly_revenue: parseFloat(data.market.monthlyRevenue) || null,
      growth_rate: parseFloat(data.market.growthRate) || null,
      key_achievements: data.market.achievements,
      monthly_burn_rate: parseFloat(data.financial.burnRate) || null,
      current_cash_position: parseFloat(data.financial.cashPosition) || null,
      revenue_projections: data.financial.projectedRevenue,
      break_even_timeline: data.financial.breakEvenTimeline,
      funding_amount_required: parseFloat(data.funding.requiredAmount) || null,
      funding_stage: data.funding.currentStage,
      previous_funding: parseFloat(data.funding.previousFunding) || null,
      use_of_funds: data.funding.useOfFunds,
      equity_dilution: parseFloat(data.funding.equityDilution) || null,
      valuation_expectations: parseFloat(data.funding.valuation) || null,
      team_size: data.team.currentSize,
      technology_stack: data.team.techStack,
      operational_metrics: {},
      is_active: true,
    };
  }

  const handleSave = async () => {
    setSaveStatus(null);
    try {
      if (!startupData) return;
      const payload = mapToBackend(startupData);
      await api.post('/api/signup/entrepreneur', payload);
      setSaveStatus('success');
      setIsEditing(false);
      // Refetch to get latest data
      const res = await api.get(`/api/startups`);
      const found = res.data.find((s) => s.contact_email === startupData.email);
      if (found) {
        // Update state with backend data
        // (mapping logic as above)
      }
    } catch (error) {
      setSaveStatus('error');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset changes if needed
  };

  const updateField = (path: string, value: any) => {
    setStartupData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  if (!startupData) return <div>Loading...</div>;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {saveStatus === 'success' && (
        <div style={{ color: 'green', margin: 8 }}>Profile saved successfully!</div>
      )}
      {saveStatus === 'error' && (
        <div style={{ color: 'red', margin: 8 }}>Failed to save profile. Please try again.</div>
      )}
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl text-foreground">
            Startup Profile
          </DialogTitle>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} size="sm" className="bg-primary text-primary-foreground">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Company Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 ring-2 ring-border">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    TF
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  {isEditing ? (
                    <>
                      <Input
                        value={startupData.companyName}
                        onChange={(e) => updateField('companyName', e.target.value)}
                        className="text-xl font-bold"
                        placeholder="Company Name"
                      />
                      <Input
                        value={startupData.legalName}
                        onChange={(e) => updateField('legalName', e.target.value)}
                        placeholder="Legal Name"
                      />
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold">{startupData.companyName}</h3>
                      <p className="text-muted-foreground">{startupData.legalName}</p>
                    </>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">{startupData.registrationStatus}</Badge>
                    <Badge variant="outline">{startupData.industry}</Badge>
                    <Badge variant="outline">{startupData.stage}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      value={startupData.location}
                      onChange={(e) => updateField('location', e.target.value)}
                      className="text-sm"
                    />
                  ) : (
                    <span className="text-sm">{startupData.location}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      value={startupData.website}
                      onChange={(e) => updateField('website', e.target.value)}
                      className="text-sm"
                    />
                  ) : (
                    <span className="text-sm">{startupData.website}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      value={startupData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="text-sm"
                    />
                  ) : (
                    <span className="text-sm">{startupData.email}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market & Traction - Editable metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Market & Traction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  {isEditing ? (
                    <Input
                      type="number"
                      value={startupData.market.currentCustomers}
                      onChange={(e) => updateField('market.currentCustomers', parseInt(e.target.value))}
                      className="text-center"
                    />
                  ) : (
                    <div className="text-2xl font-bold text-primary">{startupData.market.currentCustomers}</div>
                  )}
                  <div className="text-xs text-muted-foreground">Customers</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  {isEditing ? (
                    <Input
                      value={startupData.market.monthlyRevenue}
                      onChange={(e) => updateField('market.monthlyRevenue', e.target.value)}
                      className="text-center"
                    />
                  ) : (
                    <div className="text-2xl font-bold text-primary">{startupData.market.monthlyRevenue}</div>
                  )}
                  <div className="text-xs text-muted-foreground">Monthly Revenue</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  {isEditing ? (
                    <Input
                      value={startupData.market.growthRate}
                      onChange={(e) => updateField('market.growthRate', e.target.value)}
                      className="text-center"
                    />
                  ) : (
                    <div className="text-2xl font-bold text-primary">{startupData.market.growthRate}</div>
                  )}
                  <div className="text-xs text-muted-foreground">Growth Rate</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  {isEditing ? (
                    <Input
                      type="number"
                      value={startupData.team.currentSize}
                      onChange={(e) => updateField('team.currentSize', parseInt(e.target.value))}
                      className="text-center"
                    />
                  ) : (
                    <div className="text-2xl font-bold text-primary">{startupData.team.currentSize}</div>
                  )}
                  <div className="text-xs text-muted-foreground">Team Size</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Funding Requirements - Editable */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Funding Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  {isEditing ? (
                    <Input
                      value={startupData.funding.requiredAmount}
                      onChange={(e) => updateField('funding.requiredAmount', e.target.value)}
                      className="text-center"
                    />
                  ) : (
                    <div className="text-xl font-bold text-primary">{startupData.funding.requiredAmount}</div>
                  )}
                  <div className="text-sm text-muted-foreground">Funding Required</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  {isEditing ? (
                    <Input
                      value={startupData.funding.equityDilution}
                      onChange={(e) => updateField('funding.equityDilution', e.target.value)}
                      className="text-center"
                    />
                  ) : (
                    <div className="text-xl font-bold text-primary">{startupData.funding.equityDilution}</div>
                  )}
                  <div className="text-sm text-muted-foreground">Equity Dilution</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  {isEditing ? (
                    <Input
                      value={startupData.funding.valuation}
                      onChange={(e) => updateField('funding.valuation', e.target.value)}
                      className="text-center"
                    />
                  ) : (
                    <div className="text-xl font-bold text-primary">{startupData.funding.valuation}</div>
                  )}
                  <div className="text-sm text-muted-foreground">Valuation</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Use of Funds</h4>
                <div className="space-y-2">
                  {Object.entries(startupData.funding.useOfFunds).map(([category, percentage]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-sm">{category}</span>
                      {isEditing ? (
                        <Input
                          value={percentage}
                          onChange={(e) => updateField(`funding.useOfFunds.${category}`, e.target.value)}
                          className="w-20 text-center"
                        />
                      ) : (
                        <Badge variant="outline">{percentage}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Model */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Business Model
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Problem Statement</h4>
                {isEditing ? (
                  <Textarea
                    value={startupData.business.problemStatement}
                    onChange={(e) => updateField('business.problemStatement', e.target.value)}
                    className="min-h-[60px]"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{startupData.business.problemStatement}</p>
                )}
              </div>
              <div>
                <h4 className="font-semibold mb-2">Solution</h4>
                {isEditing ? (
                  <Textarea
                    value={startupData.business.solution}
                    onChange={(e) => updateField('business.solution', e.target.value)}
                    className="min-h-[80px]"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{startupData.business.solution}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}