import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import React from 'react';
import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Survey from './components/Survey';
import Feedback from './components/Feedback';
import Footer from './components/Footer';
import Survey1 from './SurveyTest/Survey1';
import Survey2 from './SurveyTest/Survey2';
import Login from './Auth/Login';
import SignUp from './Auth/SignUp';
import ForgotPassword from './Auth/ForgotPassword';
import PasswordReset from './Auth/PasswordReset';
import ConfirmMagicLink from './Auth/ConfirmMagicLink';
import ResultRecord from './SurveyTest/ResultRecord';
import ResultTest from './SurveyTest/ResultTest';

class AppWithErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in App:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F0F8FF] px-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-2xl font-bold text-center text-black mb-4">Error</h2>
            <p className="text-center text-red-500">Something went wrong: {this.state.error?.message}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-100">
        <App />
      </div>
    );
  }
}

function App() {
  const location = useLocation();
  const hideHeaderFooter =
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/reset-password' ||
    location.pathname === '/confirm-magic-link' ||
    location.pathname === '/survey1' ||
    location.pathname === '/survey2' ||
    location.pathname === '/ResultTest';

  console.log('Current route:', location.pathname);

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <main>
                <section id="home"><Home /></section>
                <section id="about"><About /></section>
                <section id="survey"><Survey /></section>
                <section id="feedback"><Feedback /></section>
              </main>
              {!hideHeaderFooter && <Footer />}
            </>
          }
        />
        <Route
          path="/ResultRecord1"
          element={<ResultRecord />}
        />
        <Route path="/survey1" element={<Survey1 />} />
        <Route path="/survey2" element={<Survey2 />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/confirm-magic-link" element={<ConfirmMagicLink />} />
        <Route path="/ResultTest" element={<ResultTest />} />
      </Routes>
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <AppWithErrorBoundary />
    </Router>
  );
}