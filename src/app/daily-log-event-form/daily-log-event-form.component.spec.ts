import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyLogEventFormComponent } from './daily-log-event-form.component';

describe('DailyLogEventFormComponent', () => {
  let component: DailyLogEventFormComponent;
  let fixture: ComponentFixture<DailyLogEventFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyLogEventFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyLogEventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
