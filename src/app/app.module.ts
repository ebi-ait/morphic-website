import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';
import {AgGridModule} from "ag-grid-angular";
import {UrlCellRenderer} from "./url-cell-renderer.component";
import {HttpClientModule} from "@angular/common/http";

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
        AgGridModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
