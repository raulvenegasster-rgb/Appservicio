import { cn } from '../../lib/utils.js';

export function Card({ className, ...props }) {
  return (
    <div
      className={cn('rounded-xl border border-white/10 bg-slate-900/60 shadow-lg shadow-black/20 backdrop-blur', className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('space-y-1.5 p-6 border-b border-white/5', className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn('p-6 pt-4', className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return <div className={cn('flex items-center p-6 pt-0', className)} {...props} />;
}
