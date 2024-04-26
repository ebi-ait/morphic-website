import { Component, Input } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: { class: 'header-comp' }
})
export class HeaderComponent {
  gene_list_url: string = ' '
  constructor() {
    if(environment.gene_list_url) {
      this.gene_list_url = environment.gene_list_url;
    }
  }
}
