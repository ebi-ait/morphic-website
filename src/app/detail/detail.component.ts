import { HttpClient } from "@angular/common/http";
import {Component, OnChanges, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {MorphicRecord} from "../interfaces";




@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit  {



  constructor(private http: HttpClient,private route: ActivatedRoute) {}

  public rowData!: MorphicRecord;
  ngOnInit(): void {

    this.route.queryParamMap
      .subscribe((params) => {

        this.http.get<MorphicRecord[]>("assets/test-data.json").subscribe(
          (data) => {
            this.rowData = data.filter( d=> d.id==Number(params.get("id")))[0];
          },
          (error) => {
            console.error("Error fetching data:", error);
          },
        );

        }
      );


  }



}
