import { TestBed } from '@angular/core/testing';

import { CreterionService } from './creterion.service';

describe('CreterionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreterionService = TestBed.get(CreterionService);
    expect(service).toBeTruthy();
  });
});
