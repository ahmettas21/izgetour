'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Users, Clock, AlertCircle } from 'lucide-react';

type MessageType = 'viewer' | 'booking' | 'urgency';

interface Message {
  type: MessageType;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  textKey: string;
}

const messages: Message[] = [
  { type: 'viewer', icon: Users, textKey: 'viewer' },
  { type: 'booking', icon: Clock, textKey: 'booking' },
  { type: 'urgency', icon: AlertCircle, textKey: 'urgency' },
];

export default function SocialProofToast() {
  const t = useTranslations('socialProof');
  const [visible, setVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<Message>(messages[0]);
  const [count, setCount] = useState(5);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleNext = () => {
    if (nextTimerRef.current) clearTimeout(nextTimerRef.current);
    nextTimerRef.current = setTimeout(() => showToast(), 8000 + Math.random() * 7000);
  };

  const showToast = () => {
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    const randomCount = Math.floor(Math.random() * 10) + 3; // 3-12
    setCurrentMessage(randomMsg);
    setCount(randomCount);
    setVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
      scheduleNext();
    }, 4000);
  };

  useEffect(() => {
    const initialDelay = setTimeout(() => showToast(), 3000);
    return () => {
      clearTimeout(initialDelay);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (nextTimerRef.current) clearTimeout(nextTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  const Icon = currentMessage.icon;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 transition-all duration-500"
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        opacity: visible ? 1 : 0,
      }}
    >
      <div className="flex w-72 items-center gap-3 rounded-xl border-l-4 border-orange-500 bg-white px-4 py-3 shadow-xl ring-1 ring-zinc-900/5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-500">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium leading-tight text-zinc-800">
            {currentMessage.textKey === 'viewer' &&
              t('viewer', { count })}
            {currentMessage.textKey === 'booking' &&
              t('booking', { count })}
            {currentMessage.textKey === 'urgency' &&
              t('urgency', { count })}
          </p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="shrink-0 text-zinc-300 hover:text-zinc-500 focus:outline-none"
          aria-label="Close"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
