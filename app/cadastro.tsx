import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import {
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

export default function CadastroScreen() {
  const router = useRouter();

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', default: undefined })}
        style={styles.flex}>
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <AppHeader title="Cadastre-se" onBackPress={() => router.back()} />

          <View style={styles.formSection}>
            <View style={styles.avatar}>
              <Ionicons name="person-add-outline" size={44} color="#2F8F57" />
            </View>

            <InputField icon="person-outline" placeholder="Seu nome" />
            <InputField icon="mail-outline" keyboardType="email-address" placeholder="E-mail" />
            <InputField icon="call-outline" keyboardType="phone-pad" placeholder="(00) 00000-0000" />
            <InputField icon="lock-closed-outline" placeholder="Senha" secureTextEntry />
            <InputField icon="shield-checkmark-outline" placeholder="Confirmar senha" secureTextEntry />

            <Text style={styles.termsText}>
              Ao se cadastrar, voce concorda com nossos <Text style={styles.termsLink}>Termos de Uso</Text> e <Text style={styles.termsLink}>Politica de Privacidade</Text>.
            </Text>

            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Cadastrar</Text>
            </Pressable>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Ja tem uma conta?</Text>
              <Link href="/" style={styles.footerLink}>
                Entre
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type InputFieldProps = {
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  secureTextEntry?: boolean;
};

function InputField({ icon, placeholder, keyboardType, secureTextEntry }: InputFieldProps) {
  return (
    <View style={styles.fieldGroup}>
      <View style={styles.inputShell}>
        <Ionicons name={icon} size={20} color="#95A09A" />
        <TextInput
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor="#95A09A"
          secureTextEntry={secureTextEntry}
          style={styles.input}
        />
        {secureTextEntry ? <Ionicons name="eye-outline" size={20} color="#95A09A" /> : null}
      </View>
    </View>
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
  fieldGroup: {
    marginBottom: 14,
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
  termsText: {
    color: '#6D6D6D',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
  },
  termsLink: {
    color: '#2F8F57',
    fontWeight: '700',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#2F8F57',
    borderRadius: 24,
    justifyContent: 'center',
    marginTop: 20,
    minHeight: 58,
    width: '100%',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginTop: 20,
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
