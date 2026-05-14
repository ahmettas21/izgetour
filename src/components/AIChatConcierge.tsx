'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, Send, X, Bot, User, Sparkles, Loader2 } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  AIChatConcierge — Travel assistant with keyword-based mock replies  */
/* ------------------------------------------------------------------ */

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  suggestions?: string[];
  ts: string;
}

const TR_SUGGESTIONS = [
  '🏖️ Ailemle Ege\'de ne yapalım?',
  '✈️ İstanbul-Antalya en ucuz uçuş',
  '🏨 Kapadokya cave otel öner',
  '🎒 5 günlük bütçe dostu tur',
];

const EN_SUGGESTIONS = [
  '🏖️ Family trip ideas in Aegean',
  '✈️ Istanbul-Antalya cheapest flight',
  '🏨 Cappadocia cave hotel recommendation',
  '🎒 5-day budget-friendly tour',
];

const RESPONSES: Array<{ keywords: string[]; textTr: string; textEn: string; suggestionsTr: string[]; suggestionsEn: string[] }> = [
  {
    keywords: ['ege', 'aegean', 'çeşme', 'bodrum', 'datça', 'marmaris', 'aile', 'family'],
    textTr: 'Ege için harika seçenekler var! 🌊 Aileler için Çeşme\'de plaj + antik kenteler, Bodrum\'da tekne turu önerebilirim. Kaç gün planlıyorsunuz?',
    textEn: 'Great options for the Aegean! 🌊 For families: Çeşme beach + ancient sites, Bodrum boat tours. How many days are you planning?',
    suggestionsTr: ['Çeşme paketleri', 'Bodrum tekne turu', 'Ege otel önerisi'],
    suggestionsEn: ['Çeşme packages', 'Bodrum boat tour', 'Aegean hotel picks'],
  },
  {
    keywords: ['ucuz', 'cheap', 'fiyat', 'price', 'bilet', 'flight', 'en ucuz'],
    textTr: 'En uygun fiyatlar Salı ve Çarşamba günleri! 📊 Haziran 2026: İstanbul-Antalya 899₺, İstanbul-İzmir 650₺, Ankara-Antalya 750₺\'den başlıyor.',
    textEn: 'Best prices are Tue & Wed! 📊 June 2026: Istanbul-Antalya from ₺899, Istanbul-Izmir from ₺650, Ankara-Antalya from ₺750.',
    suggestionsTr: ['Fiyat takibi aç', 'Tüm uçuşları listele', 'Alternatif havayolu'],
    suggestionsEn: ['Set price alert', 'List all flights', 'Alternative airlines'],
  },
  {
    keywords: ['kapadokya', 'cappadocia', 'cave', 'balon', 'balloon', 'peri bac'],
    textTr: 'Kapadokya eşsiz! 🎈 Sultan Cave Suites (ünlü teras), Museum Hotel (lüks), Kayakapi Premium (butik). Balon turu kesinlikle eklemelisiniz! ���',
    textEn: 'Cappadocia is unique! 🎈 Sultan Cave Suites (famous terrace), Museum Hotel (luxury), Kayakapi Premium (boutique). The balloon tour is a must!',
    suggestionsTr: ['Balon turu fiyat', 'Cave otel öner', 'Kapadokya turu'],
    suggestionsEn: ['Balloon tour price', 'Cave hotel picks', 'Cappadocia tour'],
  },
  {
    keywords: ['italy', 'italya', 'roma', 'floransa', 'venedik', 'rome', 'florence', 'venice'],
    textTr: 'İtalya harika! 🍝 Roma (2 gece) → Floransa (1 gece) → Venedik (2 gece) combo önerebilirim. Kişi başı 1.200€\'dan başlıyor.',
    textEn: 'Italy is amazing! 🍝 I recommend Rome (2 nights) → Florence (1 night) → Venice (2 nights). From €1,200 per person.',
    suggestionsTr: ['İtalya turu detay', 'Uçak bileti', 'İtalyan otel öner'],
    suggestionsEn: ['Italy tour details', 'Flight tickets', 'Italian hotel picks'],
  },
  {
    keywords: ['otel', 'hotel', 'bütçe', 'budget', 'lüks', 'luxury', 'butik'],
    textTr: 'Bütçe aralığınıza göre: 🏨 Ekonomik 500-800₺/gece, Orta 800-1500₺/gece, Lüks 1500+₺/gece. Tercihiniz nedir?',
    textEn: 'By budget: 🏨 Budget ₺500-800/night, Mid-range ₺800-1500/night, Luxury ₺1500+/night. What\'s your preference?',
    suggestionsTr: ['Ekonomik oteller', 'Butik otel öner', 'Lüks otel öner'],
    suggestionsEn: ['Budget hotels', 'Boutique picks', 'Luxury hotel picks'],
  },
  {
    keywords: ['tur', 'tour', 'gezi', 'antep', 'gap', 'doğu'],
    textTr: 'Türkiye turları çok popüler! 🗺️ Güneydoğu GAP turu (3 gün), Kapadokya (2 gün), Efes-Pamukkale combo önerebilirim.',
    textEn: 'Turkey tours are very popular! 🗺️ I recommend Southeast GAP tour (3 days), Cappadocia (2 days), Ephesus-Pamukkale combo.',
    suggestionsTr: ['GAP turu detay', 'Kapadokya turu', 'Ege turları'],
    suggestionsEn: ['GAP tour details', 'Cappadocia tour', 'Aegean tours'],
  },
];

