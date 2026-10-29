import { Component, computed, effect, signal } from '@angular/core';

// 1. Objectif quotidien
const DAILY_GOAL = 5;
const STORAGE_KEY = 'tasks';

@Component({
  selector: 'app-productivity-tracker',
  imports: [],
  templateUrl: './productivity-tracker.html',
  styleUrl: './productivity-tracker.css',
})
export class ProductivityTracker {
  readonly dailyGoal = DAILY_GOAL;

  // 1. L'état (signal) : valeur lue dans le localStorage, ou 0 par défaut
  completedTasks = signal<number>(Number(localStorage.getItem(STORAGE_KEY)) || 0);

  // 2. Les calculs (computed)
  progressPercentage = computed(() => Math.round((this.completedTasks() / DAILY_GOAL) * 100));

  message = computed(() => {
    const percent = this.progressPercentage();
    if (percent === 0) {
      return 'Prêt à démarrer la journée ?';
    }
    if (percent < 100) {
      return 'Continuez comme ça, vous y êtes presque !';
    }
    return 'Félicitations, objectif atteint ! 🚀';
  });

  isGoalReached = computed(() => this.completedTasks() >= DAILY_GOAL);

  constructor() {
    // 3. L'effet de bord : se relance à chaque modification de completedTasks
    effect(() => {
      const tasks = this.completedTasks();

      localStorage.setItem(STORAGE_KEY, String(tasks));
      console.log('Tracker : sauvegarde de', tasks, 'tâche(s)');

      if (tasks >= DAILY_GOAL) {
        window.alert('Bravo, vous avez fini votre journée !');
      }
    });
  }

  // 4. Actions des boutons
  addTask() {
    this.completedTasks.update(tasks => tasks + 1);
  }

  reset() {
    this.completedTasks.set(0);
  }
}
