import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Facet, Filter} from "../../types/facet";
import {StringUtilsService} from "../../services/string-utils.service";
import {MatChipInputEvent, MatChipsModule} from "@angular/material/chips";
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MatIconModule} from "@angular/material/icon";
import {map, Observable, startWith} from "rxjs";
import {COMMA, ENTER} from "@angular/cdk/keycodes";

@Component({
  selector: 'app-facet',
  standalone: true,
  imports: [
    AsyncPipe,
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './facet.component.html',
  styleUrl: './facet.component.scss'
})
export class FacetComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];

  facetControl = new FormControl('');
  @Input() facet: Facet;
  @Output() filterChangedEvent = new EventEmitter<Filter>();
  protected readonly StringUtilsService = StringUtilsService;
  @ViewChild('facetInput') facetInput: ElementRef<HTMLInputElement>;

  filteredOptions: Observable<string[]>;
  selectedOptions: string[] = [];
  allOptions: string[];

  ngOnInit(): void {
    this.allOptions = this.facet.values.map(f=>f.value);
    this.filteredOptions = this.facetControl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allOptions.slice())),
    );
  }
  filterChanged(value: any) {
    let filterValues = [value];
    let filter = {
      "title": this.facet.title,
      "values": filterValues
    }
    this.filterChangedEvent.emit(filter);
  }
  add(event: MatChipInputEvent): void {
    console.log(`add: ${event}`)

    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.selectedOptions.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.facetControl.setValue(null);
    this.filterChanged(event.value)

  }

  remove(option: string): void {
    console.log(`remove: ${option}`)
    const index = this.selectedOptions.indexOf(option);

    if (index >= 0) {
      this.selectedOptions.splice(index, 1);
    }
    this.filterChanged(null);

  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log(`selected: ${event.option.value}`)
    this.selectedOptions.push(event.option.viewValue);
    this.facetInput.nativeElement.value = '';
    this.facetControl.setValue(null);
    this.filterChanged(event.option.value)
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allOptions.filter(value => value.toLowerCase().includes(filterValue));
  }
}
