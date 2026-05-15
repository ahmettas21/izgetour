'use client';

import { useTranslations } from 'next-intl';
import { Ticket, FileX, Search, FileText, HelpCircle } from 'lucide-react';
import { QUICK_ACTIONS } from '@/data/support';

const iconMap: Record<string, React.ReactNode> = {
  Ticket: <Ticket className="w-4 h-4" />,
  FileX: <FileX className="w-4 h-4" />,
  Search: <Search className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
};

interface Props {
  locale: string;
  onAction: (actionId: string) => void;
  visible: boolean;
}

export default function QuickActions({ locale, onAction, visible }: Props) {
  const t = useTranslations('support');
  if (!visible) return null;

  return (
    <div className="px-3 py-2 border-b border-gray-100 dark:border-zinc-700">
      <p className="text-xs text-gray-400 mb-2 flex items-center gap-1 dark:text-zinc-500">
        <HelpCircle className="w-3 h-3" />
        {t('quickActions')}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {QUICK_ACTIONS.map((a) => (
          <button key={a.id} onClick={() => onAction(a.id)}
            className="flex items-center gap-1.5 px-2 py-1.5 text-xs rounded-lg border border-gray-200 
                       hover:border-blue-300 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all duration-150
                       dark:border-zinc-700 dark:hover:border-blue-500 dark:hover:bg-blue-900/20 dark:text-zinc-400 dark:hover:text-blue-400"
          >
            {iconMap[a.icon] || <HelpCircle className="w-4 h-4" />}
            <span>{locale === 'en' ? a.triggerTextEn : a.triggerText}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
