import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';


import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: "AIzaSyAeAXd0kLhv3vBbtRK8uvRGwlxIMkaa8GM",
        authDomain: "vezzeta-3f5f9.firebaseapp.com",
        projectId: "vezzeta-3f5f9",
       storageBucket: "vezzeta-3f5f9.appspot.com",
       messagingSenderId: "236970156041",
       appId: "1:236970156041:web:75fd405482371334dd18d8"
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()), provideAnimationsAsync(),
  ],
};