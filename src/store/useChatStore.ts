import { create } from 'zustand';
import {
  SupportMessage,
  WORKING_HOURS,
  isWithinWorkingHours,
  OFFLINE_MESSAGE_TR,
  OFFLINE_MESSAGE_EN,
  WELCOME_MESSAGE_TR,
  WELCOME_MESSAGE_EN,
  QUICK_ACTIONS,
  TYPING_DELAY_MIN,
  TYPING_DELAY_MAX,
} from '@/data/support';

// --- Wire item shown in the chat detail panel ---
export interface WireItem {
  id: string;
  type: 'flight' | 'hotel' | 'tour' | 'visa' | 'car' | 'general';
  code: string;
  title: string;
  subtitle: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  date: string;
  amount: string;
  currency: string;
  details: Array<{ label: string; labelEn: string; value: string }>;
}

interface ChatState {
  isOpen: boolean;
  isAgentTyping: boolean;
  messages: SupportMessage[];
  hasSeenWelcome: boolean;
  // Wire detail panel
  selectedWireItem: WireItem | null;
  showWireDetail: boolean;

  openChat: (locale: 'tr' | 'en') => void;
  closeChat: () => void;
  toggleChat: (locale: 'tr' | 'en') => void;
  sendMessage: (text: string, locale: 'tr' | 'en') => void;
  triggerQuickAction: (actionId: string, locale: 'tr' | 'en') => void;
  injectWelcomeMessage: (locale: 'tr' | 'en') => void;
  _addMessage: (msg: Omit<SupportMessage, 'id' | 'timestamp'>) => void;
  _setTyping: (typing: boolean) => void;
  _simulateAgentReply: (locale: 'tr' | 'en') => void;
  openWireDetail: (item: WireItem) => void;
  closeWireDetail: () => void;
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function randomDelay() {
  return (
    Math.floor(Math.random() * (TYPING_DELAY_MAX - TYPING_DELAY_MIN)) +
    TYPING_DELAY_MIN
  );
}

function getAgentResponse(
  _message: string,
  locale: 'tr' | 'en'
): string {
  if (locale === 'tr') {
    return 'Mesajınızı aldık. En kısa sürede size detaylı bilgi vereceğiz. Başka bir konuda yardımcı olabilir miyim?';
  }
  return 'We received your message. We will provide you with detailed information shortly. Can I help you with anything else?';
}

export const useChatStore = create<ChatState>((set, get) => ({
  isOpen: false,
  isAgentTyping: false,
  messages: [],
  hasSeenWelcome: false,
  selectedWireItem: null,
  showWireDetail: false,

  openChat: (locale) => {
    const { hasSeenWelcome } = get();
    set({ isOpen: true });

    if (!hasSeenWelcome) {
      get().injectWelcomeMessage(locale);
    }
  },

  closeChat: () => set({ isOpen: false }),

  toggleChat: (locale) => {
    const { isOpen } = get();
    if (isOpen) {
      get().closeChat();
    } else {
      get().openChat(locale);
    }
  },

  injectWelcomeMessage: (locale) => {
    const isOnline = isWithinWorkingHours(WORKING_HOURS);
    const welcomeText = isOnline
      ? locale === 'tr'
        ? WELCOME_MESSAGE_TR
        : WELCOME_MESSAGE_EN
      : locale === 'tr'
      ? OFFLINE_MESSAGE_TR
      : OFFLINE_MESSAGE_EN;

    const agentMessage: SupportMessage = {
      id: generateId(),
      text: welcomeText,
      textEn: welcomeText,
      isMe: false,
      timestamp: new Date(),
      status: 'delivered',
    };

    set((state) => ({
      hasSeenWelcome: true,
      messages: [...state.messages, agentMessage],
    }));
  },

  _addMessage: (msg) => {
    const newMsg: SupportMessage = {
      ...msg,
      id: generateId(),
      timestamp: new Date(),
    };
    set((state) => ({ messages: [...state.messages, newMsg] }));
  },

  _setTyping: (typing) => set({ isAgentTyping: typing }),

  _simulateAgentReply: (locale) => {
    const { messages } = get();
    const lastMsg = messages[messages.length - 1];
    const responseText = lastMsg
      ? getAgentResponse(lastMsg.text, locale)
      : locale === 'tr'
      ? 'Size nasıl yardımcı olabilirim?'
      : 'How can I help you?';

    set({ isAgentTyping: true });

    setTimeout(() => {
      const { isAgentTyping } = get();
      if (!isAgentTyping) return;

      const agentMessage: SupportMessage = {
        id: generateId(),
        text: responseText,
        textEn: responseText,
        isMe: false,
        timestamp: new Date(),
        status: 'delivered',
      };

      set((state) => ({
        isAgentTyping: false,
        messages: [...state.messages, agentMessage],
      }));
    }, randomDelay());
  },

  sendMessage: (text, locale) => {
    const userMsg: Omit<SupportMessage, 'id' | 'timestamp'> = {
      text,
      textEn: text,
      isMe: true,
      status: 'sending',
    };

    get()._addMessage(userMsg);

    setTimeout(() => {
      set((state) => ({
        messages: state.messages.map((m) =>
          m.text === text && m.isMe && m.status === 'sending'
            ? { ...m, status: 'sent' }
            : m
        ),
      }));
    }, 300);

    setTimeout(() => {
      set((state) => ({
        messages: state.messages.map((m) =>
          m.text === text && m.isMe && m.status === 'sent'
            ? { ...m, status: 'delivered' }
            : m
        ),
      }));
      get()._simulateAgentReply(locale);
    }, 600);
  },

  triggerQuickAction: (actionId, locale) => {
    const action = QUICK_ACTIONS.find((a) => a.id === actionId);
    if (!action) return;

    const triggerText =
      locale === 'tr' ? action.triggerText : action.triggerTextEn;
    const responseText =
      locale === 'tr' ? action.responseText : action.responseTextEn;

    const userMsg: Omit<SupportMessage, 'id' | 'timestamp'> = {
      text: triggerText,
      textEn: triggerText,
      isMe: true,
      status: 'delivered',
    };
    get()._addMessage(userMsg);

    set({ isAgentTyping: true });

    setTimeout(() => {
      const agentMessage: SupportMessage = {
        id: generateId(),
        text: responseText,
        textEn: responseText,
        isMe: false,
        timestamp: new Date(),
        status: 'delivered',
      };

      set((state) => ({
        isAgentTyping: false,
        messages: [...state.messages, agentMessage],
      }));
    }, randomDelay() + 400);
  },

  openWireDetail: (item) => set({ selectedWireItem: item, showWireDetail: true }),

  closeWireDetail: () => set({ selectedWireItem: null, showWireDetail: false }),
}));
