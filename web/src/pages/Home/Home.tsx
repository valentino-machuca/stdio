import React from 'react';
import { IonContent, IonPage, IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { personOutline, mapOutline, compassOutline, menuOutline } from 'ionicons/icons';
import { motion } from 'framer-motion';
import MapComponent from './MapComponent';
import './Home.css';

const Home: React.FC = () => {

  const handleLocationUpdate = async (latitude: number, longitude: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await fetch('http://localhost:3000/api/users/location', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ latitude, longitude })
      });
    } catch (error) {
      console.error('Error updating location in backend:', error);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="home-container">
        <div className="map-container">
          <MapComponent onLocationUpdate={handleLocationUpdate} />
        </div>

        {/* Overlay Buttons disabled for now, animated with framer-motion */}
        <div className="overlay-buttons">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <IonFab vertical="top" horizontal="start" slot="fixed" style={{ marginTop: '40px', marginLeft: '10px' }}>
              <IonFabButton disabled={true} color="light">
                <IonIcon icon={menuOutline} />
              </IonFabButton>
            </IonFab>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <IonFab vertical="top" horizontal="end" slot="fixed" style={{ marginTop: '40px', marginRight: '10px' }}>
              <IonFabButton disabled={true} color="light">
                <IonIcon icon={personOutline} />
              </IonFabButton>
            </IonFab>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <IonFab vertical="bottom" horizontal="end" slot="fixed" style={{ marginBottom: '40px', marginRight: '10px' }}>
              <IonFabButton disabled={true} color="primary">
                <IonIcon icon={compassOutline} />
              </IonFabButton>
            </IonFab>
          </motion.div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
