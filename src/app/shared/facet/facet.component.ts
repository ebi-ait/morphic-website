import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {AsyncPipe, NgFor, NgForOf, NgIf} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Facet, Filter} from "../../types/facet";
import {StringUtilsService} from "../../services/string-utils.service";
import {MatChipInputEvent, MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {filter, map, Observable, startWith} from "rxjs";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatCheckboxModule} from "@angular/material/checkbox";


@Component({
  selector: 'app-facet',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    ReactiveFormsModule,
    NgIf,


    FormsModule,
    MatFormFieldModule,
    MatChipsModule,
    NgFor,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatCheckboxModule,
  ],
  templateUrl: './facet.component.html',
  styleUrl: './facet.component.scss'
})
export class FacetComponent implements OnInit {
  @Input() facet: Facet;
  @Output() filterChangedEvent = new EventEmitter<Filter>();

  protected readonly StringUtilsService = StringUtilsService;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  facetControl = new FormControl('');
  filteredFacets: Observable<string[]>;
  selectedFilters: string[] = [];
  facetValues: string[] = [];

  @ViewChild('filterInput') filterInput: ElementRef<HTMLInputElement>;
  announcer = inject(LiveAnnouncer);

  filterChanged(value: any) {
    let filterValues = this.facetControl.value! as unknown as string[];
    let filter = {
      "title": this.facet.title,
      "values": this.selectedFilters
    }
    this.filterChangedEvent.emit(filter);
  }


  constructor() {
    this.filteredFacets = this.facetControl.valueChanges.pipe(
      startWith(null),
      map((f: string | null) => (f ? this._filter(f) : this.facetValues.slice())),
    );
  }

  ngOnInit(): void {
    if (this.facet) {
      this.facetValues = this.facet.values.map(f => f.value);
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.selectedFilters.push(value);
    }
    event.chipInput!.clear();
    this.facetControl.setValue(null);

    this.filterChanged("");
  }

  remove(filter: string): void {
    const index = this.selectedFilters.indexOf(filter);
    if (index >= 0) {
      this.selectedFilters.splice(index, 1);
      this.announcer.announce(`Removed ${filter}`);
    }

    this.filterChanged("");
  }

  toggleSelected(event: MatAutocompleteSelectedEvent) {
    let selectedValue = event.option.viewValue;
    if (this.selectedFilters.includes(selectedValue)) {
      const index = this.selectedFilters.indexOf(selectedValue, 0);
      if (index > -1) {
        this.selectedFilters.splice(index, 1);
      }
    } else {
      this.selectedFilters.push(event.option.viewValue);
    }
    this.filterInput.nativeElement.value = '';
    this.facetControl.setValue(null);

    this.filterChanged("");
  }

  isFacetValueSelected(value: string): boolean {
    return this.selectedFilters.includes(value);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.facetValues.filter(f => f.toLowerCase().includes(filterValue));
  }
}
