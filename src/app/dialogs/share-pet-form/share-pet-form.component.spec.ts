import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharePetFormComponent } from './share-pet-form.component';

describe('SharePetFormComponent', () => {
  let component: SharePetFormComponent;
  let fixture: ComponentFixture<SharePetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharePetFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharePetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
