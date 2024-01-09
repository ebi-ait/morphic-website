import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';
import {AgGridModule} from "ag-grid-angular";
import {UrlCellRenderer} from "./url-cell-renderer.component";
import {HttpClientModule} from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HeaderComponent} from "./header/header.component";
import {FooterComponent} from "./footer/footer.component";
import {FacetComponent} from "./shared/facet/facet.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";

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
        FacetComponent,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        FormsModule,
        MatCheckboxModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
