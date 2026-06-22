import React from 'react';
import { useTranslation } from '@/locales/LanguageContext';

export const StatusBadge = ({ status }) => {
  const { t } = useTranslation();

  const config = {
    open: {
      text: t('statOpen'),
      className: 'bg-status-open-bg text-status-open border-blue-500/20 dark:border-blue-400/20'
    },
    verifying: {
      text: t('statVerifying'),
      className: 'bg-status-verifying-bg text-status-verifying border-purple-500/20 dark:border-purple-400/20'
    },
    resolved: {
      text: t('statResolved'),
      className: 'bg-status-resolved-bg text-status-resolved border-green-500/20 dark:border-green-400/20'
    },
    rejected: {
      text: t('statRejected'),
      className: 'bg-status-rejected-bg text-status-rejected border-gray-500/20 dark:border-gray-400/20'
    }
  };

  const current = config[status] || { text: status, className: 'bg-gray-100 text-gray-800 border-gray-200' };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${current.className} transition-colors duration-200`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {current.text}
    </span>
  );
};

export const SeverityBadge = ({ severity }) => {
  const { t } = useTranslation();

  const config = {
    low: {
      text: t('sevLow'),
      className: 'bg-severity-low-bg text-severity-low border-emerald-500/20 dark:border-emerald-400/20'
    },
    medium: {
      text: t('sevMedium'),
      className: 'bg-severity-medium-bg text-severity-medium border-amber-500/20 dark:border-amber-400/20'
    },
    high: {
      text: t('sevHigh'),
      className: 'bg-severity-high-bg text-severity-high border-orange-500/20 dark:border-orange-400/20'
    },
    critical: {
      text: t('sevCritical'),
      className: 'bg-severity-critical-bg text-severity-critical border-rose-500/20 dark:border-rose-400/20 font-bold tracking-wide'
    }
  };

  const current = config[severity] || { text: severity, className: 'bg-gray-100 text-gray-800 border-gray-200' };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${current.className} transition-colors duration-200`}>
      {current.text}
    </span>
  );
};
