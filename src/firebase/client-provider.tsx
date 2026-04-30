'use client';

import { ReactNode, useState, useEffect } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './index';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';

export function FirebaseClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [services, setServices] = useState<{
    firebaseApp: FirebaseApp;
    firestore: Firestore;
    auth: Auth;
  } | null>(null);

  useEffect(() => {
    // Inicialización segura solo en el cliente
    const instances = initializeFirebase();
    setServices(instances);
  }, []);

  return (
    <FirebaseProvider 
      firebaseApp={services?.firebaseApp ?? null} 
      firestore={services?.firestore ?? null} 
      auth={services?.auth ?? null}
    >
      {children}
    </FirebaseProvider>
  );
}
