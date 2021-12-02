import { TestBed } from '@angular/core/testing';

import { EvaluationMarkersService } from './evaluation-markers.service';

describe('EvaluationMarkersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EvaluationMarkersService = TestBed.get(EvaluationMarkersService);
    expect(service).toBeTruthy();
  });
});
