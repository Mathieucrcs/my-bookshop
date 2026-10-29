import { Component, signal } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Observable, catchError, finalize, of } from 'rxjs';

const SEUIL_CRITIQUE = 50;
const NB_RELEVES = 5;

type Statut = 'En attente' | 'Connecté' | 'Erreur' | 'Terminé' | 'Arrêté';

@Component({
  selector: 'app-sensor-async',
  imports: [AsyncPipe, DecimalPipe],
  templateUrl: './sensor-async.html',
  styleUrl: '../sensor/sensor.css', // même apparence que la version 1
})
export class SensorAsync {
  readonly seuil = SEUIL_CRITIQUE;

  // L'Observable de base (identique au TP précédent)
  private sensor$ = new Observable<number>(observer => {
    let releves = 0;

    const intervalId = setInterval(() => {
      const temperature = Math.round(Math.random() * 600) / 10;

      if (temperature > SEUIL_CRITIQUE) {
        clearInterval(intervalId);
        observer.error(`Sonde en surchauffe (${temperature} °C)`);
        return;
      }

      observer.next(temperature);
      releves++;

      if (releves === NB_RELEVES) {
        clearInterval(intervalId);
        observer.complete();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  });

  // 1. Plus de ChangeDetectorRef, Subscription, ngOnDestroy, subscribe() ni unsubscribe().
  // Le type inclut null car catchError renvoie of(null).
  sensorData$: Observable<number | null> | null = null;

  // Le statut change dans catchError / finalize, en dehors de tout clic :
  // en application zoneless, un signal est le moyen le plus simple pour que la vue suive.
  status = signal<Statut>('En attente');
  errorMessage = signal('');

  // 2. Démarrer : on affecte le flux, l'AsyncPipe s'abonne tout seul
  startSensor() {
    this.status.set('Connecté');
    this.errorMessage.set('');

    this.sensorData$ = this.sensor$.pipe(
      catchError((err) => {
        this.status.set('Erreur');
        this.errorMessage.set(String(err));
        return of(null); // flux de secours : l'application ne plante pas
      }),
      finalize(() => {
        // Appelé à la fin du flux : succès, erreur ou désabonnement
        if (this.status() === 'Connecté') {
          this.status.set('Terminé');
        }
        console.log('Sonde (async) : flux terminé, statut =', this.status());
      })
    );
  }

  // 3. Arrêter : on "détruit" le flux, l'AsyncPipe se désabonne tout seul
  stopSensor() {
    this.status.set('Arrêté');
    this.sensorData$ = null;
  }
}
