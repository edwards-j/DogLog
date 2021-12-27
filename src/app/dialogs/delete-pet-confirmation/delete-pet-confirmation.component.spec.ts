import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePetConfirmationComponent } from './delete-pet-confirmation.component';

describe('DeletePetConfirmationComponent', () => {
  let component: DeletePetConfirmationComponent;
  let fixture: ComponentFixture<DeletePetConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletePetConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePetConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
