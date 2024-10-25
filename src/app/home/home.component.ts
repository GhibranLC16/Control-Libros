import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BookService } from '../services/book.service';
import { Book } from '../models/book';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, CardModule, RouterModule, ToastModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  books: Book[] = []; // Lista de libros
  isDeleteInProgress: boolean = false; // Estado de eliminación

  constructor(
    private bookService: BookService, 
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getAllBooks(); // Cargar todos los libros al iniciar
  }

  // Obtener todos los libros
  getAllBooks() {
    this.bookService.getBooks().subscribe((data) => {
      this.books = data; // Asignar la lista de libros obtenida
      console.log('Libros obtenidos:', this.books); // Mostrar libros en la consola
    });
  }

  // Eliminar un libro por ID
  deleteBook(id: number) {
    this.isDeleteInProgress = true; // Iniciar la eliminación
    this.bookService.deleteBook(id).subscribe({
      next: () => {
        // Mensaje de éxito si la eliminación fue exitosa
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Libro eliminado correctamente',
        });
        this.isDeleteInProgress = false; // Reiniciar el estado de eliminación
        this.getAllBooks(); // Actualizar la lista de libros
      },
      error: (err) => {
        // Mostrar el error en la consola si ocurre
        console.error(`Error al eliminar el libro con ID: ${id}`, err);
        this.isDeleteInProgress = false; // Reiniciar el estado en caso de error
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo borrar el libro',
        });
      },
    });
  }
}
