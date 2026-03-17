import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import Layout from './Layout';

const HomePage = lazy(() => import('@/pages/HomePage'));
const StudyPage = lazy(() => import('@/pages/StudyPage'));
const QuizPage = lazy(() => import('@/pages/QuizPage'));
const QuizResultPage = lazy(() => import('@/pages/QuizResultPage'));
const StatsPage = lazy(() => import('@/pages/StatsPage'));
const SignsPage = lazy(() => import('@/pages/SignsPage'));
const BookmarksPage = lazy(() => import('@/pages/BookmarksPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/study', element: <StudyPage /> },
      { path: '/study/:category', element: <StudyPage /> },
      { path: '/quiz', element: <QuizPage /> },
      { path: '/quiz/:id/result', element: <QuizResultPage /> },
      { path: '/stats', element: <StatsPage /> },
      { path: '/signs', element: <SignsPage /> },
      { path: '/signs/:categoryId', element: <SignsPage /> },
      { path: '/signs/:categoryId/:signId', element: <SignsPage /> },
      { path: '/bookmarks', element: <BookmarksPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
