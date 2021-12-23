import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareInvitesComponent } from './share-invites.component';

describe('ShareInvitesComponent', () => {
  let component: ShareInvitesComponent;
  let fixture: ComponentFixture<ShareInvitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareInvitesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareInvitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
