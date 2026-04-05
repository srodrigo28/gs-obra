import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
};

export function AppHeader({
  title,
  subtitle,
  onBackPress,
  rightIcon,
  onRightPress,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 18),
        },
      ]}>
      <View style={styles.glowPrimary} />
      <View style={styles.glowSecondary} />
      <View style={styles.row}>
        <View style={styles.side}>
          {onBackPress ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              hitSlop={10}
              onPress={onBackPress}
              style={styles.iconButton}>
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.titleBlock}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          {subtitle ? (
            <Text numberOfLines={1} style={styles.subtitle}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View style={[styles.side, styles.sideRight]}>
          {rightIcon ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ação"
              hitSlop={10}
              onPress={onRightPress}
              style={styles.iconButton}>
              <Ionicons name={rightIcon} size={22} color="#FFFFFF" />
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2F8F57',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    paddingBottom: 18,
    paddingHorizontal: 18,
    position: 'relative',
  },
  glowPrimary: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 140,
    height: 180,
    position: 'absolute',
    right: -32,
    top: -92,
    width: 220,
  },
  glowSecondary: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 120,
    height: 110,
    left: -44,
    position: 'absolute',
    top: -36,
    width: 140,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 44,
  },
  side: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    minWidth: 40,
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  titleBlock: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 14,
    marginTop: 2,
  },
  iconButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
});
