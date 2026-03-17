import { Suspense, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import { gamificationEngine } from '@/services/gamificationEngine';

const router = createBrowserRouter(routes);

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-brand-500/30 border-t-brand-400 animate-spin" />
        <p className="text-sm text-gray-400 tracking-wide">Laddar...</p>
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    void gamificationEngine.updateStreak();
  }, []);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
