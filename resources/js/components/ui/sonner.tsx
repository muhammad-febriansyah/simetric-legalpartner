import { useFlashToast } from '@/hooks/use-flash-toast';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

function Toaster({ ...props }: ToasterProps) {
    useFlashToast();

    return (
        <Sonner
            {...props}
            theme="light"
            className="toaster group"
            position="top-right"
            closeButton
            richColors
            style={
                {
                    '--normal-bg': 'var(--popover)',
                    '--normal-text': 'var(--popover-foreground)',
                    '--normal-border': 'var(--border)',
                } as React.CSSProperties
            }
            toastOptions={{
                classNames: {
                    success: '!border-green-200 !bg-green-50 !text-green-900',
                    warning: '!border-orange-200 !bg-orange-50 !text-orange-900',
                    error: '!border-red-200 !bg-red-50 !text-red-900',
                },
            }}
        />
    );
}

export { Toaster };
