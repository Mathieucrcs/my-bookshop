import { ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable, Subscription } from 'rxjs';

const SEUIL_CRITIQUE = 50; // °C : au-delà, la sonde "crashe"
const NB_RELEVES = 5;      // nombre de relevés valides avant la fin du cycle

@Component({
  selector: 'app-sensor',
  imports: [DecimalPipe],
  templateUrl: './sensor.html',
  styleUrl: './sensor.css',
})
export class Sensor implements OnDestroy {
  // Application zoneless : un setInterval ne rafraîchit pas la vue tout seul,
  // on doit prévenir Angular à la main avec ChangeDetectorRef (voir TP suivant)
  private cdr = inject(ChangeDetectorRef);

  readonly seuil = SEUIL_CRITIQUE;
  readonly nbReleves = NB_RELEVES;

  // 1. Création de l'Observable "de toutes pièces"
  sensor$ = new Observable<number>(observer => {
    let releves = 0;

    const intervalId = setInterval(() => {
      // Température aléatoire entre 0 et 60 °C (1 décimale)
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

    // Fonction de nettoyage : appelée par .unsubscribe() (sinon l'intervalle continuerait)
    return () => {
      clearInterval(intervalId);
      console.log('Sonde : intervalle coupé');
    };
  });

  // 2. État du composant (variables classiques)
  temperature: number | null = null;
  status: 'En attente' | 'Connecté' | 'Erreur' | 'Terminé' | 'Arrêté' = 'En attente';
  errorMessage = '';
  releves = 0;
  private subscription?: Subscription;

  get isRunning(): boolean {
    return this.status === 'Connecté';
  }

  // 3. Bouton "Démarrer" : abonnement avec un Observer complet
  start() {
    if (this.isRunning) {
      return;
    }

    this.temperature = null;
    this.errorMessage = '';
    this.releves = 0;
    this.status = 'Connecté';

    this.subscription = this.sensor$.subscribe({
      next: (temperature) => {
        this.temperature = temperature;
        this.releves++;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.status = 'Erreur';
        this.errorMessage = String(err);
        this.cdr.markForCheck();
      },
      complete: () => {
        this.status = 'Terminé';
        this.cdr.markForCheck();
      },
    });
  }

  // 3. Bouton "Arrêter l'urgence" : désabonnement manuel
  stop() {
    this.subscription?.unsubscribe();
    if (this.isRunning) {
      this.status = 'Arrêté';
    }
  }

  // 4. Sécurité : on coupe l'écoute si l'utilisateur quitte la page
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
