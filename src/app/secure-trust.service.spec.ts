import { TestBed } from '@angular/core/testing';

import { SecureTrustService } from './secure-trust.service';

describe('SecureTrustService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SecureTrustService = TestBed.get(SecureTrustService);
    expect(service).toBeTruthy();
  });
});
