import { TestBed } from '@angular/core/testing';

import { AddRequestService } from './add-request.service';

describe('AddRequestService', () => {
  let service: AddRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
