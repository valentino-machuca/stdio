import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonInput,
  IonCheckbox,
  IonButton,
  IonIcon,
  IonToast,
} from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Auth.scss';
import { SpiralLoader } from '../../components/ui/spiral-loader';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isTeacher, setIsTeacher] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const endpoint = isLogin ? 'http://localhost:3000/api/auth/login' : 'http://localhost:3000/api/auth/register';
      const payload = isLogin ? { identifier: email || username, password } : { email, username, password, name: username, is_teacher: isTeacher };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setIsLoading(false);
        if (isLogin) {
          navigate('/home', { replace: true });
        } else {
          navigate('/complete-profile', { replace: true });
        }
      } else {
        setIsLoading(false);
        setToastMessage(data.message || 'Error en la solicitud');
      }
    } catch (error) {
      console.log('Server connection error:', error);
      setIsLoading(false);
      setToastMessage('El servicio no se encuentra disponible en este momento :(');
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="auth-container">
          
          <div className="header-bkg-section">
            <div className="header-section">
              <h2 className="welcome-text">welcome to</h2>
              <h1 className="logo-text">STDIO</h1>
            </div>
          </div>
          
          <div className="form-section">
            <div className="form-header">
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, x: 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <IonIcon icon={chevronBackOutline} className="back-button" onClick={() => setIsLogin(!isLogin)}/> 
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.span 
                layout
                className="auth-title" 
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isLogin ? 'login' : 'signup'}
                  >
                    {isLogin ? 'LOG IN' : 'SIGN UP'}
                  </motion.span>
                </AnimatePresence>
              </motion.span>
            </div>

            <motion.div layout className="input-group">
              <label className="input-label">{isLogin ? 'Username' : 'Email'}</label>
              <IonInput 
                className="custom-input" 
                placeholder={isLogin ? 'your username...' : 'example@example.com'} 
                type={isLogin ? 'text' : 'email'}
                value={email}
                onIonChange={e => setEmail(e.detail.value!)}
              />
            </motion.div>

            <AnimatePresence>
              {!isLogin && (
                <motion.div 
                  className="input-group"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <label className="input-label">Username</label>
                  <IonInput  
                    className="custom-input" 
                    placeholder="your username..." 
                    type="text"
                    value={username}
                    onIonChange={e => setUsername(e.detail.value!)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div layout className="input-group">
              <label className="input-label">Password</label>
              <IonInput 
                className="custom-input" 
                placeholder="your password..." 
                type="password"
                value={password}
                onIonChange={e => setPassword(e.detail.value!)}
              />
            </motion.div>

            <AnimatePresence>
              {!isLogin && (
                <motion.div 
                  className="checkbox-group"
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <IonCheckbox 
                    className="custom-checkbox" 
                    checked={isTeacher}
                    onIonChange={e => setIsTeacher(e.detail.checked)}
                  />
                  <span className="checkbox-label">i want teach :)</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ marginTop: 'auto' }}>
              <motion.div layout>
                <IonButton expand="block" className="primary-btn" onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? <SpiralLoader isDark={true} /> : isLogin ? 'Log in' : 'Register'}
                </IonButton>
              </motion.div>

              {/* <motion.div layout>
                <IonButton expand="block" className="google-btn" disabled>
                  Continue with 
                  <span className="google-logo">
                    <span className="google-g">G</span>
                    <span className="google-o1">o</span>
                    <span className="google-o2">o</span>
                    <span className="google-g2">g</span>
                    <span className="google-l">l</span>
                    <span className="google-e">e</span>
                  </span>
                </IonButton>
              </motion.div> */}

              <motion.div layout className="login-link-container" style={{ marginTop: '20px' }}>
                <span className="login-text">
                  {isLogin ? 'Don\'t have an account? ' : 'Already have an account? '}
                </span>
                <span className="login-link" onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer' }}>
                  {isLogin ? 'Sign up' : 'Log in'}
                </span>
              </motion.div>
            </div>
          </div>
          
          <IonToast
            isOpen={!!toastMessage}
            message={toastMessage}
            position='top'
            duration={3000}
            onDidDismiss={() => setToastMessage('')}
            color={'danger'}
          />

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Auth;
