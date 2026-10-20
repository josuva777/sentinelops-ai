import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AlertTriangle, ShieldCheck, Clock } from 'lucide-react-native';

export default function MobileAlertsScreen() {
  const alerts = [
    {
      id: 'alt_01',
      title: 'High-Risk Table Drop Intercepted & Blocked',
      severity: 'CRITICAL',
      agent: 'DevOpsInfraWorker',
      time: '16m ago',
      evidence: 'Agent invoked drop_database_table with target "customers_archive". Halted in-line.',
      remediation: 'Inspect prompt trajectory for prompt injection. Verify cluster credentials.',
    },
    {
      id: 'alt_02',
      title: 'High-Value Settlement Routed to Approval Queue',
      severity: 'HIGH',
      agent: 'FinReconcileBot',
      time: '25m ago',
      evidence: 'Settlement amount $14,850.00 triggered rule r_fin_02. Token tok_appr_9a12c8e3 bound.',
      remediation: 'Verify invoice reference against ERP before issuing one-time approval.',
    },
    {
      id: 'alt_03',
      title: 'Agent Disconnected from Heartbeat Keep-Alive',
      severity: 'MEDIUM',
      agent: 'ResearchScraper',
      time: '2h ago',
      evidence: 'Heartbeat signal lost for > 60m. Integration token status set to degraded.',
      remediation: 'Verify pod health in development namespace. Cycle API token if node terminated.',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Security Incidents & Alerts</Text>
        <Text style={styles.sub}>Evaluated policy violations and active containment records</Text>
      </View>

      <View style={styles.list}>
        {alerts.map((alt) => (
          <View key={alt.id} style={styles.card}>
            <View style={styles.topRow}>
              <View style={[
                styles.badge,
                alt.severity === 'CRITICAL' ? styles.badgeCrit : styles.badgeHigh
              ]}>
                <Text style={[
                  styles.badgeText,
                  alt.severity === 'CRITICAL' ? styles.textCrit : styles.textHigh
                ]}>{alt.severity}</Text>
              </View>
              <Text style={styles.timeText}>{alt.time}</Text>
            </View>

            <Text style={styles.alertTitle}>{alt.title}</Text>

            <View style={styles.evidenceBox}>
              <Text style={styles.boxLabel}>Evidence</Text>
              <Text style={styles.evidenceText}>{alt.evidence}</Text>
            </View>

            <View style={styles.remediationBox}>
              <Text style={styles.boxLabel}>Remediation</Text>
              <Text style={styles.remediationText}>{alt.remediation}</Text>
            </View>

            <View style={styles.footer}>
              <Text style={styles.agentTag}>Agent: {alt.agent}</Text>
              <Text style={styles.idTag}>ID: {alt.id}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080b11' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  header: { marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '800', color: '#ffffff' },
  sub: { fontSize: 11, color: '#94a3b8', marginTop: 4 },
  list: { gap: 14 },
  card: {
    backgroundColor: '#0e131f',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeCrit: { backgroundColor: 'rgba(244, 63, 94, 0.15)', borderColor: 'rgba(244, 63, 94, 0.3)', borderWidth: 1 },
  badgeHigh: { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.3)', borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  textCrit: { color: '#f43f5e' },
  textHigh: { color: '#f59e0b' },
  timeText: { fontSize: 10, color: '#64748b', fontFamily: 'monospace' },
  alertTitle: { fontSize: 14, fontWeight: '700', color: '#ffffff', lineHeight: 20 },
  evidenceBox: {
    backgroundColor: '#121826',
    borderColor: '#1e293b',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  remediationBox: {
    backgroundColor: 'rgba(6, 182, 212, 0.05)',
    borderColor: 'rgba(6, 182, 212, 0.2)',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  boxLabel: { fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700', marginBottom: 2 },
  evidenceText: { fontSize: 11, color: '#cbd5e1', lineHeight: 16 },
  remediationText: { fontSize: 11, color: '#06b6d4', lineHeight: 16 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTopColor: '#1e293b', borderTopWidth: 1 },
  agentTag: { fontSize: 10, color: '#94a3b8', fontFamily: 'monospace' },
  idTag: { fontSize: 10, color: '#64748b', fontFamily: 'monospace' },
});
