import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GridComponent} from "./grid/grid.component";
import { AboutComponent } from './about/about.component';
import {DetailComponent} from "./detail/detail.component";
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'study-tracker', component: GridComponent },
  { path: 'about', component: AboutComponent },
  { path: 'detail', component: DetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
