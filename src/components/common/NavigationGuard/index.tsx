import { useBlocker } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

interface NavigationGuardProps {
  when: boolean;
  title: string;
  message: string;
}

export function NavigationGuard({ when, title, message }: NavigationGuardProps) {
  const blocker = useBlocker(when);

  if (blocker.state !== 'blocked') return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-sm text-center py-6">
        <p className="text-base font-semibold text-white mb-2">{title}</p>
        <p className="text-sm text-gray-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => blocker.reset()}>
            Fortsätt
          </Button>
          <Button variant="danger" fullWidth onClick={() => blocker.proceed()}>
            Avsluta
          </Button>
        </div>
      </Card>
    </div>
  );
}
