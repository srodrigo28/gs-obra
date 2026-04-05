import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { useSession } from '@/hooks/use-session';
import {
  mockAccountProfile,
  mockCompanyProfile,
  mockPreferencesProfile,
  mockProfileTabs,
} from '@/mocks/dashboard';
import { fetchAddressByCep } from '@/services/viacep';
import type {
  AccountProfile,
  CompanyProfile,
  PreferencesProfile,
  ProfileCompletion,
  ProfileTabId,
} from '@/types/mock-types';
import { formatCep, formatCnpj, formatPhone, onlyDigits } from '@/utils/formatters';
import { isValidCnpj } from '@/utils/validators';

export default function PerfilScreen() {
  const router = useRouter();
  const { isAuthenticated } = useSession();
  const [activeTab, setActiveTab] = useState<ProfileTabId>('empresa');
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(mockCompanyProfile);
  const [accountProfile, setAccountProfile] = useState<AccountProfile>(mockAccountProfile);
  const [preferencesProfile, setPreferencesProfile] =
    useState<PreferencesProfile>(mockPreferencesProfile);
  const [cnpjError, setCnpjError] = useState('');
  const [cepMessage, setCepMessage] = useState('');
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [lastFetchedCep, setLastFetchedCep] = useState('');

  useEffect(() => {
    setCnpjError(companyProfile.cnpj && !isValidCnpj(companyProfile.cnpj) ? 'CNPJ invalido.' : '');
  }, [companyProfile.cnpj]);

  const handleSearchCep = useCallback(async () => {
    const cepDigits = onlyDigits(companyProfile.cep);
    setCepMessage('');

    if (cepDigits.length !== 8) {
      setCepMessage('Informe um CEP valido com 8 digitos.');
      return;
    }

    try {
      setIsLoadingCep(true);
      const address = await fetchAddressByCep(companyProfile.cep);
      setLastFetchedCep(cepDigits);

      if (!address) {
        setCepMessage('Nao foi possivel localizar esse CEP.');
        return;
      }

      setCompanyProfile((current) => ({
        ...current,
        cep: formatCep(address.cep),
        street: address.street,
        district: address.district,
        city: address.city,
        state: address.state,
      }));
      setCepMessage('Endereco preenchido automaticamente.');
    } catch {
      setCepMessage('Falha ao consultar o CEP. Verifique sua conexao.');
    } finally {
      setIsLoadingCep(false);
    }
  }, [companyProfile.cep]);

  useEffect(() => {
    const cepDigits = onlyDigits(companyProfile.cep);

    if (cepDigits.length === 8 && cepDigits !== lastFetchedCep) {
      void handleSearchCep();
    }
  }, [companyProfile.cep, handleSearchCep, lastFetchedCep]);

  const completion = useMemo<ProfileCompletion>(() => {
    const companyFields = [
      companyProfile.tradeName,
      companyProfile.legalName,
      companyProfile.cnpj,
      companyProfile.email,
      companyProfile.cep,
      companyProfile.street,
      companyProfile.number,
      companyProfile.district,
      companyProfile.city,
      companyProfile.state,
    ];

    const accountFields = [
      accountProfile.fullName,
      accountProfile.phone,
      accountProfile.currentPassword,
      accountProfile.newPassword,
      accountProfile.confirmPassword,
    ];

    const preferenceFields = [
      preferencesProfile.theme,
      preferencesProfile.currency,
      preferencesProfile.defaultTerm,
      preferencesProfile.automaticBackup,
      preferencesProfile.currentPlan,
    ];

    const groups = {
      empresa: {
        percent: Math.round((companyFields.filter(Boolean).length / companyFields.length) * 100),
        completedFields: companyFields.filter(Boolean).length,
        totalFields: companyFields.length,
        title: 'Complete seu perfil',
        description:
          'Preencha as informacoes da sua empresa para personalizar relatorios e facilitar o gerenciamento.',
      },
      conta: {
        percent: Math.round((accountFields.filter(Boolean).length / accountFields.length) * 100),
        completedFields: accountFields.filter(Boolean).length,
        totalFields: accountFields.length,
        title: 'Dados da conta',
        description:
          'Mantenha seus dados pessoais, senha e notificacoes em dia para usar o app com seguranca.',
      },
      preferencias: {
        percent: Math.round(
          (preferenceFields.filter(Boolean).length / preferenceFields.length) * 100,
        ),
        completedFields: preferenceFields.filter(Boolean).length,
        totalFields: preferenceFields.length,
        title: 'Perfil completo',
        description:
          'Ajuste tema, moeda, prazo padrao e preferencias gerais para deixar o app com a sua rotina.',
      },
    } as const;

    return groups[activeTab];
  }, [activeTab, accountProfile, companyProfile, preferencesProfile]);

  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <AppHeader title="Perfil" onBackPress={() => router.back()} rightIcon="notifications-outline" />

      <ScrollView bounces={false} contentContainerStyle={styles.content}>
        <View style={styles.tabsCard}>
          {mockProfileTabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <Pressable
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[styles.tabButton, isActive ? styles.tabButtonActive : null]}>
                <Ionicons
                  color={isActive ? '#FFFFFF' : '#6C6C6C'}
                  name={tab.icon as keyof typeof Ionicons.glyphMap}
                  size={18}
                />
                <Text style={[styles.tabLabel, isActive ? styles.tabLabelActive : null]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressPercent}>{completion.percent}%</Text>
              <Text style={styles.progressCaption}>Completo</Text>
            </View>

            <View style={styles.summaryTextBlock}>
              <Text style={styles.summaryTitle}>{completion.title}</Text>
              <Text style={styles.summaryDescription}>{completion.description}</Text>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${completion.percent}%` }]} />
              </View>
              <Text style={styles.summaryMeta}>
                {completion.completedFields} de {completion.totalFields} campos
              </Text>
            </View>
          </View>
        </View>

        {activeTab === 'empresa' ? (
          <CompanySection
            cnpjError={cnpjError}
            companyProfile={companyProfile}
            cepMessage={cepMessage}
            isLoadingCep={isLoadingCep}
            onChange={setCompanyProfile}
            onSearchCep={handleSearchCep}
          />
        ) : null}

        {activeTab === 'conta' ? (
          <AccountSection accountProfile={accountProfile} onChange={setAccountProfile} />
        ) : null}

        {activeTab === 'preferencias' ? (
          <PreferencesSection
            preferencesProfile={preferencesProfile}
            onChange={setPreferencesProfile}
          />
        ) : null}

        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Salvar Alteracoes</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

type CompanySectionProps = {
  companyProfile: CompanyProfile;
  onChange: Dispatch<SetStateAction<CompanyProfile>>;
  onSearchCep: () => Promise<void>;
  isLoadingCep: boolean;
  cepMessage: string;
  cnpjError: string;
};

function CompanySection({
  companyProfile,
  onChange,
  onSearchCep,
  isLoadingCep,
  cepMessage,
  cnpjError,
}: CompanySectionProps) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Dados da Empresa</Text>

      <View style={styles.uploadBox}>
        <Ionicons name="cloud-upload-outline" size={28} color="#8D8D8D" />
        <Text style={styles.uploadTitle}>Logo da Empresa</Text>
        <Text style={styles.uploadText}>{companyProfile.logoLabel}</Text>
        <Text style={styles.uploadHint}>PNG ou JPG . Max. 2MB . Dimensao recomendada: 512x512</Text>
      </View>

      <View style={styles.formRow}>
        <Field label="Nome Fantasia" required>
          <Input
            icon="business-outline"
            onChangeText={(value) => onChange((current) => ({ ...current, tradeName: value }))}
            value={companyProfile.tradeName}
          />
        </Field>
        <Field label="Razao Social" required>
          <Input
            icon="document-text-outline"
            onChangeText={(value) => onChange((current) => ({ ...current, legalName: value }))}
            value={companyProfile.legalName}
          />
        </Field>
      </View>

      <View style={styles.formRow}>
        <Field error={cnpjError} label="CNPJ" required>
          <Input
            icon="card-outline"
            keyboardType="number-pad"
            onChangeText={(value) =>
              onChange((current) => ({ ...current, cnpj: formatCnpj(value) }))
            }
            value={companyProfile.cnpj}
          />
        </Field>
        <Field label="E-mail" required>
          <Input
            icon="mail-outline"
            keyboardType="email-address"
            onChangeText={(value) => onChange((current) => ({ ...current, email: value }))}
            value={companyProfile.email}
          />
        </Field>
      </View>

      <Text style={styles.groupTitle}>Endereco</Text>

      <View style={styles.inlineActionRow}>
        <View style={styles.inlineGrow}>
          <Field label="CEP" required>
            <Input
              icon="search-outline"
              keyboardType="number-pad"
              onChangeText={(value) => onChange((current) => ({ ...current, cep: formatCep(value) }))}
              value={companyProfile.cep}
            />
          </Field>
        </View>
        <View style={styles.cepButtonWrap}>
          <Pressable onPress={onSearchCep} style={styles.smallActionButton}>
            {isLoadingCep ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.smallActionButtonText}>Buscar CEP</Text>
            )}
          </Pressable>
        </View>
      </View>

      {cepMessage ? <Text style={styles.helperMessage}>{cepMessage}</Text> : null}

      <View style={styles.formRow}>
        <Field label="Logradouro" required>
          <Input
            icon="location-outline"
            onChangeText={(value) => onChange((current) => ({ ...current, street: value }))}
            value={companyProfile.street}
          />
        </Field>
        <Field label="Numero" required small>
          <Input
            icon="reader-outline"
            keyboardType="number-pad"
            onChangeText={(value) => onChange((current) => ({ ...current, number: value }))}
            value={companyProfile.number}
          />
        </Field>
      </View>

      <View style={styles.formRow}>
        <Field label="Bairro" required>
          <Input
            icon="map-outline"
            onChangeText={(value) => onChange((current) => ({ ...current, district: value }))}
            value={companyProfile.district}
          />
        </Field>
        <Field label="Cidade" required>
          <Input
            icon="business-outline"
            onChangeText={(value) => onChange((current) => ({ ...current, city: value }))}
            value={companyProfile.city}
          />
        </Field>
        <Field label="UF" required small>
          <Input
            autoCapitalize="characters"
            onChangeText={(value) =>
              onChange((current) => ({ ...current, state: value.toUpperCase().slice(0, 2) }))
            }
            value={companyProfile.state}
          />
        </Field>
      </View>

      <Field label="Complemento">
        <Input
          icon="grid-outline"
          onChangeText={(value) => onChange((current) => ({ ...current, complement: value }))}
          value={companyProfile.complement}
        />
      </Field>
    </View>
  );
}

type AccountSectionProps = {
  accountProfile: AccountProfile;
  onChange: Dispatch<SetStateAction<AccountProfile>>;
};

function AccountSection({ accountProfile, onChange }: AccountSectionProps) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Dados da Conta</Text>

      <View style={styles.accountBanner}>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person-outline" size={36} color="#B7B7B7" />
        </View>
        <Text style={styles.avatarLabel}>{accountProfile.avatarLabel}</Text>
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Alterar</Text>
        </Pressable>
      </View>

      <Field label="Nome Completo" required>
        <Input
          icon="person-outline"
          onChangeText={(value) => onChange((current) => ({ ...current, fullName: value }))}
          value={accountProfile.fullName}
        />
      </Field>

      <View style={styles.formRow}>
        <Field label="Telefone" required>
          <Input
            icon="call-outline"
            keyboardType="phone-pad"
            onChangeText={(value) => onChange((current) => ({ ...current, phone: formatPhone(value) }))}
            value={accountProfile.phone}
          />
        </Field>
        <Field label="Senha" required>
          <Input
            icon="lock-closed-outline"
            onChangeText={(value) => onChange((current) => ({ ...current, currentPassword: value }))}
            secureTextEntry
            value={accountProfile.currentPassword}
          />
        </Field>
      </View>

      <Text style={styles.groupTitle}>Alterar Senha</Text>

      <View style={styles.formRow}>
        <Field label="Nova Senha">
          <Input
            icon="lock-closed-outline"
            onChangeText={(value) => onChange((current) => ({ ...current, newPassword: value }))}
            secureTextEntry
            value={accountProfile.newPassword}
          />
        </Field>
        <Field label="Confirmar Nova Senha">
          <Input
            icon="shield-checkmark-outline"
            onChangeText={(value) =>
              onChange((current) => ({ ...current, confirmPassword: value }))
            }
            secureTextEntry
            value={accountProfile.confirmPassword}
          />
        </Field>
      </View>

      <View style={styles.tipBox}>
        <Text style={styles.tipTitle}>Sua senha deve conter no minimo:</Text>
        <Text style={styles.tipItem}>8 caracteres</Text>
        <Text style={styles.tipItem}>1 letra</Text>
        <Text style={styles.tipItem}>1 numero</Text>
      </View>

      <View style={styles.noticeRow}>
        <Text style={styles.noticeText}>Senha atual correta</Text>
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Alterar Senha</Text>
        </Pressable>
      </View>

      <Text style={styles.groupTitle}>Notificacoes</Text>
      <SwitchRow
        label="Receber Noticias"
        value={accountProfile.receiveNews}
        onValueChange={(value) => onChange((current) => ({ ...current, receiveNews: value }))}
      />
      <SwitchRow
        label="Receber alertas e avisos importantes"
        value={accountProfile.receiveAlerts}
        onValueChange={(value) => onChange((current) => ({ ...current, receiveAlerts: value }))}
      />
    </View>
  );
}

type PreferencesSectionProps = {
  preferencesProfile: PreferencesProfile;
  onChange: Dispatch<SetStateAction<PreferencesProfile>>;
};

function PreferencesSection({ preferencesProfile, onChange }: PreferencesSectionProps) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Configuracoes Gerais</Text>

      <View style={styles.themeToggle}>
        <Text style={styles.themeLabel}>Tema</Text>
        <View style={styles.segmentedControl}>
          <Pressable
            onPress={() => onChange((current) => ({ ...current, theme: 'Claro' }))}
            style={[
              styles.segmentedButton,
              preferencesProfile.theme === 'Claro' ? styles.segmentedButtonActive : null,
            ]}>
            <Text
              style={[
                styles.segmentedButtonText,
                preferencesProfile.theme === 'Claro' ? styles.segmentedButtonTextActive : null,
              ]}>
              Claro
            </Text>
          </Pressable>
          <Pressable
            onPress={() => onChange((current) => ({ ...current, theme: 'Escuro' }))}
            style={[
              styles.segmentedButton,
              preferencesProfile.theme === 'Escuro' ? styles.segmentedButtonActive : null,
            ]}>
            <Text
              style={[
                styles.segmentedButtonText,
                preferencesProfile.theme === 'Escuro' ? styles.segmentedButtonTextActive : null,
              ]}>
              Escuro
            </Text>
          </Pressable>
        </View>
      </View>

      <Field label="Moeda Padrao">
        <Input
          icon="cash-outline"
          onChangeText={(value) => onChange((current) => ({ ...current, currency: value }))}
          value={preferencesProfile.currency}
        />
      </Field>

      <Field label="Prazo Padrao">
        <Input
          icon="calendar-outline"
          onChangeText={(value) => onChange((current) => ({ ...current, defaultTerm: value }))}
          value={preferencesProfile.defaultTerm}
        />
      </Field>

      <Text style={styles.groupTitle}>Notificacoes</Text>
      <SwitchRow
        label="Receber Noticias"
        value={preferencesProfile.receiveNews}
        onValueChange={(value) => onChange((current) => ({ ...current, receiveNews: value }))}
      />
      <SwitchRow
        label="Receber alertas e avisos importantes"
        value={preferencesProfile.receiveAlerts}
        onValueChange={(value) => onChange((current) => ({ ...current, receiveAlerts: value }))}
      />

      <Field label="Backup Automatico">
        <Input
          icon="cloud-done-outline"
          onChangeText={(value) =>
            onChange((current) => ({ ...current, automaticBackup: value }))
          }
          value={preferencesProfile.automaticBackup}
        />
      </Field>

      <View style={styles.planRow}>
        <PlanCard
          caption="30 dias."
          icon="sparkles-outline"
          isActive={preferencesProfile.currentPlan === 'free'}
          price="R$ 0"
          title="Plano Free"
          tone="light"
        />
        <PlanCard
          icon="star"
          isActive={preferencesProfile.currentPlan === 'premium'}
          price="R$ 39,99"
          title="Plano Premium"
          tone="premium"
        />
      </View>
    </View>
  );
}

type FieldProps = {
  label: string;
  children: ReactNode;
  required?: boolean;
  error?: string;
  small?: boolean;
};

function Field({ label, children, required, error, small }: FieldProps) {
  return (
    <View style={[styles.fieldWrapper, small ? styles.fieldWrapperSmall : null]}>
      <Text style={styles.fieldLabel}>
        {label}
        {required ? <Text style={styles.requiredMark}> *</Text> : null}
      </Text>
      {children}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

type InputProps = {
  value: string;
  onChangeText: (value: string) => void;
  icon?: keyof typeof Ionicons.glyphMap;
  keyboardType?: 'default' | 'email-address' | 'number-pad' | 'phone-pad';
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};

function Input({
  value,
  onChangeText,
  icon,
  keyboardType,
  secureTextEntry,
  autoCapitalize,
}: InputProps) {
  return (
    <View style={styles.inputShell}>
      {icon ? <Ionicons color="#95A09A" name={icon} size={18} /> : null}
      <TextInput
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        numberOfLines={1}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={styles.input}
        value={value}
      />
      {secureTextEntry ? <Ionicons color="#95A09A" name="eye-outline" size={18} /> : null}
    </View>
  );
}

type SwitchRowProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

function SwitchRow({ label, value, onValueChange }: SwitchRowProps) {
  return (
    <View style={styles.switchRow}>
      <Text style={styles.switchLabel}>{label}</Text>
      <Switch
        onValueChange={onValueChange}
        thumbColor="#FFFFFF"
        trackColor={{ false: '#D7D7D7', true: '#2F8F57' }}
        value={value}
      />
    </View>
  );
}

type PlanCardProps = {
  title: string;
  price: string;
  tone: 'light' | 'premium';
  isActive: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  caption?: string;
};

function PlanCard({ title, price, tone, isActive, icon, caption }: PlanCardProps) {
  return (
    <View
      style={[
        styles.planCard,
        tone === 'premium' ? styles.planCardPremium : styles.planCardLight,
        isActive ? styles.planCardActive : null,
      ]}>
      <View style={styles.planIconWrap}>
        <Ionicons color={tone === 'premium' ? '#A17800' : '#2F8F57'} name={icon} size={26} />
      </View>
      <Text style={styles.planTitle}>{title}</Text>
      <Text style={styles.planPrice}>{price}</Text>
      {caption ? <Text style={styles.planCaption}>{caption}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F5F1E8',
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  tabsCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E7E1D6',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    padding: 8,
  },
  tabButton: {
    alignItems: 'center',
    borderRadius: 12,
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: 8,
  },
  tabLabel: {
    color: '#6C6C6C',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#2F8F57',
  },
  tabLabelActive: {
    color: '#FFFFFF',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E7E1D6',
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  progressCircle: {
    alignItems: 'center',
    borderColor: '#DDEBDF',
    borderRadius: 42,
    borderWidth: 8,
    height: 84,
    justifyContent: 'center',
    width: 84,
  },
  progressPercent: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 18,
  },
  progressCaption: {
    color: '#6D6D6D',
    fontSize: 11,
    lineHeight: 12,
    marginTop: 2,
  },
  summaryTextBlock: {
    flex: 1,
  },
  summaryTitle: {
    color: '#323232',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  summaryDescription: {
    color: '#6C6C6C',
    fontSize: 14,
    lineHeight: 20,
  },
  progressBarTrack: {
    backgroundColor: '#E8E3D9',
    borderRadius: 999,
    height: 8,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    backgroundColor: '#2F8F57',
    borderRadius: 999,
    height: '100%',
  },
  summaryMeta: {
    color: '#8A8A8A',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'right',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E7E1D6',
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  sectionTitle: {
    color: '#323232',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 14,
  },
  uploadBox: {
    alignItems: 'center',
    borderColor: '#D9D9D9',
    borderRadius: 18,
    borderStyle: 'dashed',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  uploadTitle: {
    color: '#444444',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
  },
  uploadText: {
    color: '#6D6D6D',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  uploadHint: {
    color: '#9A9A9A',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  formRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  fieldWrapper: {
    flex: 1,
    marginBottom: 12,
    minWidth: 140,
  },
  fieldWrapperSmall: {
    flex: 0.55,
    minWidth: 96,
  },
  fieldLabel: {
    color: '#4C4C4C',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  requiredMark: {
    color: '#D54646',
  },
  inputShell: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#DCD6CB',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  input: {
    color: '#2F2F2F',
    flex: 1,
    fontSize: 15,
    paddingVertical: 12,
  },
  groupTitle: {
    color: '#323232',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 4,
  },
  inlineActionRow: {
    alignItems: 'stretch',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  inlineGrow: {
    flex: 1,
    minWidth: 180,
  },
  cepButtonWrap: {
    justifyContent: 'flex-end',
    paddingBottom: 12,
  },
  smallActionButton: {
    alignItems: 'center',
    backgroundColor: '#2F8F57',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    minWidth: 118,
    paddingHorizontal: 14,
  },
  smallActionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  helperMessage: {
    color: '#2F8F57',
    fontSize: 13,
    marginBottom: 12,
    marginTop: -2,
  },
  errorText: {
    color: '#D54646',
    fontSize: 12,
    marginTop: 6,
  },
  accountBanner: {
    alignItems: 'center',
    borderBottomColor: '#F0EBE2',
    borderBottomWidth: 1,
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 14,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    backgroundColor: '#EEF1EC',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  avatarLabel: {
    color: '#4A4A4A',
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    paddingLeft: 12,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#2F8F57',
    borderRadius: 16,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: 18,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  tipBox: {
    backgroundColor: '#F2FBF5',
    borderColor: '#D7ECD8',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  tipTitle: {
    color: '#2F8F57',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  tipItem: {
    color: '#5E6C60',
    fontSize: 13,
    marginTop: 2,
  },
  noticeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  noticeText: {
    color: '#2F8F57',
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    paddingRight: 10,
  },
  switchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  switchLabel: {
    color: '#414141',
    flex: 1,
    fontSize: 15,
    paddingRight: 12,
  },
  themeToggle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  themeLabel: {
    color: '#323232',
    fontSize: 16,
    fontWeight: '700',
  },
  segmentedControl: {
    backgroundColor: '#F0ECE4',
    borderRadius: 999,
    flexDirection: 'row',
    padding: 4,
    width: 210,
  },
  segmentedButton: {
    alignItems: 'center',
    borderRadius: 999,
    flex: 1,
    justifyContent: 'center',
    minHeight: 36,
  },
  segmentedButtonActive: {
    backgroundColor: '#2F8F57',
  },
  segmentedButtonText: {
    color: '#6C6C6C',
    fontSize: 14,
    fontWeight: '700',
  },
  segmentedButtonTextActive: {
    color: '#FFFFFF',
  },
  planRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10,
  },
  planCard: {
    alignItems: 'center',
    aspectRatio: 1,
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    maxWidth: 172,
    minHeight: 148,
    minWidth: 148,
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  planCardLight: {
    backgroundColor: '#FBFAF7',
    borderColor: '#E7E1D6',
  },
  planCardPremium: {
    backgroundColor: '#FFF1C7',
    borderColor: '#F0D97D',
  },
  planCardActive: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  planIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  planTitle: {
    color: '#323232',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  planPrice: {
    color: '#323232',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 6,
    textAlign: 'center',
  },
  planCaption: {
    color: '#6C6C6C',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#2F8F57',
    borderRadius: 18,
    justifyContent: 'center',
    minHeight: 54,
    width: '100%',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
