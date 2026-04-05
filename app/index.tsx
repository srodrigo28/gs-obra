import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { useSession } from '@/hooks/use-session';
import {
  getDefaultAuthCredentials,
  getGoogleAuthConfig,
  isGoogleAuthConfigured,
  validateLocalLogin,
} from '@/services/auth';

const defaultCredentials = getDefaultAuthCredentials();
const googleAuthConfig = getGoogleAuthConfig();

export default function LoginScreen() {
  const router = useRouter();
  const { isAuthenticated, signIn } = useSession();
  const [email, setEmail] = useState(defaultCredentials.email);
  const [password, setPassword] = useState(defaultCredentials.password);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  function handleLocalLogin() {
    const result = validateLocalLogin({ email, password });

    if (!result.success || !result.user) {
      setErrorMessage(result.message);
      return;
    }

    setErrorMessage('');
    signIn(result.user);
    router.replace('/dashboard');
  }

  function handleGoogleLogin() {
    if (!isGoogleAuthConfigured()) {
      Alert.alert(
        'Google Auth pendente',
        'Preencha o EXPO_PUBLIC_GOOGLE_CLIENT_ID e as URLs de callback no .env para ativar o login com Google.',
      );
      return;
    }

    Alert.alert(
      'Google Auth preparado',
      `Client ID publico configurado.\nURL local: ${googleAuthConfig.redirectUrlLocal}\nURL DNS: ${googleAuthConfig.redirectUrlDns}`,
    );
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', default: undefined })}
        style={styles.flex}>
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <AppHeader title="Bem-vindo de volta!" subtitle="Controle seus gastos e orcamentos" />

          <View style={styles.formSection}>
            <View style={styles.avatar}>
              <Ionicons name="construct" size={44} color="#2F8F57" />
            </View>

            <Pressable onPress={handleGoogleLogin} style={styles.googleButton}>
              <Ionicons name="logo-google" size={24} color="#EA4335" />
              <Text style={styles.googleText}>Entrar com o Google</Text>
            </Pressable>

            <Text style={styles.googleHint}>
              {isGoogleAuthConfigured()
                ? 'Google Auth configurado para a proxima etapa.'
                : 'Google Auth ainda nao configurado no .env.'}
            </Text>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>E-mail</Text>
              <View style={styles.inputShell}>
                <Ionicons name="mail-outline" size={20} color="#95A09A" />
                <TextInput
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  placeholder="E-mail"
                  placeholderTextColor="#95A09A"
                  style={styles.input}
                  value={email}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.inputShell}>
                <Ionicons name="lock-closed-outline" size={20} color="#95A09A" />
                <TextInput
                  onChangeText={setPassword}
                  placeholder="Senha"
                  placeholderTextColor="#95A09A"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  value={password}
                />
                <Pressable hitSlop={10} onPress={() => setShowPassword((current) => !current)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#95A09A"
                  />
                </Pressable>
              </View>
            </View>

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <Pressable onPress={handleLocalLogin} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Entrar</Text>
            </Pressable>

            <Text style={styles.defaultHint}>
              Usuario padrao: {defaultCredentials.email} | Senha: {defaultCredentials.password}
            </Text>

            <Pressable>
              <Text style={styles.helperText}>Esqueceu sua senha?</Text>
            </Pressable>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Nao tem uma conta?</Text>
              <Link href="/cadastro" style={styles.footerLink}>
                Cadastre-se
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: '#F4F0E8',
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  formSection: {
    flexGrow: 1,
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  avatar: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#E4F1E8',
    borderRadius: 52,
    height: 104,
    justifyContent: 'center',
    marginBottom: 22,
    marginTop: 4,
    width: 104,
  },
  googleButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E3E0D8',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    minHeight: 58,
    paddingHorizontal: 18,
    width: '100%',
  },
  googleText: {
    color: '#353535',
    fontSize: 20,
    fontWeight: '600',
  },
  googleHint: {
    color: '#6A6A6A',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
  dividerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    marginVertical: 20,
  },
  dividerLine: {
    backgroundColor: '#DBD6CC',
    flex: 1,
    height: 1,
  },
  dividerText: {
    color: '#8B8B8B',
    fontSize: 16,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    color: '#5D5D5D',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputShell: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E3E0D8',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 58,
    paddingHorizontal: 16,
    width: '100%',
  },
  input: {
    color: '#2E2E2E',
    flex: 1,
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 14,
  },
  errorText: {
    color: '#C84F4F',
    fontSize: 14,
    marginTop: -2,
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#2F8F57',
    borderRadius: 24,
    justifyContent: 'center',
    marginTop: 16,
    minHeight: 58,
    width: '100%',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  defaultHint: {
    color: '#6D6D6D',
    fontSize: 13,
    marginTop: 12,
    textAlign: 'center',
  },
  helperText: {
    color: '#7B7B7B',
    fontSize: 17,
    marginTop: 18,
    textAlign: 'center',
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginTop: 18,
  },
  footerText: {
    color: '#6D6D6D',
    fontSize: 17,
  },
  footerLink: {
    color: '#2F8F57',
    fontSize: 18,
    fontWeight: '700',
  },
});
