import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GridComponent} from "./grid/grid.component";
import {DetailComponent} from "./detail/detail.component";

const routes: Routes = [
  {path: '', component: GridComponent},
  { path: 'detail', component: DetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
