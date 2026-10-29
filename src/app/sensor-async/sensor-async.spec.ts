import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { SensorAsync } from './sensor-async';

describe('SensorAsync', () => {
  let component: SensorAsync;
  let fixture: ComponentFixture<SensorAsync>;

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [SensorAsync]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SensorAsync);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.sensorData$).toBeNull();
  });

  it('should set status to Terminé when the flow completes (finalize)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    component.startSensor();
    const values: (number | null)[] = [];
    component.sensorData$!.subscribe(v => values.push(v));
    vi.advanceTimersByTime(5000);
    expect(values).toEqual([30, 30, 30, 30, 30]);
    expect(component.status()).toBe('Terminé');
  });

  it('should catch the overheating error and emit null (catchError)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9);
    component.startSensor();
    const values: (number | null)[] = [];
    component.sensorData$!.subscribe(v => values.push(v));
    vi.advanceTimersByTime(1000);
    expect(values).toEqual([null]);
    expect(component.status()).toBe('Erreur');
  });

  it('should reset the flow on stop', () => {
    component.startSensor();
    component.stopSensor();
    expect(component.sensorData$).toBeNull();
    expect(component.status()).toBe('Arrêté');
  });
});
