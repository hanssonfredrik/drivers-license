import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 gap-4">
      <div className="text-7xl">🚦</div>
      <h1 className="text-3xl font-bold text-white">404 — Sidan finns inte</h1>
      <p className="text-gray-400 max-w-sm">
        Det verkar som att du kört vilse. Sidan du letade efter existerar inte.
      </p>
      <Link to="/">
        <Button variant="primary">Ta mig hem</Button>
      </Link>
    </div>
  );
}
