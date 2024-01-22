import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, OnDestroy {
  logos = ['../assets/external/logos/Fred-Hutch.png', '../assets/external/logos/Jackson.png', '../assets/external/logos/MSK.png','../assets/external/logos/Northwestern.png','../assets/external/logos/Stanford.png', '../assets/external/logos/UCSF.png', '../assets/external/logos/Washington.png'];
  logoTitles = ['Fred Hutchinson Cancer Center', 'The Jackson Laboratory', 'Memorial Sloan Kettering Cancer Center', 'Northwestern University', 'Stanford University', 'University of California San Francisco', 'Washington University'];
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
