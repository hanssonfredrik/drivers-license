import { Suspense, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import { gamificationEngine } from '@/services/gamificationEngine';

const router = createBrowserRouter(routes);

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Laddar...</p>
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
