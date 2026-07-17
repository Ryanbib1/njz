// {"router": "/", "id": "f01", "en_name": "Home"}
'use client';

import { useHome } from '@/frontend/hooks/useHome';
import HomeView from '@/frontend/components/HomeView';
export default function HomePage() {
  const {
    state,
    handlers
  } = useHome();
  return <HomeView state={state} handlers={handlers} />;
}
