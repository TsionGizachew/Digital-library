import React from 'react';
import { ShieldCheckIcon, UserIcon, StarIcon } from '@heroicons/react/24/solid';

interface RoleBadgeProps {
  role: 'superadmin' | 'admin' | 'user';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'md', showIcon = true }) => {
  const configs = {
    superadmin: {
      label: 'SUPERADMIN',
      icon: StarIcon,
      className: 'bg-gradient-to-r from-amber-400 to-orange-500 text-white',
    },
    admin: {
      label: 'ADMIN',
      icon: ShieldCheckIcon,
      className: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
    },
    user: {
      label: 'USER',
      icon: UserIcon,
      className: 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300',
    },
  };

  const config = configs[role];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const iconSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded uppercase tracking-wide shadow-sm ${config.className} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </span>
  );
};

export default RoleBadge;
