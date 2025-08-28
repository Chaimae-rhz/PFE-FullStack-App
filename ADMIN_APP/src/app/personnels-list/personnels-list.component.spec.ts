import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnelsListComponent } from './personnels-list.component';

describe('PersonnelsListComponent', () => {
  let component: PersonnelsListComponent;
  let fixture: ComponentFixture<PersonnelsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonnelsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonnelsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
