import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { Sensor } from './sensor';

describe('Sensor', () => {
  let component: Sensor;
  let fixture: ComponentFixture<Sensor>;

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [Sensor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sensor);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.status).toBe('En attente');
  });

  it('should complete after 5 valid readings', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5); // 30 °C
    component.start();
    expect(component.status).toBe('Connecté');
    vi.advanceTimersByTime(5000);
    expect(component.releves).toBe(5);
    expect(component.temperature).toBe(30);
    expect(component.status).toBe('Terminé');
  });

  it('should go to error when temperature exceeds 50 °C', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9); // 54 °C
    component.start();
    vi.advanceTimersByTime(1000);
    expect(component.status).toBe('Erreur');
    expect(component.errorMessage).toContain('Sonde en surchauffe');
  });

  it('should stop listening on manual stop', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    component.start();
    vi.advanceTimersByTime(2000);
    component.stop();
    vi.advanceTimersByTime(5000);
    expect(component.releves).toBe(2);
    expect(component.status).toBe('Arrêté');
  });
});
