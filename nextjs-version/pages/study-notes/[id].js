import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import StudyNoteDetail from '../app/StudyNoteDetail';
import AppLayout from '../../components/layout/AppLayout';

export default function StudyNoteDetailPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return (
    <AppLayout>
      <StudyNoteDetail />
    </AppLayout>
  );
}
