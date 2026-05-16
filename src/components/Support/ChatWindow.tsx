'use client';

import { useEffect, useRef, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { X, Send, Paperclip, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { SUPPORT_AGENT } from '@/data/support';
import { useChatStore } from '@/store/useChatStore';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import QuickActions from './QuickActions';

function isOpenHours(): boolean {
  const now = new Date();
  const d = now.getDay();
  const t = now.getHours() * 60 + now.getMinutes();
  if (d === 0) return false;
  if (d === 6) return t >= 540 && t < 840;
  return t >= 540 && t < 1080;
}

interface Props {
  locale: string;
  onClose?: () => void;
}

const STATUS_LABELS_TR: Record<string, string> = {
  confirmed: 'Onaylandi',
  pending: 'Bekliyor',
  cancelled: 'Iptal Edildi',
  completed: 'Tamamlandi',
};
const STATUS_LABELS_EN: Record<string, string> = {
  confirmed: 'Confirmed',
  pending: 'Pending',
  cancelled: 'Cancelled',
  completed: 'Completed',
};
const TYPE_LABELS_TR: Record<string, string> = {
  flight: 'Ucus', hotel: 'Otel', tour: 'Tur', visa: 'Vize', car: 'Arac', general: 'Genel',
};
const TYPE_LABELS_EN: Record<string, string> = {
  flight: 'Flight', hotel: 'Hotel', tour: 'Tour', visa: 'Visa', car: 'Car Rental', general: 'General',
};

const WIRE_STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

export default function ChatWindow({ locale }: Props) {
  const t = useTranslations('support');
  // Use the locale prop directly with fallback to try useParams if prop not provided
  let effectiveLocale = locale;
  if (!effectiveLocale) {
    try {
      const params = useParams() as { locale?: string };
      effectiveLocale = (params?.locale as string) ?? 'tr';
    } catch {
      effectiveLocale = 'tr';
    }
  }
  const l = effectiveLocale;
  const online = isOpenHours();
  const chatStore = useChatStore();
  const messages = useMemo(() => chatStore.messages ?? [], [chatStore.messages]);
  const isAgentTyping = chatStore.isAgentTyping;
  const sendMessage = chatStore.sendMessage;
  const triggerQuickAction = chatStore.triggerQuickAction;
  const toggleChat = chatStore.toggleChat;
  const { selectedWireItem } = chatStore;
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const hasUser = messages.length > 0 && messages.some((m) => m.isMe);
  const [wireDetailOpen, setWireDetailOpen] = useState(false);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isAgentTyping]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = inputRef.current?.value?.trim();
    if (!v) return;
    sendMessage(v, l as 'tr' | 'en');
    if (inputRef.current) inputRef.current.value = '';
  };

  const ft = (d: Date) =>
    d.toLocaleTimeString(l === 'en' ? 'en-US' : 'tr-TR', { hour: '2-digit', minute: '2-digit' });

  const isEn = l === 'en';
  const statusLabel = (s: string) => isEn ? STATUS_LABELS_EN[s] ?? s : STATUS_LABELS_TR[s] ?? s;
  const typeLabel = (t2: string) => isEn ? TYPE_LABELS_EN[t2] ?? t2 : TYPE_LABELS_TR[t2] ?? t2;

  return (
    <div className="fixed bottom-0 right-0 z-50 w-full md:bottom-24 md:right-6 md:w-[380px] md:h-[560px] md:rounded-xl overflow-hidden shadow-2xl border border-gray-200 bg-white flex flex-col animate-in slide-in-from-bottom-2 dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-zinc-900/50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="text-2xl">{SUPPORT_AGENT.avatar}</span>
            <span className={`absolute -bottom-0.5 -right-0.5 block w-3 h-3 rounded-full border-2 border-blue-700 ${online ? 'bg-green-400' : 'bg-gray-400'}`} />
          </div>
          <div>
            <p className="text-sm font-medium leading-none">{SUPPORT_AGENT.name}</p>
            <p className="text-xs text-blue-200 mt-0.5">
              {online ? t('online') : t('offline')}
              <span className="ml-1 opacity-60">
                {isEn ? '· Izgetour Support' : '· Izgetour Destek'}
              </span>
            </p>
          </div>
        </div>
        <button onClick={() => toggleChat(l as 'tr' | 'en')} className="p-1.5 hover:bg-blue-500 rounded-lg transition-colors" aria-label="Close chat">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Wire Detail Panel */}
      {selectedWireItem && (
        <div className={`bg-blue-50 border-b border-blue-100 transition-all duration-300 dark:bg-zinc-800 dark:border-zinc-700 ${wireDetailOpen ? 'max-h-48' : 'max-h-0'} overflow-hidden`}>
          <button
            onClick={() => setWireDetailOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors dark:text-blue-400 dark:hover:bg-zinc-700"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              {isEn ? 'Booking Detail' : 'Rezervasyon Detayi'}
              <span className="font-mono text-blue-500 dark:text-blue-400">{selectedWireItem.code}</span>
            </span>
            {wireDetailOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {wireDetailOpen && (
            <div className="px-4 pb-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 dark:text-zinc-400">{typeLabel(selectedWireItem.type)}</span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${WIRE_STATUS_COLORS[selectedWireItem.status] ?? 'bg-gray-100 text-gray-600 dark:bg-zinc-700 dark:text-zinc-400'}`}>
                  {statusLabel(selectedWireItem.status)}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-900 leading-tight dark:text-white">{selectedWireItem.title}</p>
              <p className="text-xs text-gray-500 dark:text-zinc-400">{selectedWireItem.subtitle}</p>
              <div className="flex items-center justify-between pt-1 border-t border-blue-100 dark:border-zinc-700">
                <span className="text-xs text-gray-500 dark:text-zinc-400">{selectedWireItem.date}</span>
                <span className="text-sm font-bold text-blue-700 dark:text-blue-400">{selectedWireItem.amount} {selectedWireItem.currency}</span>
              </div>
              {/* Detail rows */}
              {selectedWireItem.details.slice(0, 2).map((d2, i) => (
                <div key={i} className="flex justify-between text-[11px] text-gray-600 dark:text-zinc-400">
                  <span>{isEn ? d2.labelEn : d2.label}</span>
                  <span className="font-medium text-gray-800 dark:text-zinc-200">{d2.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50 dark:bg-zinc-900">
        {!online && !hasUser && (
          <div className="flex flex-col items-center py-6 text-gray-400 dark:text-zinc-500">
            <Clock className="w-8 h-8 mb-2" />
            <p className="text-sm font-medium">{t('offlineTitle')}</p>
            <p className="text-xs text-center mt-1">{t('offlineMessage')}</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${msg.isMe ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white text-gray-700 shadow-sm rounded-bl-sm border border-gray-100 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'}`}>
              <p>{l === 'en' ? msg.textEn : msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.isMe ? 'text-blue-200' : 'text-gray-400 dark:text-zinc-500'} flex items-center gap-1`}>
                <span>{ft(msg.timestamp)}</span>
                {msg.isMe && (
                  <>
                    {msg.status === 'sending' && <span className="opacity-70">{isEn ? '· sending' : '· gonderiliyor'}</span>}
                    {msg.status === 'sent' && <span>✓</span>}
                    {msg.status === 'delivered' && <span className="font-medium">✓✓</span>}
                  </>
                )}
              </p>
            </div>
          </div>
        ))}
        {isAgentTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-500 px-4 py-2.5 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce dark:bg-zinc-500" style={{animationDelay:'0ms'}} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce dark:bg-zinc-500" style={{animationDelay:'150ms'}} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce dark:bg-zinc-500" style={{animationDelay:'300ms'}} />
                <span className="text-xs ml-1">{t('typing')}</span>
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick Actions */}
      <QuickActions
        locale={l}
        onAction={(id) => triggerQuickAction(id, l as 'tr' | 'en')}
        visible={!hasUser && online}
      />

      {/* Input */}
      <form onSubmit={submit} className="p-3 border-t border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 dark:bg-zinc-800">
          <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors dark:text-zinc-500 dark:hover:text-zinc-300" aria-label="Attach"><Paperclip className="w-4 h-4" /></button>
          <input ref={inputRef} type="text" placeholder={t('send')} className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400 dark:text-zinc-300 dark:placeholder-zinc-500" disabled={!online} />
          <button type="submit" disabled={!online} className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
