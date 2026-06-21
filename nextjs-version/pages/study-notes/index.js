import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import StudyNotes from '../app/StudyNotes';
import AppLayout from '../../components/layout/AppLayout';

export default function StudyNotesPage() {
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
      <StudyNotes />
    </AppLayout>
  );
}