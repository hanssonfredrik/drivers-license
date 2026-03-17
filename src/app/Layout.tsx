import { Suspense } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

interface NavItem {
  to: string;
  label: string;
  icon: string;
  activeIcon: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Hem', icon: '◇', activeIcon: '◆' },
  { to: '/study', label: 'Studera', icon: '▷', activeIcon: '▶' },
  { to: '/quiz', label: 'Quiz', icon: '⬡', activeIcon: '⬢' },
  { to: '/stats', label: 'Statistik', icon: '◈', activeIcon: '◈' },
  { to: '/signs', label: 'Skyltar', icon: '△', activeIcon: '▲' },
];

function PageLoader() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="w-8 h-8 rounded-full border-2 border-brand-500/30 border-t-brand-400 animate-spin" />
    </div>
  );
}

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar — visible on md+ */}
      <nav className="hidden md:flex md:flex-col md:w-64 md:min-h-screen bg-slate-900/80 backdrop-blur-xl border-r border-white/5 p-5 gap-1 flex-shrink-0">
        <div className="mb-8 px-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center text-white font-bold text-sm shadow-glow-sm">
              B
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">Körkort</h1>
              <p className="text-[11px] text-gray-500 tracking-wider uppercase">Teoriträning</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-brand-600/20 text-brand-300 shadow-glow-sm border border-brand-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className={clsx('text-base', isActive && 'text-brand-400')}>
                    {isActive ? item.activeIcon : item.icon}
                  </span>
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-white/5">
          <NavLink
            to="/bookmarks"
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-brand-600/20 text-brand-300 shadow-glow-sm border border-brand-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className={clsx('text-base', isActive && 'text-brand-400')}>
                  {isActive ? '★' : '☆'}
                </span>
                Bokmärken
              </>
            )}
          </NavLink>
        </div>
      </nav>

      {/* Main content area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <div className="flex-1 pb-20 md:pb-0">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </main>

      {/* Bottom nav — mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-white/5 flex items-center safe-bottom z-10">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-all',
                isActive
                  ? 'text-brand-400'
                  : 'text-gray-500',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className={clsx(
                  'text-lg transition-transform duration-200',
                  isActive && 'scale-110',
                )}>
                  {isActive ? item.activeIcon : item.icon}
                </span>
                {item.label}
                {isActive && (
                  <div className="absolute bottom-1 w-1 h-1 rounded-full bg-brand-400" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
