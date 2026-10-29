import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', // Chemin vide : redirige vers la page d'accueil
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home').then(m => m.Home)
  },
  {
    path: 'catalog', // TP librairie + TP2 + TP Services
    loadComponent: () => import('./catalog/catalog').then(m => m.Catalog)
  },
  {
    path: 'sensor', // TP Simulateur de sonde thermique
    loadComponent: () => import('./sensor/sensor').then(m => m.Sensor)
  },
  {
    path: 'sensor-async', // TP Refactoring réactif avec l'AsyncPipe
    loadComponent: () => import('./sensor-async/sensor-async').then(m => m.SensorAsync)
  },
  {
    path: 'tracker', // TP Tracker de productivité (Signals)
    loadComponent: () => import('./productivity-tracker/productivity-tracker').then(m => m.ProductivityTracker)
  },
  {
    path: '**', // URL inconnue : retour à l'accueil
    redirectTo: 'home'
  }
];
