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

      const API_URL = import.meta.env.VITE_API_URL || 'https://stdio.onrender.com/api';
      await fetch(`${API_URL}/users/location`, {
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
      </IonContent>
    </IonPage>
  );
};

export default Home;
