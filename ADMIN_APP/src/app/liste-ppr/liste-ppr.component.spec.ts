import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListePPRComponent } from './liste-ppr.component';

describe('ListePPRComponent', () => {
  let component: ListePPRComponent;
  let fixture: ComponentFixture<ListePPRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListePPRComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListePPRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
