import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Info, Loader2 } from 'lucide-react';
import { doshaTone, formatDosha } from '../lib/format';

const cx = (...classes) => classes.filter(Boolean).join(' ');

const BUTTON_VARIANTS = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm',
  secondary: 'bg-white text-ink-700 ring-1 ring-inset ring-ink-200 hover:bg-ink-50',
  ghost: 'text-ink-600 hover:bg-ink-100 hover:text-ink-800',
  danger: 'text-red-600 hover:bg-red-50',
};

const BUTTON_SIZES = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
};

const buttonClasses = (variant, size, className) =>
  cx(
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
    BUTTON_VARIANTS[variant],
    BUTTON_SIZES[size],
    className
  );

export const Button = ({ variant = 'primary', size = 'md', icon: Icon, loading, className, children, ...props }) => (
  <button
    type="button"
    className={buttonClasses(variant, size, className)}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon && <Icon className="h-4 w-4" />}
    {children}
  </button>
);

// A router link styled as a button
export const ButtonLink = ({ variant = 'primary', size = 'md', icon: Icon, className, children, ...props }) => (
  <Link className={buttonClasses(variant, size, className)} {...props}>
    {Icon && <Icon className="h-4 w-4" />}
    {children}
  </Link>
);

export const Card = ({ className, children }) => (
  <div className={cx('rounded-xl border border-ink-200 bg-white shadow-card', className)}>{children}</div>
);

export const PageHeader = ({ title, description, actions }) => (
  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink-900">{title}</h1>
      {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
);

export const DoshaBadge = ({ dosha }) => (
  <span
    className={cx(
      'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
      doshaTone(dosha)
    )}
  >
    {formatDosha(dosha)}
  </span>
);

export const PlanStatus = ({ hasPlan }) => (
  <span className={cx('inline-flex items-center gap-1.5 text-xs font-medium', hasPlan ? 'text-brand-700' : 'text-ink-400')}>
    <span className={cx('h-1.5 w-1.5 rounded-full', hasPlan ? 'bg-brand-500' : 'bg-ink-300')} />
    {hasPlan ? 'Plan ready' : 'No plan'}
  </span>
);

const NOTICE_STYLES = {
  success: { icon: CheckCircle2, className: 'bg-brand-50 text-brand-800 ring-brand-200' },
  error: { icon: AlertCircle, className: 'bg-red-50 text-red-800 ring-red-200' },
  info: { icon: Info, className: 'bg-ink-100 text-ink-700 ring-ink-200' },
  loading: { icon: Loader2, className: 'bg-ink-100 text-ink-700 ring-ink-200' },
};

// status: { type: 'success' | 'error' | 'info' | 'loading', text }
export const Notice = ({ status, className }) => {
  if (!status?.text) return null;
  const { icon: Icon, className: tone } = NOTICE_STYLES[status.type] || NOTICE_STYLES.info;
  return (
    <div role="status" className={cx('flex items-start gap-2.5 rounded-lg px-3.5 py-2.5 text-sm ring-1 ring-inset', tone, className)}>
      <Icon className={cx('mt-0.5 h-4 w-4 flex-shrink-0', status.type === 'loading' && 'animate-spin')} />
      <span>{status.text}</span>
    </div>
  );
};

export const Spinner = ({ label = 'Loading...' }) => (
  <div className="flex items-center justify-center gap-2 py-16 text-sm text-ink-500">
    <Loader2 className="h-4 w-4 animate-spin" />
    {label}
  </div>
);

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center px-6 py-14 text-center">
    {Icon && (
      <div className="mb-4 rounded-full bg-brand-50 p-3 text-brand-600">
        <Icon className="h-6 w-6" />
      </div>
    )}
    <h3 className="text-base font-semibold text-ink-900">{title}</h3>
    {description && <p className="mt-1 max-w-sm text-sm text-ink-500">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

// Form fields
export const Field = ({ label, required, hint, children, className }) => (
  <label className={cx('block', className)}>
    <span className="mb-1.5 block text-sm font-medium text-ink-700">
      {label}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </span>
    {children}
    {hint && <span className="mt-1.5 block text-xs text-ink-500">{hint}</span>}
  </label>
);

export const Input = (props) => <input className="input" {...props} />;

export const TextArea = (props) => <textarea className="input" {...props} />;

// options: [[value, label], ...]
export const Select = ({ options, placeholder, ...props }) => (
  <select className="input" {...props}>
    {placeholder && <option value="">{placeholder}</option>}
    {options.map(([value, label]) => (
      <option key={value} value={value}>
        {label}
      </option>
    ))}
  </select>
);
