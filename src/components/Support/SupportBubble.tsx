'use client';

import dynamic from 'next/dynamic';
import { MessageCircle, X } from 'lucide-react';
import { useChatStore } from '@/store/useChatStore';

const ChatWindow = dynamic(() => import('./ChatWindow'), {
  ssr: false,
  loading: () => <div className="flex h-96 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--brand)] border-t-transparent" /></div>,
});

export default function SupportBubble() {
  const { isOpen, openChat, closeChat } = useChatStore();

  const handleToggle = () => {
    if (isOpen) {
      closeChat();
    } else {
      let l: 'tr' | 'en' = 'tr';
      try {
        const p = window.location.pathname;
        if (p.startsWith('/en')) l = 'en';
      } catch {}
      openChat(l);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={closeChat}
          aria-hidden="true"
        />
      )}
      {isOpen && <ChatWindow locale="tr" onClose={closeChat as () => void} />}
      <button
        onClick={handleToggle}
        aria-label="Canli Yardim"
        className={`
          fixed z-50 flex items-center justify-center rounded-full
          shadow-[0_4px_20px_rgba(0,0,0,0.15)]
          transition-all duration-300 ease-out
          hover:scale-105 active:scale-95
          bottom-6 right-6
          w-14 h-14 sm:w-16 sm:h-16
          ${
            isOpen
              ? 'bg-[var(--muted)] text-white rotate-0'
              : 'bg-[var(--brand)] dark:bg-[var(--turquoise-600)] text-white'
          }
        `}
      >
        {isOpen ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
        )}
      </button>
    </>
  );
}
