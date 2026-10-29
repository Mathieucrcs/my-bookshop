import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Book } from '../services/book';
import { BookModel } from '../models/book.model';

@Component({
  selector: 'app-catalog',
  imports: [CurrencyPipe],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {
  // TP Services : on injecte le service (méthode inject)
  private bookService: Book = inject(Book);

  // Les données viennent maintenant du service
  books: BookModel[] = this.bookService.getBooks();

  constructor() {
    console.log('Catalog component initialized');
    this.bookService.hello();
  }

  // TP2 - Étape 3 : filtre ('all' | 'inStock' | 'outOfStock')
  filterStock: string = 'all';

  // TP2 - Étape 2 : "en stock" est maintenant calculé à partir de la quantité
  isInStock(book: BookModel): boolean {
    return book.quantity > 0;
  }

  // TP2 - Étape 2 : méthodes de gestion du stock
  incrementStock(book: BookModel) {
    book.quantity++;
  }

  decrementStock(book: BookModel) {
    if (book.quantity > 0) {
      book.quantity--;
    }
  }

  // TP2 - Étape 1 : afficher / masquer les détails d'un livre
  toggleDetails(book: BookModel) {
    book.showDetails = !book.showDetails;
  }

  // TP2 - Étape 3 : liste filtrée utilisée par le @for
  getFilteredBooks(): BookModel[] {
    if (this.filterStock === 'inStock') {
      return this.books.filter(book => this.isInStock(book));
    }
    if (this.filterStock === 'outOfStock') {
      return this.books.filter(book => !this.isInStock(book));
    }
    return this.books;
  }

  buyBook(book: BookModel) {
    alert(`Vous avez acheté : ${book.title}`);
  }

  // Si la couverture ne charge pas, on affiche un placeholder
  onImageError(event: Event, book: BookModel) {
    const img = event.target as HTMLImageElement;
    img.src = `https://placehold.co/300x450/2b2118/f5efe6?text=${encodeURIComponent(book.title)}`;
  }
}
