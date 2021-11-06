import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOutFormComponent } from './add-out-form.component';

describe('AddOutFormComponent', () => {
  let component: AddOutFormComponent;
  let fixture: ComponentFixture<AddOutFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOutFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOutFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
