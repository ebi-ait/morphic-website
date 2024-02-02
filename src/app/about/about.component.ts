import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: "my-component, MyComponent",
  imports: [HeaderComponent, FooterComponent],
  styleUrls: ['./about.component.scss'],
  templateUrl: './about.component.html',
  standalone: true,
  host: { class: 'about-page' }
})
export class AboutComponent {
  ngOnInit(): void {
    //Todo: Find a better way to override styles
    const elm = document.querySelector<HTMLElement>('.backdrop')!;
    elm.style.height = '15.5rem';
    const elm1 = document.querySelector<HTMLElement>('.orange-circle')!;
    elm1.style.left = '70.25%';
    const elm2 = document.querySelector<HTMLElement>('.white-circle')!;
    elm2.style.left = '70.35%';
  }
}