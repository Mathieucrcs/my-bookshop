import { TestBed } from '@angular/core/testing';

import { Book } from './book';

describe('Book', () => {
  let service: Book;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Book);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the list of books', () => {
    expect(service.getBooks().length).toBe(6);
  });

  it('should be a singleton (same instance everywhere)', () => {
    expect(TestBed.inject(Book)).toBe(service);
  });
});
