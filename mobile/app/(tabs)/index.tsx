import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, Bot, AlertTriangle, Clock, Activity, ArrowRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function MobileOverviewScreen() {
  const router = useRouter();

  const handleGoToApprovals = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(tabs)/approvals');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.brandIcon}>
            <Shield size={20} color="#06b6d4" />
          </View>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.brandTitle}>SentinelOps AI</Text>
              <View style={styles.pillBadge}>
                <Text style={styles.pillText}>MOBILE OPS</Text>
              </View>
            </View>
            <Text style={styles.brandSub}>In-Line Agent Guardrails</Text>
          </View>
        </View>

        <View style={styles.statusDotRow}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Gateway Online (7.8ms)</Text>
        </View>
      </View>

      {/* Action Banner for Pending Approvals */}
      <TouchableOpacity
        style={styles.actionBanner}
        onPress={handleGoToApprovals}
        activeOpacity={0.85}
      >
        <View style={styles.actionBannerLeft}>
          <Clock size={20} color="#f59e0b" />
          <View>
            <Text style={styles.actionBannerTitle}>3 Approvals Require Attention</Text>
            <Text style={styles.actionBannerSub}>High-value wires and DB mutations paused</Text>
          </View>
        </View>
        <ArrowRight size={18} color="#f59e0b" />
      </TouchableOpacity>

      {/* 2x2 Metric Cards */}
      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Guarded Agents</Text>
          <Text style={styles.cardValue}>4 Active</Text>
          <Text style={styles.cardDetail}>3 Healthy, 1 Degraded</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>24h Actions</Text>
          <Text style={styles.cardValue}>7,497</Text>
          <Text style={styles.cardDetail}>Evaluated Pre-Flight</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>In-Line Halts (DENY)</Text>
          <Text style={[styles.cardValue, { color: '#f43f5e' }]}>47</Text>
          <Text style={styles.cardDetail}>Attacks Neutralized</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Audit Proof</Text>
          <Text style={[styles.cardValue, { color: '#10b981' }]}>SHA-256</Text>
          <Text style={styles.cardDetail}>Chained & Verifiable</Text>
        </View>
      </View>

      {/* Agent Fleet Preview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>MONITORED AGENT FLEET</Text>
        <View style={styles.agentCard}>
          <View style={styles.agentHeader}>
            <Text style={styles.agentName}>FinReconcileBot</Text>
            <Text style={styles.agentHealthy}>HEALTHY</Text>
          </View>
          <Text style={styles.agentDesc}>Wire verification and GL sync (Prod)</Text>
          <Text style={styles.agentMeta}>Tool: initiate_settlement | 1,842 actions</Text>
        </View>

        <View style={styles.agentCard}>
          <View style={styles.agentHeader}>
            <Text style={styles.agentName}>DevOpsInfraWorker</Text>
            <Text style={styles.agentDegraded}>DEGRADED</Text>
          </View>
          <Text style={styles.agentDesc}>Kubernetes auto-scale and deployment (Staging)</Text>
          <Text style={styles.agentMeta}>Tool: drop_database_table (BLOCKED)</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080b11' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  header: { marginBottom: 20 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  brandIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#0e131f',
    borderColor: '#1e293b',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandTitle: { fontSize: 18, fontWeight: '800', color: '#ffffff' },
  pillBadge: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderColor: 'rgba(6, 182, 212, 0.4)',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pillText: { color: '#06b6d4', fontSize: 9, fontWeight: '700' },
  brandSub: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  statusDotRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981' },
  statusText: { fontSize: 11, color: '#10b981', fontFamily: 'monospace' },
  actionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
    borderWidth: 1,
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
  },
  actionBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  actionBannerTitle: { fontSize: 13, fontWeight: '700', color: '#f59e0b' },
  actionBannerSub: { fontSize: 11, color: '#cbd5e1', marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  card: {
    width: '48%',
    backgroundColor: '#0e131f',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  cardLabel: { fontSize: 11, color: '#94a3b8' },
  cardValue: { fontSize: 18, fontWeight: '800', color: '#ffffff', marginVertical: 4 },
  cardDetail: { fontSize: 10, color: '#64748b' },
  section: { marginTop: 8 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#64748b', letterSpacing: 1, marginBottom: 10 },
  agentCard: {
    backgroundColor: '#0e131f',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  agentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  agentName: { fontSize: 13, fontWeight: '700', color: '#ffffff' },
  agentHealthy: { fontSize: 10, fontWeight: '700', color: '#10b981' },
  agentDegraded: { fontSize: 10, fontWeight: '700', color: '#f59e0b' },
  agentDesc: { fontSize: 11, color: '#94a3b8', marginTop: 4 },
  agentMeta: { fontSize: 10, color: '#06b6d4', marginTop: 6, fontFamily: 'monospace' },
});
