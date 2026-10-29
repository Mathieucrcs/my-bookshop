import { Injectable } from '@angular/core';
import { BookModel } from '../models/book.model';

// Couverture Open Library à partir de l'ISBN (renvoie une erreur 404 si absente)
const cover = (isbn: string) => `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;

// En Angular 22, on écrirait simplement @Service() (même effet).
// Le projet est en Angular 21 : on utilise donc l'écriture classique.
@Injectable({
  providedIn: 'root',
})
export class Book {
  // Les données sont maintenant stockées dans le service (singleton partagé)
  private books: BookModel[] = [
    { id: 'LIB-0001', title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry', price: 7.9, image: cover('9782070612758'), quantity: 5 },
    { id: 'LIB-0002', title: "L'Étranger", author: 'Albert Camus', price: 6.5, image: cover('9782070360024'), quantity: 2 },
    { id: 'LIB-0003', title: '1984', author: 'George Orwell', price: 9.4, image: cover('9780451524935'), quantity: 0 },
    { id: 'LIB-0004', title: 'Dune', author: 'Frank Herbert', price: 12.9, image: cover('9780441172719'), quantity: 3 },
    { id: 'LIB-0005', title: 'Bilbo le Hobbit', author: 'J.R.R. Tolkien', price: 8.7, image: cover('9780547928227'), quantity: 0 },
    { id: 'LIB-0006', title: 'Orgueil et Préjugés', author: 'Jane Austen', price: 5.9, image: cover('9780141439518'), quantity: 1 },
  ];

  hello() {
    console.log('Hello from Book service');
  }

  getBooks(): BookModel[] {
    return this.books;
  }
}
