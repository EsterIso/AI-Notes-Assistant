import { ClerkProvider } from '@clerk/nextjs';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/App.css';
import '../styles/index.css';
import '../styles/Dashboard.css';
import '../styles/Header.css';
import '../styles/HomePage.css';
import '../styles/LoginPage.css';
import '../styles/Sidebar.css';
import '../styles/Settings.css';

const clerkAppearance = {
  variables: {
    colorPrimary: '#40798c',
    colorBackground: '#ffffff',
    colorText: '#0b2027',
    colorTextSecondary: 'rgba(11, 32, 39, 0.7)',
    colorInputBackground: '#ffffff',
    colorInputText: '#0b2027',
    borderRadius: '1.5rem',
  },
};

export default function MyApp({ Component, pageProps }) {
  return (
    <ClerkProvider appearance={clerkAppearance} afterSignOutUrl="/">
      <Component {...pageProps} />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        className="custom-toast-container"
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
        progressClassName="custom-toast-progress"
      />
    </ClerkProvider>
  );
}