import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  gene_list_url: string = ' '
  constructor() {
    if(environment.gene_list_url) {
      this.gene_list_url = environment.gene_list_url;
    }
  }

}
