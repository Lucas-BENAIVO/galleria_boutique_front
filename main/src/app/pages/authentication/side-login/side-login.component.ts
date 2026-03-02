import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-side-login',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './side-login.component.html',
  styleUrls: ['./side-login.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppSideLoginComponent {
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';
  rememberMe = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  submit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Vérifier que c'est bien un admin boutique ou manager
        if (response.user.role === 'MANAGER' || response.user.role === 'ADMIN_BOUTIQUE' || response.user.role === 'VENDEUR' || response.user.role === 'ADMIN') {
          this.router.navigate(['/boutique/dashboard']);
        } else {
          this.errorMessage = 'Accès réservé aux administrateurs de boutique';
          this.authService.logout();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Email ou mot de passe incorrect';
        console.error('Login error:', err);
      }
    });
  }
}
