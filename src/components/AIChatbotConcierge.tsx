'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageCircle, Send, X, Bot, Sparkles,
  Loader2,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  AI Chatbot Concierge — LLM-style travel assistant chat UI         */
/* ------------------------------------------------------------------ */

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  suggestions?: string[];
  ts: string;
}

const QUICK_PROMPTS_TR = [
  '🏖️ Ailemle hafta sonu Ege\'de ne yapabiliriz?',
  '✈️ En ucuz İstanbul-Antalya uçuşu ne zaman?',
  '🏨 Kapadokya cave hotel önerisi',
  '🎒 5 günlük bütçe dostu Akdeniz turu',
];

const QUICK_PROMPTS_EN = [
  '🏖️ Weekend trip ideas for families in Aegean',
  '✈️ Cheapest Istanbul-Antalya flights?',
  '🏨 Cappadocia cave hotel recommendation',
  '🎒 5-day budget Mediterranean tour',
];

const BOT_RESPONSES: Record<string, { text: string; suggestions: string[] }> = {
  'ege': {
    text: 'Ege için harika seçenekler var! 🌊 Çeşme\'de plaj + Efes antik kenti günübirlik tur, ya da Bozcaada\'da şarap tadımı ile birleştirilmiş 2 günlük paket önerebilirim. Bütçeniz nedir?',
    suggestions: ['Çeşme paketleri göster', 'Bozcaada turları', 'En ucuz Ege oteli'],
  },
  'ucuz': {
    text: 'İstanbul-Antalya hattında en uygun fiyatlar genelde Salı ve Çarşamba günleri! 📊 Haziran 2026 için 899₺\'den başlayan biletler mevcut. Fiyat takibi açayım mı?',
    suggestions: ['Fiyat takibi aç', 'Haziran uçuşlarını listele', 'Alternatif havayolları'],
  },
  'kapadokya': {
    text: 'Kapadokya cave hotel klasikleri: ⭐ Museum Hotel (lüks), Sultan Cave Suites (Instagram-famous teras), Kayakapi Premium Caves (butik). Tarihleriniz nedir?',
    suggestions: ['Museum Hotel detay', 'Bütçe dostu cave oteller', 'Balon turu ekle'],
  },
  'default': {
    text: 'Size yardımcı olmak için buradayım! ✨ Uçuş, otel veya tur hakkında sorularınızı sorabilirsiniz. Bütçenizi ve tarihlerinizi belirtirseniz daha kişisel öneriler sunabilirim.',
    suggestions: ['Popüler turları göster', 'En ucuz uçuşlar', 'Bana özel öneriler'],
  },
};

function matchResponse(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes('ege') || lower.includes('aegean')) return BOT_RESPONSES['ege'];
  if (lower.includes('ucuz') || lower.includes('cheap') || lower.includes('fiyat')) return BOT_RESPONSES['ucuz'];
  if (lower.includes('kapadokya') || lower.includes('cappadocia') || lower.includes('cave')) return BOT_RESPONSES['kapadokya'];
  return BOT_RESPONSES['default'];
}

interface Props { locale?: string; }

export default function AIChatbotConcierge({ locale = 'tr' }: Props) {
  const isTr = locale === 'tr';
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Message[]>([
    {
      id: '0', role: 'assistant', ts: '18:00',
      text: isTr
        ? 'Merhaba! 👋 Ben İzge, seyahat asistanınız. Size nasıl yardımcı olabilirim?'
        : 'Hi! 👋 I\'m İzge, your travel assistant. How can I help?',
      suggestions: isTr ? QUICK_PROMPTS_TR.slice(0, 3) : QUICK_PROMPTS_EN.slice(0, 3),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text, ts: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) };
    setMsgs(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    /* Simulated LLM delay */
    setTimeout(() => {
      const resp = matchResponse(text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(), role: 'assistant', text: resp.text,
        suggestions: resp.suggestions,
        ts: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMsgs(prev => [...prev, botMsg]);
      setTyping(false);
    }, 1200 + Math.random() * 800);
  }, []);

  const quickPrompts = isTr ? QUICK_PROMPTS_TR : QUICK_PROMPTS_EN;

  /* Floating button */
  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-xl hover:scale-105 transition flex items-center justify-center group"
        aria-label="Open chat">
        <MessageCircle className="w-6 h-6 group-hover:hidden" />
        <Sparkles className="w-6 h-6 hidden group-hover:block animate-pulse" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[560px] rounded-2xl shadow-2xl border border-gray-100 bg-white flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">İzge AI Concierge</p>
            <p className="text-xs text-indigo-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              {isTr ? 'Çevrimiçi' : 'Online'}
            </p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="hover:bg-white/20 rounded-lg p-1 transition">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50 min-h-0">
        {msgs.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-md' : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-md'
            }`}>
              {m.role === 'assistant' && <Bot className="w-3.5 h-3.5 text-indigo-400 mb-1 inline-block mr-1" />}
              {m.text}
              {m.suggestions && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.suggestions.map(s => (
                    <button key={s} onClick={() => sendMessage(s)}
                      className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs hover:bg-indigo-100 transition border border-indigo-100 whitespace-nowrap">
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <span className="block text-[10px] mt-1 opacity-50 text-right">{m.ts}</span>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            {isTr ? 'İzge yazıyor...' : 'İzge is typing...'}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick prompts (only when few messages) */}
      {msgs.length <= 1 && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex gap-2 overflow-x-auto shrink-0">
          {quickPrompts.map(qp => (
            <button key={qp} onClick={() => sendMessage(qp)}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition">
              {qp}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-100 px-4 py-3 flex gap-2 bg-white shrink-0">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          placeholder={isTr ? 'Sorunuzu yazın...' : 'Ask anything...'}
          className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 transition" />
        <button onClick={() => sendMessage(input)} disabled={!input.trim() || typing}
          className="px-3 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
