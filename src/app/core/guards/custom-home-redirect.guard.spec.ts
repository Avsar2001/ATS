import { TestBed } from '@angular/core/testing';

import { CustomHomeRedirectGuard } from './custom-home-redirect.guard';

describe('CustomHomeRedirectGuard', () => {
  let guard: CustomHomeRedirectGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomHomeRedirectGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
