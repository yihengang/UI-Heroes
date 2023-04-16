import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeroesComponent } from './heroes/heroes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';

//http://localhost:4200/heroes - router told to match that URL to path: 'heroes' and display HeroesComponent when URL is that
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, //redirects a URL that full matches the empty path to the route whose path is /dashboard
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: HeroDetailComponent }, //parameterized route, :id is a placeholder for a specific hero id
  { path: 'heroes', component: HeroesComponent },
];

@NgModule({
  //initializes the router and starts listening for browser location changes
  imports: [RouterModule.forRoot(routes)], //forRoot() method configures router at app's root level and supplies the service providers and directives needed for routing, & performs initial navigation based on current browser URL
  exports: [RouterModule], //exported so RouterModule is available throughout application
})
export class AppRoutingModule {}
