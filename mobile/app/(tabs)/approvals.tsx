import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { CheckSquare, Check, X, Clock, Shield, AlertTriangle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface ApprovalItem {
  id: string;
  agentName: string;
  toolName: string;
  amount?: string;
  reason: string;
  expires: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export default function MobileApprovalsScreen() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([
    {
      id: 'appr_8821a',
      agentName: 'FinReconcileBot',
      toolName: 'initiate_settlement',
      amount: '$14,850.00 USD',
      reason: 'Wire exceeds autonomous limit ($5,000.00)',
      expires: '12m remaining',
      status: 'PENDING',
    },
    {
      id: 'appr_7714b',
      agentName: 'DevOpsInfraWorker',
      toolName: 'restart_pod',
      reason: 'Target is core production payment worker',
      expires: '9m remaining',
      status: 'PENDING',
    },
    {
      id: 'appr_5532c',
      agentName: 'CustomerSupportCopilot',
      toolName: 'update_ticket_status',
      amount: '$1,200.00 refund',
      reason: 'VIP Enterprise account modification',
      expires: '4m remaining',
      status: 'PENDING',
    },
  ]);

  const handleApprove = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setApprovals(
      approvals.map((a) => (a.id === id ? { ...a, status: 'APPROVED' } : a))
    );
    Alert.alert('Execution Approved', `Signed token dispatched for request ${id}.`);
  };

  const handleReject = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setApprovals(
      approvals.map((a) => (a.id === id ? { ...a, status: 'REJECTED' } : a))
    );
    Alert.alert('Execution Rejected', `Request ${id} aborted. Fail-closed halt enforced.`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Mobile Approval Queue</Text>
        <Text style={styles.sub}>Cryptographically bound human authorization requests</Text>
      </View>

      <View style={styles.list}>
        {approvals.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.agentName}>{item.agentName}</Text>
                <Text style={styles.toolName}>{item.toolName}()</Text>
              </View>
              <View style={[
                styles.badge,
                item.status === 'APPROVED' ? styles.badgeApproved :
                item.status === 'REJECTED' ? styles.badgeRejected : styles.badgePending
              ]}>
                <Text style={[
                  styles.badgeText,
                  item.status === 'APPROVED' ? styles.textApproved :
                  item.status === 'REJECTED' ? styles.textRejected : styles.textPending
                ]}>{item.status}</Text>
              </View>
            </View>

            {item.amount && (
              <View style={styles.amountBox}>
                <Text style={styles.amountLabel}>Requested Value</Text>
                <Text style={styles.amountValue}>{item.amount}</Text>
              </View>
            )}

            <Text style={styles.reasonText}>{item.reason}</Text>

            <View style={styles.metaRow}>
              <View style={styles.metaLeft}>
                <Clock size={12} color="#f59e0b" />
                <Text style={styles.metaText}>{item.expires}</Text>
              </View>
              <Text style={styles.tokenId}>ID: {item.id}</Text>
            </View>

            {item.status === 'PENDING' ? (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={() => handleReject(item.id)}
                  activeOpacity={0.8}
                >
                  <X size={16} color="#f43f5e" />
                  <Text style={styles.rejectText}>Reject</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.approveBtn}
                  onPress={() => handleApprove(item.id)}
                  activeOpacity={0.8}
                >
                  <Check size={16} color="#080b11" />
                  <Text style={styles.approveText}>Approve</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.decidedNotice}>
                <Text style={styles.decidedText}>
                  Decision finalized. Audit event hash appended to ledger.
                </Text>
              </View>
            )}
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
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  agentName: { fontSize: 14, fontWeight: '700', color: '#ffffff' },
  toolName: { fontSize: 11, fontFamily: 'monospace', color: '#06b6d4', marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgePending: { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.3)', borderWidth: 1 },
  badgeApproved: { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)', borderWidth: 1 },
  badgeRejected: { backgroundColor: 'rgba(244, 63, 94, 0.15)', borderColor: 'rgba(244, 63, 94, 0.3)', borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  textPending: { color: '#f59e0b' },
  textApproved: { color: '#10b981' },
  textRejected: { color: '#f43f5e' },
  amountBox: {
    backgroundColor: '#121826',
    borderColor: '#1e293b',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  amountLabel: { fontSize: 10, color: '#94a3b8' },
  amountValue: { fontSize: 16, fontWeight: '800', color: '#ffffff', marginTop: 2 },
  reasonText: { fontSize: 12, color: '#cbd5e1', lineHeight: 18, marginTop: 4 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopColor: '#1e293b', borderTopWidth: 1 },
  metaLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 10, color: '#f59e0b', fontFamily: 'monospace' },
  tokenId: { fontSize: 10, color: '#64748b', fontFamily: 'monospace' },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: 'rgba(244, 63, 94, 0.4)',
    borderWidth: 1,
    backgroundColor: 'rgba(244, 63, 94, 0.08)',
  },
  rejectText: { color: '#f43f5e', fontSize: 12, fontWeight: '700' },
  approveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#06b6d4',
  },
  approveText: { color: '#080b11', fontSize: 12, fontWeight: '800' },
  decidedNotice: { marginTop: 12, paddingTop: 10, borderTopColor: '#1e293b', borderTopWidth: 1 },
  decidedText: { fontSize: 10, color: '#10b981', fontStyle: 'italic' },
});
