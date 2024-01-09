import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Facet, Filter} from "../../types/facet";
import {StringUtilsService} from "../../services/string-utils.service";

@Component({
  selector: 'app-facet',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './facet.component.html',
  styleUrl: './facet.component.scss'
})
export class FacetComponent {
  facetControl = new FormControl('');
  @Input() facet: Facet;
  @Output() filterChangedEvent = new EventEmitter<Filter>();

  filterChanged(value: any) {
    let filterValues = this.facetControl.value! as unknown as string[];
    let filter = {
      "title": this.facet.title,
      "values": filterValues
    }
    this.filterChangedEvent.emit(filter);
  }

  protected readonly StringUtilsService = StringUtilsService;
}
