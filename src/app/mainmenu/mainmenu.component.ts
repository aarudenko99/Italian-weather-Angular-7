import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap} from 'rxjs/operators';
import { SearchService } from "../entities/dbAccess";
import { EventChanger, GlobalParameters, SearchElement, App_UrlManag } from "../entities/entities";


@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  providers: [SearchService],
  styleUrls: ['./mainmenu.component.css']
})
export class MainmenuComponent implements OnInit {

  constructor(private _service: SearchService) {  }
  ngOnInit() { }

  searching = false;
  searchFailed = false;
  
  _EVC: EventChanger;
  @Input('eventchanger')
  set setEventChanger(value: EventChanger) { 
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", value);
    if (value) {
      this._EVC = value;
      if (this._service && value.localities) {
        this._service.buildLocalitiesArray(value.localities);
      }
    }
  }
  
  get getEventChanger(): EventChanger {
    return this._EVC;
  }

  logoUrl: string;
  GetLogoUrlPath() {
    if (this.logoUrl == null) {
      this.logoUrl = this.GetLogoUrl();
    }
    return this.logoUrl;
  }

  GetLogoUrl() {
    if (this._EVC.isMobile()) {
      return App_UrlManag.logos + App_UrlManag.logo_compact;
    } else {
      return App_UrlManag.logos + App_UrlManag.logo;
    }
  }

  // ------------------------- globalParameters -----------------------------

  private _GP: GlobalParameters;
  @Input('globalParameters')
  set globalParameters(value: GlobalParameters) {
    console.log("456", value);
    if (value) {
      this._GP = value;
      if (this._service) {
        this._service.globalParameters = value; 
      }
    }
  }
  get globalParameters(): GlobalParameters {
    return this._GP;
  }
  
// ---------------------------------------- model --------------------------------------

  // Click sul pulsante di ricerca località in parte alla casella di testo Località
  GoSearch() {
    
    this.checkIfSetChangeLocalities(); 
  }

  _model:any;
  set model(value: any) {
    this._model = value;
    this.checkIfSetChangeLocalities();
  }
  get model(): any {
    return this._model;
  }
  
  private checkIfSetChangeLocalities() {
    var loc = this.findLocalityByModel();
    if (loc != null) { 
      // this.eventchanger.ChangeLocality(loc.elementId); 
      console.log("mytest",this._GP);
      this._EVC.ChangeLoc(loc, this._GP, true); 
    } else {
      var searchLoc = this.findSearchLocalityByModel();
      if (searchLoc != null) {
        this._EVC.ChangeNotMonitLoc(searchLoc, this._GP, true, false);
      } 
    }
  }

  findLocalityByModel()  {
    // console.log(this._model);
    return this._EVC.findLocalityByName(this._model);
  }

  findSearchLocalityByModel(): SearchElement {
    if (this._service) {
      return this._service.findSearchLocalityByModel(this._model);
    } else {
      return null;
    }
  }
  
  // -------------------------------------- search ------------------------------------
 
  search = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => this.searching = true),
    switchMap(term =>
      this._service.search(term).pipe(
        tap(() => this.searchFailed = false),
        catchError(() => {
          this.searchFailed = true;
          return of([]);
        }))
    ),
    tap(() => this.searching = false)
  );
}
