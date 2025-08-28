import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnelRequestsComponent } from './personnel-requests.component';

describe('PersonnelRequestsComponent', () => {
  let component: PersonnelRequestsComponent;
  let fixture: ComponentFixture<PersonnelRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonnelRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonnelRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
