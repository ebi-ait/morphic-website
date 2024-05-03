import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './home/home.component.scss']
})

export class AppComponent implements OnInit {
  title = 'study-tracker';
  constructor(private metaTagService: Meta) {}

  ngOnInit() {
    this.metaTagService.updateTag({
      name: 'robots',
      content: 'noindex, nofollow'
    });
  }
}
