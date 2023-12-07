import { HttpClient } from "@angular/common/http";
import {Component, OnChanges, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";




@Component({
  selector: 'app-detail',
  templateUrl: './quickview.component.html',
  styleUrls: ['./quickview.component.scss']
})
export class QuickviewComponent implements OnInit  {



  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {

  }



}
