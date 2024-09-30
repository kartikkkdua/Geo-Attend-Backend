import React, { createContext, useContext, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

const ModelLoadingContext = createContext();

export const useModelLoading = () => {
  return useContext(ModelLoadingContext);
};

export const ModelLoadingProvider = ({ children }) => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState('');

  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoadingError('Loading models. Please wait...');
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
        setModelsLoaded(true);
        setLoadingError('');
      } catch (error) {
        setLoadingError('Failed to load models: ' + error.message);
      }
    };

    loadModels();
  }, []);

  return (
    <ModelLoadingContext.Provider value={{ modelsLoaded, loadingError }}>
      {children}
    </ModelLoadingContext.Provider>
  );
};
