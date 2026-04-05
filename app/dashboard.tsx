import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useSession } from '@/hooks/use-session';
import {
  mockBottomNavItems,
  mockDashboardChartSlices,
  mockDashboardRangeTabs,
  mockDashboardScopeTabs,
  mockDashboardSummary,
  mockDrawerMenuItems,
  mockUserProfile,
} from '@/mocks/dashboard';

export default function DashboardScreen() {
  const router = useRouter();
  const { isAuthenticated, signOut, user } = useSession();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const totalAmount = useMemo(
    () => mockDashboardChartSlices.reduce((accumulator, item) => accumulator + item.amount, 0),
    [],
  );

  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.heroSection}>
        <View style={styles.heroGlowLarge} />
        <View style={styles.heroGlowSmall} />

        <View style={styles.topBar}>
          <Pressable hitSlop={10} onPress={() => setDrawerVisible(true)} style={styles.iconAction}>
            <Ionicons color="#FFFFFF" name="menu" size={28} />
          </Pressable>
          <Text style={styles.topTitle}>Dashboard</Text>
          <Pressable hitSlop={10} style={styles.iconAction}>
            <Ionicons color="#FFFFFF" name="gift-outline" size={26} />
          </Pressable>
        </View>

        <View style={styles.totalWrap}>
          <View style={styles.totalLabelRow}>
            <Ionicons color="#EAF6EE" name="flask-outline" size={20} />
            <Text style={styles.totalLabel}>{mockDashboardSummary.label}</Text>
            <Ionicons color="#EAF6EE" name="chevron-down" size={16} />
          </View>
          <Text style={styles.totalValue}>{mockDashboardSummary.value}</Text>
        </View>

        <View style={styles.scopeTabsRow}>
          {mockDashboardScopeTabs.map((tab) => (
            <View key={tab.id} style={styles.scopeTabItem}>
              <Text style={[styles.scopeTabText, tab.active ? styles.scopeTabTextActive : null]}>
                {tab.label}
              </Text>
              {tab.active ? <View style={styles.scopeTabUnderline} /> : null}
            </View>
          ))}
        </View>
      </View>

      <ScrollView bounces={false} contentContainerStyle={styles.content}>
        <View style={styles.chartCard}>
          <View style={styles.rangeTabsRow}>
            {mockDashboardRangeTabs.map((tab) => (
              <View key={tab.id} style={styles.rangeTabItem}>
                <Text style={[styles.rangeTabText, tab.active ? styles.rangeTabTextActive : null]}>
                  {tab.label}
                </Text>
                {tab.active ? <View style={styles.rangeTabUnderline} /> : null}
              </View>
            ))}
          </View>

          <View style={styles.periodRow}>
            <Ionicons color="#BFC6C0" name="chevron-back" size={24} />
            <Text style={styles.periodText}>1 a 7 de maio</Text>
            <Ionicons color="#BFC6C0" name="chevron-forward" size={24} />
          </View>

          <View style={styles.chartArea}>
            <View style={styles.donutWrap}>
              <View style={styles.donutBase} />
              <View style={[styles.arcMaskRight, styles.arcMaskTop]}>
                <View style={[styles.arcCircle, styles.arcTransport]} />
              </View>
              <View style={[styles.arcMaskLeft, styles.arcMaskTop]}>
                <View style={[styles.arcCircle, styles.arcFood]} />
              </View>
              <View style={styles.donutCenter}>
                <Text style={styles.donutCenterValue}>R$ {totalAmount.toLocaleString('pt-BR')}</Text>
              </View>
            </View>

            <Pressable style={styles.floatingButton}>
              <Ionicons color="#2A2A2A" name="add" size={30} />
            </Pressable>
          </View>
        </View>

        <View style={styles.categoryList}>
          {mockDashboardChartSlices.map((item) => (
            <View key={item.id} style={styles.categoryCard}>
              <View style={styles.categoryLeft}>
                <View style={[styles.categoryIconBadge, { backgroundColor: item.color }]}>
                  <Ionicons color="#FFFFFF" name={item.icon as keyof typeof Ionicons.glyphMap} size={18} />
                </View>
                <Text style={styles.categoryLabel}>{item.label}</Text>
              </View>
              <Text style={styles.categoryPercent}>{item.percent}%</Text>
              <Text style={styles.categoryAmount}>R$ {item.amount}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        {mockBottomNavItems.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => {
              if (item.id === 'perfil') {
                router.push('/perfil');
              }
            }}
            style={styles.bottomNavItem}>
            <Ionicons
              color={item.active ? '#2F8F57' : '#9BA7A1'}
              name={item.icon as keyof typeof Ionicons.glyphMap}
              size={24}
            />
            <Text style={[styles.bottomNavLabel, item.active ? styles.bottomNavLabelActive : null]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Modal animationType="slide" onRequestClose={() => setDrawerVisible(false)} transparent visible={drawerVisible}>
        <View style={styles.drawerOverlay}>
          <View style={styles.drawerPanel}>
            <View style={styles.drawerHeader}>
              <View style={styles.drawerAvatar}>
                <Ionicons color="#2F8F57" name="person-outline" size={28} />
              </View>
              <View style={styles.drawerHeaderText}>
                <Text style={styles.drawerName}>{user?.name ?? mockUserProfile.name}</Text>
                <Text style={styles.drawerRole}>{mockUserProfile.role}</Text>
                <Text style={styles.drawerEmail}>{user?.email ?? mockUserProfile.email}</Text>
              </View>
              <Pressable hitSlop={10} onPress={() => setDrawerVisible(false)}>
                <Ionicons color="#FFFFFF" name="close" size={24} />
              </Pressable>
            </View>

            <View style={styles.drawerList}>
              {mockDrawerMenuItems.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    setDrawerVisible(false);

                    if (item.route) {
                      router.push(item.route as '/perfil');
                    }
                  }}
                  style={styles.drawerItem}>
                  <View style={[styles.drawerIconBadge, { backgroundColor: `${item.color}20` }]}>
                    <Ionicons color={item.color} name={item.icon as keyof typeof Ionicons.glyphMap} size={18} />
                  </View>
                  <Text style={styles.drawerItemLabel}>{item.label}</Text>
                  <Ionicons color="#B5B5B5" name="chevron-forward" size={18} />
                </Pressable>
              ))}

              <Pressable
                onPress={() => {
                  setDrawerVisible(false);
                  signOut();
                  router.replace('/');
                }}
                style={styles.drawerItem}>
                <View style={[styles.drawerIconBadge, { backgroundColor: '#E7605A20' }]}>
                  <Ionicons color="#E7605A" name="log-out-outline" size={18} />
                </View>
                <Text style={styles.drawerLogout}>Sair</Text>
              </Pressable>
            </View>
          </View>

          <Pressable onPress={() => setDrawerVisible(false)} style={styles.drawerBackdrop} />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#EFF5EC',
    flex: 1,
  },
  heroSection: {
    backgroundColor: '#2FA34F',
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    overflow: 'hidden',
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 18,
    position: 'relative',
  },
  heroGlowLarge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 220,
    height: 280,
    position: 'absolute',
    right: -80,
    top: -120,
    width: 280,
  },
  heroGlowSmall: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 120,
    height: 140,
    left: -50,
    position: 'absolute',
    top: 40,
    width: 140,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconAction: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  topTitle: {
    color: '#FFFFFF',
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 10,
  },
  totalWrap: {
    alignItems: 'center',
    marginTop: 26,
  },
  totalLabelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  totalLabel: {
    color: '#F3FFF6',
    fontSize: 19,
    fontWeight: '600',
  },
  totalValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    marginTop: 8,
  },
  scopeTabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 26,
  },
  scopeTabItem: {
    alignItems: 'center',
    minWidth: 80,
  },
  scopeTabText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 16,
    fontWeight: '600',
  },
  scopeTabTextActive: {
    color: '#FFFFFF',
  },
  scopeTabUnderline: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    height: 4,
    marginTop: 10,
    width: 82,
  },
  content: {
    paddingBottom: 120,
    paddingHorizontal: 16,
    marginTop: -18,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#6D886C',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
  },
  rangeTabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 18,
    marginTop: 4,
  },
  rangeTabItem: {
    alignItems: 'center',
    minWidth: 56,
  },
  rangeTabText: {
    color: '#7F8681',
    fontSize: 15,
    fontWeight: '500',
  },
  rangeTabTextActive: {
    color: '#2F8F57',
    fontWeight: '700',
  },
  rangeTabUnderline: {
    backgroundColor: '#2F8F57',
    borderRadius: 999,
    height: 4,
    marginTop: 8,
    width: 84,
  },
  periodRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  periodText: {
    color: '#4A4A4A',
    fontSize: 18,
    textDecorationLine: 'underline',
  },
  chartArea: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 320,
    position: 'relative',
  },
  donutWrap: {
    alignItems: 'center',
    height: 240,
    justifyContent: 'center',
    position: 'relative',
    width: 240,
  },
  donutBase: {
    borderColor: '#FF313F',
    borderRadius: 120,
    borderWidth: 34,
    height: 240,
    width: 240,
  },
  arcMaskRight: {
    height: 240,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    width: 120,
  },
  arcMaskLeft: {
    height: 240,
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    width: 120,
  },
  arcMaskTop: {
    top: 0,
  },
  arcCircle: {
    borderRadius: 120,
    borderWidth: 34,
    height: 240,
    position: 'absolute',
    top: 0,
    width: 240,
  },
  arcTransport: {
    borderColor: '#36C0D8',
    right: 0,
    transform: [{ rotate: '-102deg' }],
  },
  arcFood: {
    borderColor: '#F5C518',
    left: 0,
    transform: [{ rotate: '-14deg' }],
  },
  donutCenter: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E8E8E8',
    borderRadius: 84,
    borderStyle: 'dashed',
    borderWidth: 2,
    height: 148,
    justifyContent: 'center',
    position: 'absolute',
    width: 148,
  },
  donutCenterValue: {
    color: '#222222',
    fontSize: 22,
    fontWeight: '800',
  },
  floatingButton: {
    alignItems: 'center',
    backgroundColor: '#FFC517',
    borderRadius: 34,
    bottom: 18,
    height: 68,
    justifyContent: 'center',
    position: 'absolute',
    right: 6,
    width: 68,
  },
  categoryList: {
    gap: 12,
    marginTop: 16,
  },
  categoryCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 72,
    paddingHorizontal: 14,
    shadowColor: '#6D886C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
  },
  categoryLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  categoryIconBadge: {
    alignItems: 'center',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  categoryLabel: {
    color: '#1F1F1F',
    fontSize: 18,
    fontWeight: '600',
    paddingLeft: 10,
  },
  categoryPercent: {
    color: '#727272',
    fontSize: 16,
    width: 54,
  },
  categoryAmount: {
    color: '#1F1F1F',
    fontSize: 18,
    fontWeight: '700',
    width: 82,
  },
  bottomNav: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    left: 0,
    paddingBottom: 18,
    paddingTop: 12,
    position: 'absolute',
    right: 0,
  },
  bottomNavItem: {
    alignItems: 'center',
    gap: 4,
    minWidth: 64,
  },
  bottomNavLabel: {
    color: '#9BA7A1',
    fontSize: 13,
  },
  bottomNavLabelActive: {
    color: '#2F8F57',
    fontWeight: '700',
  },
  drawerOverlay: {
    backgroundColor: 'rgba(0,0,0,0.22)',
    flex: 1,
    flexDirection: 'row',
  },
  drawerPanel: {
    backgroundColor: '#FFFFFF',
    borderBottomRightRadius: 24,
    borderTopRightRadius: 24,
    minHeight: '100%',
    width: '78%',
  },
  drawerBackdrop: {
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: '#2F8F57',
    borderTopRightRadius: 24,
    flexDirection: 'row',
    padding: 18,
    paddingTop: 36,
  },
  drawerAvatar: {
    alignItems: 'center',
    backgroundColor: '#E4F1E8',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  drawerHeaderText: {
    flex: 1,
    paddingHorizontal: 12,
  },
  drawerName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  drawerRole: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 14,
    marginTop: 2,
  },
  drawerEmail: {
    color: '#FFFFFF',
    fontSize: 15,
    marginTop: 12,
  },
  drawerList: {
    padding: 14,
  },
  drawerItem: {
    alignItems: 'center',
    borderBottomColor: '#F0ECE4',
    borderBottomWidth: 1,
    flexDirection: 'row',
    minHeight: 58,
  },
  drawerIconBadge: {
    alignItems: 'center',
    borderRadius: 12,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  drawerItemLabel: {
    color: '#2D2D2D',
    flex: 1,
    fontSize: 18,
    paddingLeft: 12,
  },
  drawerLogout: {
    color: '#E7605A',
    flex: 1,
    fontSize: 18,
    paddingLeft: 12,
  },
});
