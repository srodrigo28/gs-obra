import type {
  AccountProfile,
  BottomNavItem,
  CompanyProfile,
  DashboardChartSlice,
  DashboardRangeTab,
  DashboardScopeTab,
  DashboardSummary,
  MenuItem,
  PreferencesProfile,
  ProfileTab,
  UserProfile,
} from '@/types/mock-types';

export const mockUserProfile: UserProfile = {
  id: 'user-admin',
  name: 'Administrador GS',
  email: 'admin@gmail.com',
  role: 'Prestador de Servico',
  phone: '(11) 98888-7766',
  city: 'Sao Paulo',
  state: 'SP',
};

export const mockDrawerMenuItems: MenuItem[] = [
  { id: 'dashboard', icon: 'home', label: 'Dashboard', color: '#2F8F57' },
  { id: 'obras', icon: 'briefcase-outline', label: 'Obras', color: '#E9B949' },
  { id: 'lancamentos', icon: 'swap-horizontal-outline', label: 'Lancamentos', color: '#E7605A' },
  { id: 'orcamentos', icon: 'document-text-outline', label: 'Orcamentos', color: '#34A8B6' },
  { id: 'categorias', icon: 'pricetags-outline', label: 'Categorias', color: '#F2C14E' },
  { id: 'relatorios', icon: 'bar-chart-outline', label: 'Relatorios', color: '#2F8F57' },
  { id: 'perfil', icon: 'person-outline', label: 'Meu Perfil', color: '#AAB2B9', route: '/perfil' },
  { id: 'configuracoes', icon: 'settings-outline', label: 'Configuracoes', color: '#AAB2B9' },
];

export const mockBottomNavItems: BottomNavItem[] = [
  { id: 'home', icon: 'home', label: 'Home', active: true },
  { id: 'obras', icon: 'document-text-outline', label: 'Obras' },
  { id: 'orcamentos', icon: 'wallet-outline', label: 'Orcamentos' },
  { id: 'perfil', icon: 'person-outline', label: 'Perfil' },
];

export const mockDashboardSummary: DashboardSummary = {
  label: 'Total',
  value: 'R$ 3.450',
};

export const mockDashboardScopeTabs: DashboardScopeTab[] = [
  { id: 'gastos', label: 'Gastos', active: true },
  { id: 'semana', label: 'Semana' },
  { id: 'fundo', label: 'Fundo' },
];

export const mockDashboardRangeTabs: DashboardRangeTab[] = [
  { id: 'dia', label: 'Dia' },
  { id: 'semana', label: 'Semana', active: true },
  { id: 'mes', label: 'Mes' },
  { id: 'fundo', label: 'Fundo' },
];

export const mockDashboardChartSlices: DashboardChartSlice[] = [
  {
    id: 'material',
    label: 'Material',
    percent: 52,
    amount: 520,
    color: '#FF313F',
    icon: 'construct-outline',
  },
  {
    id: 'transporte',
    label: 'Transporte',
    percent: 28,
    amount: 280,
    color: '#36C0D8',
    icon: 'bus-outline',
  },
  {
    id: 'alimentacao',
    label: 'Alimentacao',
    percent: 20,
    amount: 200,
    color: '#F5C518',
    icon: 'restaurant-outline',
  },
];

export const mockProfileTabs: ProfileTab[] = [
  { id: 'empresa', label: 'Dados da Empresa', icon: 'business-outline' },
  { id: 'conta', label: 'Conta', icon: 'person-outline' },
  { id: 'preferencias', label: 'Preferencias', icon: 'settings-outline' },
];

export const mockCompanyProfile: CompanyProfile = {
  logoLabel: 'Clique para enviar ou arraste uma imagem',
  tradeName: 'GS Financeira',
  legalName: 'GS Financeira Ltda',
  cnpj: '00.000.000/0001-00',
  email: 'admin@gmail.com',
  cep: '01001-000',
  street: 'Praca da Se',
  number: '123',
  district: 'Se',
  city: 'Sao Paulo',
  state: 'SP',
  complement: 'Sala 12, Andar 3, Bloco A',
};

export const mockAccountProfile: AccountProfile = {
  avatarLabel: 'Avatar',
  fullName: 'Administrador GS',
  phone: '(11) 98888-7766',
  currentPassword: '12345678',
  newPassword: '12345678',
  confirmPassword: '12345678',
  receiveNews: true,
  receiveAlerts: true,
};

export const mockPreferencesProfile: PreferencesProfile = {
  theme: 'Claro',
  currency: 'R$ Real brasileiro',
  defaultTerm: '30 dias',
  receiveNews: true,
  receiveAlerts: true,
  automaticBackup: 'Diario, as 03:00 da manha',
  currentPlan: 'premium',
};
