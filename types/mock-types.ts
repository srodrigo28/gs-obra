export type UserRole = 'Prestador de Servico' | 'Administrador';

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  city: string;
  state: string;
};

export type MenuItem = {
  id: string;
  icon: string;
  label: string;
  color: string;
  active?: boolean;
  route?: string;
};

export type BottomNavItem = {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
};

export type DashboardScopeTab = {
  id: string;
  label: string;
  active?: boolean;
};

export type DashboardRangeTab = {
  id: string;
  label: string;
  active?: boolean;
};

export type DashboardSummary = {
  label: string;
  value: string;
};

export type DashboardChartSlice = {
  id: string;
  label: string;
  percent: number;
  amount: number;
  color: string;
  icon: string;
};

export type CostCenterStatus = 'ativo' | 'concluido' | 'arquivado';

export type CostCenter = {
  id: string;
  name: string;
  clientName: string;
  status: CostCenterStatus;
  balance: number;
};

export type DashboardHighlight = {
  id: string;
  title: string;
  value: string;
  tone: 'success' | 'warning' | 'info';
};

export type ProfileTabId = 'empresa' | 'conta' | 'preferencias';

export type ProfileTab = {
  id: ProfileTabId;
  label: string;
  icon: string;
};

export type CompanyProfile = {
  logoLabel: string;
  tradeName: string;
  legalName: string;
  cnpj: string;
  email: string;
  cep: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  complement: string;
};

export type AccountProfile = {
  avatarLabel: string;
  fullName: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  receiveNews: boolean;
  receiveAlerts: boolean;
};

export type PreferencesProfile = {
  theme: 'Claro' | 'Escuro';
  currency: string;
  defaultTerm: string;
  receiveNews: boolean;
  receiveAlerts: boolean;
  automaticBackup: string;
  currentPlan: 'free' | 'premium';
};

export type ProfileCompletion = {
  percent: number;
  completedFields: number;
  totalFields: number;
  title: string;
  description: string;
};
