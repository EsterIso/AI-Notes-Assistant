import { SignIn } from '@clerk/nextjs';
import PublicHeader from '../../components/layout/PublicHeader';

export default function Login() {
  return (
    <div className="login-page-container">
      <PublicHeader />
      <div className="content-area">
        <SignIn path="/login" routing="path" signUpUrl="/signup" />
      </div>
    </div>
  );
}
