import { Component } from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf} from "@angular/common";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-facet',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './facet.component.html',
  styleUrl: './facet.component.scss'
})
export class FacetComponent {
  facetControl = new FormControl('');
  facetValues: Set<String> = new Set();

  applyFilter(value: any) {
    console.log("Filter changes: " + value);
    let filterValues = this.facetControl.value;
    console.log(filterValues);
    this.gridApi.onFilterChanged();
  }
}
