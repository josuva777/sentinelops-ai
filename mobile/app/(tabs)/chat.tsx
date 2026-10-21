import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Send, Bot, User, Sparkles, Shield, AlertCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  isError?: boolean;
}

function parseDataStream(raw: string): string {
  if (!raw) return '';
  try {
    const json = JSON.parse(raw);
    if (json.error) return `Error: ${json.error}`;
    if (typeof json.text === 'string') return json.text;
    if (typeof json.message === 'string') return json.message;
  } catch {}

  const lines = raw.split('\n');
  let extracted = '';
  let isDataStream = false;

  for (const line of lines) {
    if (line.startsWith('0:')) {
      isDataStream = true;
      try {
        const chunk = JSON.parse(line.slice(2));
        extracted += chunk;
      } catch {
        extracted += line.slice(2).replace(/^"(.*)"$/, '$1');
      }
    }
  }

  if (isDataStream && extracted.trim()) {
    return extracted.trim();
  }
  return raw.trim();
}

export default function MobileChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'SentinelOps Mobile Copilot active. Ask about any blocked agent event, active policy rule, or request an incident summary.',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    const query = inputText.trim();
    if (!query || isLoading) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    setTimeout(() => {
      let reply = '';
      const lower = query.toLowerCase();

      if (lower.includes('why') || lower.includes('drop') || lower.includes('block')) {
        reply =
          'DevOpsInfraWorker attempted to execute drop_database_table("customers_archive").\n\n' +
          'Enforcement: HALTED IN-LINE.\n' +
          'Rule: r_inf_01 (Zero-Destruction Guardrail).\n' +
          'Result: 0 data lost. Telemetry logged to SHA-256 ledger.';
      } else if (lower.includes('approval') || lower.includes('wire')) {
        reply =
          'FinReconcileBot requested a $14,850.00 wire transfer.\n\n' +
          'Status: PENDING in mobile approval queue.\n' +
          'Rule: r_fin_02 (Threshold: $5,000.00).\n' +
          'Open the Approvals tab to review and issue one-time execution token.';
      } else {
        reply =
          `Telemetry query for "${query}":\n\n` +
          'All 4 monitored agents are operating under strict fail-closed enforcement. 7,497 total actions evaluated with 47 attacks neutralized today.';
      }

      const aiReply: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: reply,
      };

      setMessages((prev) => [...prev, aiReply]);
      setIsLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 350);
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isAi = item.sender === 'assistant';
    return (
      <View style={[styles.messageRow, isAi ? styles.aiRow : styles.userRow]}>
        <View style={[styles.avatar, isAi ? styles.aiAvatar : styles.userAvatar]}>
          {isAi ? <Sparkles size={14} color="#06b6d4" /> : <User size={14} color="#080b11" />}
        </View>
        <View style={[styles.bubble, isAi ? styles.aiBubble : styles.userBubble]}>
          <Text style={[styles.messageText, isAi ? styles.aiText : styles.userText]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.statusDot} />
          <Text style={styles.headerTitle}>AI Security Copilot</Text>
        </View>
        <View style={styles.modelPill}>
          <Shield size={12} color="#06b6d4" />
          <Text style={styles.modelText}>Fail-Closed Engine</Text>
        </View>
      </View>

      {/* Message List */}
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          testID="chat-input"
          style={styles.input}
          placeholder="Ask about blocked events, approvals..."
          placeholderTextColor="#475569"
          value={inputText}
          onChangeText={setInputText}
          editable={!isLoading}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <TouchableOpacity
          testID="send-button"
          style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#080b11" />
          ) : (
            <Send size={16} color="#080b11" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060a08' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#16281e',
    backgroundColor: '#0d1511',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981' },
  headerTitle: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  modelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  modelText: { color: '#10b981', fontSize: 10, fontWeight: '600' },
  listContent: { padding: 20, gap: 16 },
  messageRow: { flexDirection: 'row', gap: 10, maxWidth: '85%' },
  aiRow: { alignSelf: 'flex-start' },
  userRow: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  avatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  aiAvatar: { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.35)', borderWidth: 1 },
  userAvatar: { backgroundColor: '#10b981' },
  bubble: { borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  aiBubble: { backgroundColor: '#0d1511', borderColor: '#16281e', borderWidth: 1 },
  userBubble: { backgroundColor: '#10b981' },
  messageText: { fontSize: 13, lineHeight: 19 },
  aiText: { color: '#e2e8f0' },
  userText: { color: '#060a08', fontWeight: '700' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: '#16281e',
    backgroundColor: '#0d1511',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#090e0b',
    borderColor: '#16281e',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#ffffff',
    fontSize: 13,
  },
  sendButton: {
    backgroundColor: '#10b981',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: { backgroundColor: '#16281e', opacity: 0.5 },
});
