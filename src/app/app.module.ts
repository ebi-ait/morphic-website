import {NgModule} from '@angular/core';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {GridComponent} from './grid/grid.component';
import {AgGridModule} from "ag-grid-angular";
import {UrlCellRenderer} from "./url-cell-renderer.component";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HeaderComponent} from "./header/header.component";
import {FooterComponent} from "./footer/footer.component";
import {FacetComponent} from "./shared/facet/facet.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatIconModule, MatIconRegistry} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {DetailComponent} from "./detail/detail.component";
import {MatCardModule} from "@angular/material/card";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { CarouselComponent } from './carousel/carousel.component';
import { HomeComponent } from './home/home.component';
import { CdkAccordionOverviewExample } from './accordion/accordion.component';

@NgModule({
  declarations: [
    AppComponent,
    CarouselComponent,
    DetailComponent,
    GridComponent,
    HomeComponent,
    UrlCellRenderer,
  ],
    imports: [
        AgGridModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        CdkAccordionOverviewExample,
        FacetComponent,
        FooterComponent,
        FormsModule,
        HeaderComponent,
        HttpClientModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatIconModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatSelectModule,
        MatSidenavModule,
        MatToolbarModule,
        ReactiveFormsModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIcon(
      'squares',
      domSanitizer.bypassSecurityTrustResourceUrl('./assets/squares-icon.svg')
    );
  }
}
