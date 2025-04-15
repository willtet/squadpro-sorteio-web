import { TestBed } from '@angular/core/testing';

import { SorteioApiService } from './sorteio-api.service';

describe('SorteioApiService', () => {
  let service: SorteioApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SorteioApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
