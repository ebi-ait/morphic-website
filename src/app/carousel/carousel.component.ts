import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, OnDestroy {
  logos = ['../assets/external/logos/EMBL.png', '../assets/external/logos/Jackson.png', '../assets/external/logos/Miami.png'];
  logoTitles = ['EMBL', 'The Jakson Lab', 'University of Miami'];
  currentLogoIndex = 0;
  intervalId: any;

  ngOnInit(): void {
    this.startCarousel();
  }

  startCarousel(): void {
    this.intervalId = setInterval(() => {
      this.currentLogoIndex = (this.currentLogoIndex + 1) % this.logos.length;
    }, 2000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  selectLogo(index: number): void {
    this.currentLogoIndex = index;
  }
}