function matchReply(text: string) {
  const lower = text.toLowerCase();
  for (const r of RESPONSES) {
    if (r.keywords.some(k => lower.includes(k))) return r;
  }
  return null;
}

const DEFAULT_TR = {
  text: 'Size nasıl yardımcı olabilirim? ✈️ Tur, uçuş, otel veya vize hakkında sorularınızı yanıtlayabilirim.',
  suggestions: TR_SUGGESTIONS,
};
const DEFAULT_EN = {
  text: 'How can I help you? ✈️ I can answer questions about tours, flights, hotels, or visas.',
  suggestions: EN_SUGGESTIONS,
};

type Props = { locale?: 'tr' | 'en' };

export default function AIChatConcierge({ locale = 'tr' }: Props) {
  const isTr = locale === 'tr';
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    id: 'init', role: 'assistant', ts: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    text: isTr ? 'Merhaba! 👋 Ben İzge, seyahat asistanınız. Size nasıl yardımcı olabilirim?' : 'Hi! 👋 I\'m İzge, your travel assistant. How can I help?',
    suggestions: isTr ? TR_SUGGESTIONS : EN_SUGGESTIONS,
  }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(), role: 'user', text: text.trim(),
      ts: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const matched = matchReply(text);
      let reply: { text: string; suggestions: string[] };
      if (matched) {
        reply = { text: isTr ? matched.textTr : matched.textEn, suggestions: isTr ? matched.suggestionsTr : matched.suggestionsEn };
      } else {
        reply = isTr ? DEFAULT_TR : DEFAULT_EN;
      }
      const botMsg: Message = {
        id: (Date.now() + 1).toString(), role: 'assistant', text: reply.text,
        suggestions: reply.suggestions,
        ts: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMsg]);
      setTyping(false);
    }, 1000 + Math.random() * 700);
  }, [isTr]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-xl transition hover:scale-105 group"
        aria-label={isTr ? 'Sohbeti Aç' : 'Open Chat'}
      >
        <MessageCircle className="h-6 w-6" />
        <Sparkles className="hidden group-hover:flex absolute h-5 w-5 animate-pulse" />
        <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex w-[380px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl"
      style={{ maxHeight: '560px' }}>
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4 text-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">İzge AI Concierge</p>
            <p className="flex items-center gap-1 text-xs text-indigo-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {isTr ? 'Çevrimiçi' : 'Online'}
            </p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="rounded-lg p-1 hover:bg-white/20 transition">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-3 min-h-0">
        <div className="space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'rounded-br-md bg-indigo-600 text-white'
                  : 'rounded-bl-md border border-gray-100 bg-white text-gray-800 shadow-sm'
              }`}>
                {msg.role === 'assistant' && <Bot className="mb-1 mr-1 inline-block h-3.5 w-3.5 text-indigo-400" />}
                {msg.role === 'user' && <User className="mb-1 mr-1 inline-block h-3.5 w-3.5 text-indigo-200" />}
                {msg.text}
                {msg.suggestions && msg.role === 'assistant' && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {msg.suggestions.map(s => (
                      <button key={s} onClick={() => sendMessage(s)}
                        className="whitespace-nowrap rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs text-indigo-600 transition hover:bg-indigo-100">
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                <span className="mt-1 block text-[10px] text-right opacity-50">{msg.ts}</span>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              {isTr ? 'İzge yazıyor...' : 'İzge is typing...'}
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-gray-100 px-4 py-3 bg-white shrink-0">
        <input
          type="text" value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          placeholder={isTr ? 'Sorunuzu yazın...' : 'Ask anything...'}
          className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 transition" />
        <button onClick={() => sendMessage(input)} disabled={!input.trim() || typing}
          className="rounded-xl bg-indigo-600 px-3 py-2 text-white transition hover:bg-indigo-700 disabled:opacity-40">
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
