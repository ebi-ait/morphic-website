import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {GridComponent} from './grid/grid.component';
import {AgGridModule} from "ag-grid-angular";
import {UrlCellRenderer} from "./url-cell-renderer.component";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";
import {HeaderComponent} from "./header/header.component";
import {FooterComponent} from "./footer/footer.component";
import {FacetComponent} from "./shared/facet/facet.component";

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    UrlCellRenderer
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AgGridModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
    FacetComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
