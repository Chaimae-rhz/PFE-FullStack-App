import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorisationInscComponent } from './authorisation-insc.component';

describe('AuthorisationInscComponent', () => {
  let component: AuthorisationInscComponent;
  let fixture: ComponentFixture<AuthorisationInscComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthorisationInscComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthorisationInscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
