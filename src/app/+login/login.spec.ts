import {
  inject
} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing/test_bed';

// Load the implementations that should be tested
import { Login } from './login.component';

describe('Login', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      Login
    ]}));

  it('user init', inject([ Login ], (login) => {
    expect(login.user).toEqual({ phone: '', rnd: '', pwd: '' });
  }));

});
