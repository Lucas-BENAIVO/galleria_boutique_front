import { Component } from '@angular/core';
import { ProfileCardComponent } from '../../../components/boutique/profile-card/profile-card.component';
import { SidebarComponent } from '../../../components/boutique/sidebar/sidebar.component';
import { BoutiqueNavbarComponent } from '../../../components/boutique/boutique-navbar/boutique-navbar.component';
import { FooterComponent } from '../../../components/boutique/footer/footer.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [ProfileCardComponent, SidebarComponent, BoutiqueNavbarComponent, FooterComponent],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePageComponent {}
