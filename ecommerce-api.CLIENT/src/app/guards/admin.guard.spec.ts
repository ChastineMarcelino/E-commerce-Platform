import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AdminGuard } from './admin.guard';

describe('AdminGuard', () => {
  let executeGuard: CanActivateFn;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
      ],
    });

    executeGuard = (guardParameter) => 
      TestBed.runInInjectionContext(() => TestBed.inject(AdminGuard).canActivate(guardParameter));
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
