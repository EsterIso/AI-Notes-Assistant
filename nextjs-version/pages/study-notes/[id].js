import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import StudyNoteDetail from '../app/StudyNoteDetail';
import AppLayout from '../../components/layout/AppLayout';

export default function StudyNoteDetailPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/login');
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return null;

  return (
    <AppLayout>
      <StudyNoteDetail />
    </AppLayout>
  );
}
