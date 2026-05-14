'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { WifiOff, AlertCircle, Inbox, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-300">
        {icon ?? <Inbox className="h-8 w-8" />}
      </div>
      <h3 className="text-base font-semibold text-zinc-700">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-zinc-400">{description}</p>
      )}
      {action && (
        <div className="mt-6">
          {action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0066CC] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0052a3]"
            >
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0066CC] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0052a3]"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showBackHome?: boolean;
  className?: string;
}

export function ErrorState({
  title,
  message,
  onRetry,
  showBackHome,
  className = '',
}: ErrorStateProps) {
  const t = useTranslations('admin');
  const locale = useLocale();

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-400">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h3 className="text-base font-semibold text-zinc-700">
        {title ?? t('errorOccurred')}
      </h3>
      {message && (
        <p className="mt-1 max-w-sm text-sm text-zinc-400">{message}</p>
      )}
      <div className="mt-6 flex items-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-600 shadow-sm transition-colors hover:bg-zinc-50"
          >
            <RefreshCw className="h-4 w-4" />
            {t('retry')}
          </button>
        )}
        {showBackHome && (
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0066CC] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0052a3]"
          >
            <Home className="h-4 w-4" />
            {t('backHome')}
          </Link>
        )}
      </div>
    </div>
  );
}

interface OfflineStateProps {
  onRetry?: () => void;
  className?: string;
}

export function OfflineState({ onRetry, className = '' }: OfflineStateProps) {
  const t = useTranslations('admin');
  const locale = useLocale();
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-400">
        <WifiOff className="h-8 w-8" />
      </div>
      <h3 className="text-base font-semibold text-zinc-700">{t('offlineTitle')}</h3>
      <p className="mt-1 max-w-sm text-sm text-zinc-400">{t('offlineDesc')}</p>
      <div className="mt-6 flex items-center gap-3">
        {!isOnline && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-xs font-medium text-amber-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
            {t('checkingConnection')}
          </span>
        )}
        {isOnline && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0066CC] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0052a3]"
          >
            <RefreshCw className="h-4 w-4" />
            {t('tryAgain')}
          </button>
        )}
      </div>
    </div>
  );
}

interface PageStateProps {
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  emptyIcon?: React.ReactNode;
  emptyTitle: string;
  emptyDescription?: string;
  emptyAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  errorMessage?: string;
  onRetry?: () => void;
  showBackHome?: boolean;
  offlineMode?: boolean;
  onOfflineRetry?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function PageState({
  isLoading,
  isError,
  isEmpty,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  emptyAction,
  errorMessage,
  onRetry,
  showBackHome,
  offlineMode,
  onOfflineRetry,
  className = '',
  children,
}: PageStateProps) {
  if (isLoading) {
    return <div className={className}>{children}</div>;
  }

  if (offlineMode) {
    return (
      <div className={className}>
        <OfflineState onRetry={onOfflineRetry} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={className}>
        <ErrorState
          message={errorMessage}
          onRetry={onRetry}
          showBackHome={showBackHome}
        />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={className}>
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
          action={emptyAction}
        />
      </div>
    );
  }

  return <div className={className}>{children}</div>;
}