import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {QuickviewComponent} from "./grid/quickview.component";

const routes: Routes = [

  { path: 'quickview-component', component: QuickviewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
