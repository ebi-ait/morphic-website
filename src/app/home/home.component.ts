import { Component } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { environment } from '../../environments/environment';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {
  gene_list_url: string = ' '
  constructor() {
    if(environment.gene_list_url) {
      this.gene_list_url = environment.gene_list_url;
    }
  }
}
