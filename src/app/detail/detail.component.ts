import {Component, OnChanges, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {MorphicRecord} from "../interfaces";
import {DataService} from "../services/data.service";
import {GridRecord} from "../types/GridRecord";




@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit  {

  constructor(private dataService: DataService,private route: ActivatedRoute) {}

  public detailRecord!: MorphicRecord;

  ngOnInit(): void {

    this.route.queryParamMap
      .subscribe((params) => {
          if (this.dataService.isCached(DataService.dataKey)) {
            this.detailRecord = this.filterRecord((Number(params.get("id"))), this.dataService.getFromCache(DataService.dataKey));
          } else {
            this.dataService.loadJsonData().subscribe(
              (record) => {
                this.detailRecord = this.filterRecord((Number(params.get("id"))), record);
              }
            )
          }
        }
      );
  }

  filterRecord(idToFilter:number, records: GridRecord[]) {
    return records.filter((rec) => {
      console.log("detail call inside filter");
      let mrec = rec as MorphicRecord;
      return mrec.id == idToFilter;
    }).pop() as MorphicRecord;
  }

}
