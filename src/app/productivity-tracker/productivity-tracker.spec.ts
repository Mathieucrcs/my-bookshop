import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { ProductivityTracker } from './productivity-tracker';

describe('ProductivityTracker', () => {
  let component: ProductivityTracker;
  let fixture: ComponentFixture<ProductivityTracker>;
  let alertSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    localStorage.clear();
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    await TestBed.configureTestingModule({
      imports: [ProductivityTracker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductivityTracker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => vi.restoreAllMocks());

  it('should start at 0 with the starting message', () => {
    expect(component.completedTasks()).toBe(0);
    expect(component.progressPercentage()).toBe(0);
    expect(component.message()).toBe('Prêt à démarrer la journée ?');
  });

  it('should compute 40 % after 2 tasks and save it', async () => {
    component.addTask();
    component.addTask();
    await fixture.whenStable();
    expect(component.progressPercentage()).toBe(40);
    expect(component.message()).toBe('Continuez comme ça, vous y êtes presque !');
    expect(localStorage.getItem('tasks')).toBe('2');
  });

  it('should alert when the goal is reached', async () => {
    for (let i = 0; i < 5; i++) component.addTask();
    await fixture.whenStable();
    expect(component.isGoalReached()).toBe(true);
    expect(component.message()).toContain('objectif atteint');
    expect(alertSpy).toHaveBeenCalledWith('Bravo, vous avez fini votre journée !');
  });

  it('should reset to 0', async () => {
    component.addTask();
    component.reset();
    await fixture.whenStable();
    expect(component.completedTasks()).toBe(0);
    expect(localStorage.getItem('tasks')).toBe('0');
  });
});
