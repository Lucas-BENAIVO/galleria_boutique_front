import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';


import { CommonModule } from '@angular/common';  // <-- importer CommonModule pour *ngIf/*ngFor

@Component({
  selector: 'app-user-list',
  standalone: true, // <-- important si c'est standalone
  imports: [CommonModule], // <-- ici on ajoute CommonModule
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {

  users: User[] = []; // ici on stocke les users

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Appel du service
    this.userService.getUsers().subscribe({
      next: (data: User[]) => {
        this.users = data; // on remplit le tableau
      },
      error: (err: Error) => {
        console.error('Erreur API:', err);
      }
    });
  }
}
