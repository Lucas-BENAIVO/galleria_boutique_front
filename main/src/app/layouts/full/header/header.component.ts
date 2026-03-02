import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';

import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AppSettings } from 'src/app/config';
import { AuthService } from 'src/app/services/auth.service';
import { BoutiqueService, Boutique } from 'src/app/services/boutique.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule,
    CommonModule
  ],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
  showFiller = false;
  @Output() optionsChange = new EventEmitter<AppSettings>();

  boutiqueName: string = '';

  constructor(private authService: AuthService, private boutiqueService: BoutiqueService) {}

  ngOnInit() {
    const boutiqueId = this.authService.getBoutiqueId();
    if (boutiqueId) {
      this.boutiqueService.getBoutiqueById(boutiqueId).subscribe({
        next: (res) => {
          this.boutiqueName = res.data?.name || '';
        },
        error: () => {
          this.boutiqueName = '';
        }
      });
    }
  }
}