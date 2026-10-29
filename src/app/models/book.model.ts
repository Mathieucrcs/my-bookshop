// Forme d'un livre (le nom "Book" est déjà pris par le service)
export interface BookModel {
  id: string;
  title: string;
  author: string;
  price: number;
  image: string;
  quantity: number;
  showDetails?: boolean;
}
