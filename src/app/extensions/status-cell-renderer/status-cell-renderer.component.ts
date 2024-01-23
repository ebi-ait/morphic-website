import {Component} from '@angular/core';
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams} from "ag-grid-community";
import {MatButtonModule} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {MatChipsModule} from "@angular/material/chips";

@Component({
  selector: 'app-status-column',
  standalone: true,
  imports: [
    MatButtonModule,
    NgIf,
    MatChipsModule
  ],
  template: `
    <div style="margin: 0 auto">
      <button *ngIf="released" mat-raised-button color="primary" style="float: right">
        <span class="inline-text">Download</span>
      </button>
      <mat-chip *ngIf="!released" class="inline-chip" style="float: right;">
        <div *ngIf="hasReleaseDate; else elseBlock">
          <span class="inline-text">Available {{releaseText}}</span>
        </div>
        <ng-template #elseBlock>
          <span class="inline-text">{{releaseText}}</span>
        </ng-template>
      </mat-chip>
    </div>
  `,
  styles: [`
    .inline-text {
      font-size: 10px;
    }`]
})
export class StatusCellRendererComponent implements ICellRendererAngularComp {
  released: boolean;
  releaseText: string;
  hasReleaseDate: boolean;

  monthYearRegExp: RegExp = /^([a-zA-Z]{3})\s+(20\d{2}|\d{2})$/;

  agInit(params: ICellRendererParams) {
    this.generateCellValue(params);
  }

  refresh(params: ICellRendererParams) {
    this.generateCellValue(params);
    return true;
  }

  public generateCellValue(params: ICellRendererParams) {

    if (params.data['expected_release']) {
      this.released = false;
      this.releaseText = params.data['expected_release'];
      this.hasReleaseDate = this.monthYearRegExp.test(this.releaseText);
    } else {
      this.released = true;
    }
  }
}
