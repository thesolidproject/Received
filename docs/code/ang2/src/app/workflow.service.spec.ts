import { TestBed, inject } from '@angular/core/testing';

import { WorkflowService } from './workflow.service';

describe('WorkflowService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkflowService]
    });
  });

  it('should ...', inject([WorkflowService], (service: WorkflowService) => {
    expect(service).toBeTruthy();
  }));
});
