import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-branding',
  imports: [],
  // a modifier
  // template: `
  //   <a href="/" class="logodark">
  //     <img
  //       src="./assets/images/logos/dark-logo.svg"
  //       class="align-middle m-2"
  //       alt="logo"
  //     />
  //   </a>
  // `,
  template: `
    <a href="/" class="logodark">
      <img
        src="./assets/images/logos/logo.png"
        class="align-middle m-2"
        alt="logo"
        style="height: 75px; width: auto;"
      />
    </a>
  `,
})
export class BrandingComponent {
  options = this.settings.getOptions();
  constructor(private settings: CoreService) { }
}
