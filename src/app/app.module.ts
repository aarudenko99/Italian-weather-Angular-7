import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms'
// import { SelectModule } from 'ng2-select';
// import { NgSelectModule } from '@ng-select/ng-select';


import { RouterModule, Routes } from '@angular/router';
import { GrowlModule } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CalendarModule } from 'primeng/primeng';     //accordion and accordion tab
import { AppComponent } from './app.component';
import { ViewLoaderComponent } from './view-loader/view-loader.component';
import { MainmenuComponent } from './mainmenu/mainmenu.component';
import { RankingListComponent } from './rankinglist/rankinglist.component';
import { TimelinebarComponent } from './timelinebar/timelinebar.component';
import { ViewLocalityComponent } from './view-locality/view-locality.component';
import { ViewMapComponent } from './view-map/view-map.component';
import { PageHomeComponent } from './page-home/page-home.component';

import { PageHomeLocComponent } from './page-home-loc/page-home-loc.component';
import {MatAutocompleteModule,MatInputModule} from '@angular/material';
import { ForecastersComponent } from './forecasters/forecasters.component';

import { ViewBarLocalityComponent } from './view-bar-locality/view-bar-locality.component';
import { ViewBarMapsComponent } from './view-bar-maps/view-bar-maps.component';

import { ViewStepperComponent } from './view-stepper/view-stepper.component'; 

import {HttpClientModule} from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { UserFavoriteComponent } from './user-favorite/user-favorite.component';

// import {APP_BASE_HREF} from '@angular/common';

const routes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '', component: PageHomeComponent },
  { path: 'homeLocGeoloc', component: PageHomeComponent },

  { path: 'locOnMap/:eId/:rId/:cId/:forecastIssueDate/:forecastDeadLineDate/:culture/:lat/:lng', component: PageHomeComponent },
  { path: 'locOnMap/:eId/:rId/:cId/:forecastIssueDate/:forecastDeadLineDate/:culture/:lat/:lng/:neId', component: PageHomeComponent },

  { path: 'homeLocById/:eId', component: PageHomeComponent },
  { path: 'homeLocById/:eId/:rId', component: PageHomeComponent },
  { path: 'homeLocById/:eId/:rId/:culture', component: PageHomeComponent },
  { path: 'homeLocById/:eId/:rId/:culture/:neId', component: PageHomeComponent },

  { path: 'homeloc/:locality', component: PageHomeLocComponent },
  { path: 'homeloc/:locality/:region', component: PageHomeLocComponent },
  { path: 'homeloc/:locality/:region/:culture', component: PageHomeLocComponent },

  { path: 'map', component: PageHomeComponent },
  { path: 'map/:uId/:rId/:cId/:forecastIssueDate/:forecastDeadLineDate/:userName/:culture', component: PageHomeComponent },

  { path: 'rank', component: PageHomeComponent },
  { path: 'rank/:rId/:cId/:culture', component: PageHomeComponent },
  
  { path: 'loc/:locality', component: PageHomeLocComponent },
  { path: 'loc/:locality/:region', component: PageHomeLocComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ViewLoaderComponent,
    MainmenuComponent,
    RankingListComponent,
    TimelinebarComponent,
    ViewLocalityComponent,
    ViewMapComponent,
    PageHomeComponent,
    PageHomeLocComponent,
    ViewStepperComponent,
    ForecastersComponent,
    ViewBarLocalityComponent,
    ViewBarMapsComponent,
    UserFavoriteComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule.forRoot(),
    FormsModule,
    BrowserAnimationsModule,
    CalendarModule,
    GrowlModule,
    MatAutocompleteModule,
    MatInputModule,
    // SelectModule,
    // NgSelectModule, 
    RouterModule.forRoot(routes, { enableTracing: true }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }) // debugging purposes only
  ],
  // providers: [{provide: APP_BASE_HREF, useValue: '/' }, MessageService],
  providers: [MessageService],
  bootstrap: [AppComponent]

})
export class AppModule { }
