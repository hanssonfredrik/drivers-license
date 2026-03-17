import { Suspense } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

interface NavItem {
  to: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Hem', icon: '🏠' },
  { to: '/study', label: 'Studera', icon: '📚' },
  { to: '/quiz', label: 'Quiz', icon: '✅' },
  { to: '/stats', label: 'Statistik', icon: '📊' },
  { to: '/signs', label: 'Skyltar', icon: '🚧' },
];

function PageLoader() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar — visible on md+ */}
      <nav className="hidden md:flex md:flex-col md:w-60 md:min-h-screen bg-white border-r border-gray-200 p-4 gap-1 flex-shrink-0">
        <div className="mb-6 px-3">
          <h1 className="text-lg font-bold text-brand-700">🚗 B-Körkort</h1>
          <p className="text-xs text-gray-500">Teoriträning</p>
        </div>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              )
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
        <NavLink
          to="/bookmarks"
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mt-auto',
              isActive
                ? 'bg-brand-50 text-brand-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
            )
          }
        >
          <span className="text-lg">🔖</span>
          Bokmärken
        </NavLink>
      </nav>

      {/* Main content area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <div className="flex-1 pb-20 md:pb-0">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </main>

      {/* Bottom nav — visible on mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center safe-bottom z-10">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors',
                isActive ? 'text-brand-700' : 'text-gray-500',
              )
            }
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
