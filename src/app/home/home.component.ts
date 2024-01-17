import { Component } from '@angular/core'
import { Title } from '@angular/platform-browser'

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  raw9tgq: string = ' '
  rawhipw: string = ' '
  constructor(private title: Title) {
    this.title.setTitle('exported project')
  }
}
