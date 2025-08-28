import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadRequestsComponent } from './load-requests.component';

describe('LoadRequestsComponent', () => {
  let component: LoadRequestsComponent;
  let fixture: ComponentFixture<LoadRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoadRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
