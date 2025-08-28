import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormReinitialisationComponent } from './form-reinitialisation.component';

describe('FormReinitialisationComponent', () => {
  let component: FormReinitialisationComponent;
  let fixture: ComponentFixture<FormReinitialisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormReinitialisationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormReinitialisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
