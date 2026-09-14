import React from 'react';
import { IonContent, IonPage, IonButton } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Guidelines.scss';

const Guidelines: React.FC = () => {
  const navigate = useNavigate();

  const handleUnderstand = () => {
    navigate('/home', { replace: true });
  };

  return (
    <IonPage>
      <IonContent fullscreen className="guidelines-content">
        <motion.div 
          className="guidelines-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="logo-section">
            <h1 className="logo-text">STDIO</h1>
          </div>

          <div className="wave-section">
            <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="wave-svg">
              <path fill="none" stroke="#254b41" strokeWidth="6" d="M0,64L48,85.3C96,107,192,149,288,170.7C384,192,480,192,576,176C672,160,768,128,864,122.7C960,117,1056,139,1152,144C1248,149,1344,139,1392,133.3L1440,128"></path>
            </svg>
          </div>

          <div className="text-section">
            <p className="description">
              Por tu seguridad y la de los demás usuarios, te recomendamos que los encuentros y grupos de estudio sean en espacios públicos seguros y muy concurridos, como bibliotecas o universidades.
            </p>
            <p className="highlight-text">
              Sé siempre respetuoso y educado.
            </p>
          </div>

          <div className="button-section">
            <IonButton expand="block" className="understand-btn" onClick={handleUnderstand}>
              Entiendo :)
            </IonButton>
          </div>
        </motion.div>
      </IonContent>
    </IonPage>
  );
};

export default Guidelines;
