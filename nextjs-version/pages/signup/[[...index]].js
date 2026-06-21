import { SignUp } from '@clerk/nextjs';
import PublicHeader from '../../components/layout/PublicHeader';

export default function Signup() {
  return (
    <div className="login-page-container">
      <PublicHeader />
      <div className="content-area">
        <SignUp path="/signup" routing="path" signInUrl="/login" />
      </div>
    </div>
  );
}
