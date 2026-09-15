import React, { useState, useEffect, useRef } from 'react';
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonToast
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './CompleteProfile.scss';
import { SpiralLoader } from '../../components/ui/spiral-loader';

interface MetadataItem {
  id: string;
  name: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://stdio.onrender.com/api';

const CompleteProfile: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState('');
  const [institutionId, setInstitutionId] = useState('');
  const [careerId, setCareerId] = useState('');
  
  const [institutions, setInstitutions] = useState<MetadataItem[]>([]);
  const [careers, setCareers] = useState<MetadataItem[]>([]);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    // Fetch institutions and careers from backend
    const fetchMetadata = async () => {
      try {
        const res = await fetch(`${API_URL}/users/metadata`);
        if (res.ok) {
          const data = await res.json();
          setInstitutions(data.institutions);
          setCareers(data.careers);
        }
      } catch (error) {
        console.error('Failed to fetch metadata', error);
      }
    };
    fetchMetadata();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setToastMessage('Por favor sube una foto de perfil');
      return;
    }
    if (!name) {
      setToastMessage('Por favor ingresa tu nombre');
      return;
    }
    if (!institutionId) {
      setToastMessage('Por favor selecciona tu universidad');
      return;
    }
    if (!careerId) {
      setToastMessage('Por favor selecciona tu carrera');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setToastMessage('No hay sesión activa. Por favor, inicia sesión.');
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('name', name);
      formData.append('institution_id', institutionId);
      formData.append('career_id', careerId);
      formData.append('profile_picture', selectedFile);

      const res = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/guidelines', { replace: true });
      } else {
        setToastMessage(data.message || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error updating profile', error);
      setToastMessage('Error conectando con el servidor');
    }
    setIsLoading(false);
  };

  return (
    <IonPage>
      <IonContent fullscreen className="complete-profile-content">
        <motion.div 
          className="profile-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="profile-header">
            <h1 className="title">Completar Perfil</h1>
          </div>

          <div className="avatar-section">
            <div className="avatar-preview" onClick={triggerFileInput}>
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" />
              ) : (
                <div className="avatar-placeholder">
                  <span>+</span>
                </div>
              )}
            </div>
            <p className="avatar-hint">Toca para subir tu foto *</p>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileChange} 
            />
          </div>

          <div className="form-section">
            <div className="input-group">
              <label className="input-label">Nombre Completo *</label>
              <IonInput 
                className="custom-input" 
                placeholder="Ej. Juan Pérez" 
                type="text"
                value={name}
                onIonChange={e => setName(e.detail.value!)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Universidad *</label>
              <IonSelect 
                className="custom-select"
                placeholder="Selecciona tu universidad"
                value={institutionId}
                onIonChange={e => setInstitutionId(e.detail.value)}
              >
                {institutions.map(inst => (
                  <IonSelectOption key={inst.id} value={inst.id}>{inst.name}</IonSelectOption>
                ))}
              </IonSelect>
            </div>

            <div className="input-group">
              <label className="input-label">Carrera *</label>
              <IonSelect 
                className="custom-select"
                placeholder="Selecciona tu carrera"
                value={careerId}
                onIonChange={e => setCareerId(e.detail.value)}
              >
                {careers.map(car => (
                  <IonSelectOption key={car.id} value={car.id}>{car.name}</IonSelectOption>
                ))}
              </IonSelect>
            </div>

            <IonButton expand="block" className="primary-btn" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? <SpiralLoader isDark={true} /> : 'Siguiente'}
            </IonButton>
            
          </div>
        </motion.div>
        
        <IonToast
          isOpen={!!toastMessage}
          message={toastMessage}
          duration={3000}
          onDidDismiss={() => setToastMessage('')}
          color="danger"
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default CompleteProfile;
