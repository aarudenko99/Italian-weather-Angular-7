import { Component, OnInit,Input } from '@angular/core';
import {CDData, EventChanger, EventsList, MapOptions, Api_UrlManag, ViewModes} from "../entities/entities";    
import {ActivatedRoute} from "@angular/router";
import {MessageService} from "primeng/components/common/messageservice";

import { } from 'jquery';
import '../../assets/jquery.popupoverlay.js';


import { DbAccess } from "../entities/dbAccess";
import { ViewMapComponent } from '../view-map/view-map.component';

export class ViewMode {
  constructor(base:string) {
    this.View = base;
  }
  View: string;
}

@Component({
  selector: 'app-view-loader',
  templateUrl: './view-loader.component.html',
  providers: [DbAccess],
  styleUrls: ['./view-loader.component.css']
})
export class ViewLoaderComponent implements OnInit {

  ngOnInit() {}

  @Input() msgs:string;
  public data: CDData;
  public eventchanger = new EventChanger();

  @Input() ViewMode = new ViewMode('');
  mapViewOption: string = MapOptions.Map;

  locExpand:boolean = false;

// -------------------------------------  PRIMO CARICAMENTO -----------------------------------

  constructor(private _DbAccess: DbAccess, private messageservice: MessageService, private route: ActivatedRoute) {
    
    var mode = this.getCurrentViewMode();
    console.log("VVVVV", mode);
    if (mode==null) mode=ViewModes.home;
    if (mode===ViewModes.home) {
      this.launchView_HomeMap();
    } else if (mode===ViewModes.map) {
      this.launchView_Map();                      // Map
    } else if (mode===ViewModes.loconmap) {
      this.launchView_LocOnMap();                 // Map + maps.bounds (limiti area intorno a località)
    } else if (mode===ViewModes.homelocbyid) {
      this.launchView_homeLocById();              // Dettaglio Località + info MappedElement in currentLocality
    } else if (mode===ViewModes.homelocgeoloc) {
      this.launchView_homeLocGeoloc();            // Dettaglio Località + info MappedElement in currentLocality
    } else if (mode===ViewModes.homeloc) {
      this.launchView_homeloc();                  // Dettaglio Località
    } else if (mode===ViewModes.loc) {
      this.launchView_homeloc();                  // Dettaglio Località
    } else if (mode===ViewModes.rank) {
      this.launchView_rank();                     // Rank
    } else if (mode===ViewModes.favorite) {
      this.launchView_favorite();                     // Rank
    }
    // this.homeUrl = App_UrlManag.HomeUrl;

  }

  private getCurrentViewMode() {
    if (this.route.snapshot.url == null) return null;
    if (this.route.snapshot.url.length < 1) return null;
    var url = this.route.snapshot.url[0];
    if (url == null) return null;
    if (url.path == null) return null;
    return url.path.toLowerCase();
  }

  private launchView_Map() {
    
    this.setMaps(ViewModes.map, MapOptions.Map, true);
  }

  private launchView_HomeMap() {
    this.setMaps(ViewModes.home, MapOptions.Map, true);
  }

  private refreshView_Map(mapOption: string) {
    //Mantiene il this.ViewMode.View corrente che potrebbe essere 'home' o 'map'.
    this.setMaps(this.ViewMode.View, mapOption, false);
  }

  private setMaps(viewMode: string, mapOpt: string, initMe: boolean) {
    const url = Api_UrlManag.get_sectionMap_Url(this.route.snapshot);
    this._DbAccess.getFromDbAndSubscribe_3Params<CDData>(url, this, this.launchMap, viewMode, mapOpt, initMe); 
  }

  private launchView_LocOnMap() {
    const url = Api_UrlManag.get_locOnMap_WebApi_Url(this.route.snapshot, this.eventchanger);
    this._DbAccess.getFromDbAndSubscribe_3Params<CDData>(url, this, this.launchMap, 
                                                         ViewModes.home, MapOptions.Map, true);  
  }
  
  public launchMap(context: ViewLoaderComponent, obj: CDData, 
                    viewMode: string, mapOpt: string, initMe: boolean) {
                      
    context.setDataAndEventChanger(obj, true);
    context.eventchanger.Executed = true;
    context.ViewMode.View = viewMode;
    context.mapViewOption = mapOpt;
    if (initMe) context.launchMe();
  }

  public launchView_rank() {
    const url = Api_UrlManag.get_sectionRank_Url(this.route.snapshot);
    this._DbAccess.getFromDbAndSubscribe<CDData>(url, this, this.launchRank);  
  }

  public launchRank(context: ViewLoaderComponent, obj: CDData) {
    context.ViewMode.View = ViewModes.rank;
    context.data = obj;
  }

  public launchView_favorite() {
    $("#page-map").css("left", "100%");
    const url = Api_UrlManag.get_sectionFavorite_Url(this.route.snapshot);
    this._DbAccess.getFromDbAndSubscribe<CDData>(url, this, this.launchFavorite);  
  }

  public launchFavorite(context: ViewLoaderComponent, obj: CDData) {
    console.log("v4", obj);
    context.ViewMode.View = ViewModes.favorite;
    context.data = obj;
    
  }

  private launchView_homeloc() {
    const locUrl = Api_UrlManag.getLocalityUrl(this.route.snapshot);
    this.launchView_Loc(locUrl);
  }

  private launchView_homeLocById() {
    const locUrl = Api_UrlManag.getHomeLocByIdUrl(this.route.snapshot);
    this.launchView_Loc(locUrl);
  }

  private launchView_homeLocGeoloc() {
    var locUrl = Api_UrlManag.buildHomeLocByIdUrl(null, null, null, null);
    this.launchView_Loc(locUrl);
  }

  private launchView_Loc(locUrl: string) {
    this._DbAccess.getFromDbAndSubscribe<CDData>(locUrl, this, this.launchLoc);  
  }

  public launchLoc(context: ViewLoaderComponent, obj: CDData) {
    context.setDataAndEventChanger(obj, true);
    const evc = context.eventchanger;
    const gb = obj.globalParameters;
    evc.ChangeNotMonitLoc(obj.localityForecasts.currentLocality, gb, true, true);
    context.ViewMode.View = ViewModes.homeloc;
    context.launchMe();
  }

  public setDataAndEventChanger(obj: CDData, allObj: boolean) {
    console.log("v5", obj);
    // Imposto i limiti della mappa sui dati provenienti dal db. (obj: CDData).
    if (obj.maps != null) { this.eventchanger.set_Map_Bounds(obj.maps.bounds); }
    if (obj.resources != null) { 
      if (obj.resources.localities != null) { 
        this.eventchanger.localities = obj.resources.localities; 
      }
    }
    if (allObj) { this.data = obj; }
  }


  // ------------------------------  [EventChanger] - EVENTI TIMER -----------------------------

  private timer;

  launchMe() {
    if (this.timer == null) {


      this.timer = setInterval(() => {
        if (!this.eventchanger.Executed) {
          this.eventchanger.Executed = true;
          switch (this.eventchanger.eventname) {
            case EventsList.LocSectionExpand:
              this.eventchanger.eventname = EventsList.ChangeLocality;
              this.locExpand = !this.locExpand;
              break;
            case EventsList.LoadMaps:
              this.refreshView_Map(MapOptions.Map);
              break;
            case EventsList.LoadCities:
              this.refreshView_Map(MapOptions.Cities);
              break;
            default:
              console.log("v3", this.data.globalParameters);
              var url = Api_UrlManag.select_WebApi_Url(this.eventchanger, this.data.globalParameters);
              if (url != null) {
                let prevGlobal = JSON.stringify(this.data.globalParameters);
                this.SubscribeAndSetData(prevGlobal, url);
              }
              break;
          }
        }
      }, 30);
    }
  }

  private SubscribeAndSetData(prevGlob: string, url: string) {
    url = Api_UrlManag.format_WebApi_Urls(url, this.eventchanger,
                                          this.data.globalParameters, 
                                          this.data.localityForecasts);
    this._DbAccess.getFromDbAndSubscribe_1Params<CDData>(url, this, this.subscribeAndSetData, prevGlob);
  }

  public subscribeAndSetData(context: ViewLoaderComponent, obj: CDData, prevGlob: string) {
    if (obj.globalParameters.serverInfo == null) {
      context.setUpData(obj);
    } else {
      context.data.globalParameters = JSON.parse(prevGlob);
      context.messageservice.add({
        severity: 'info', summary: 'Info',
        detail: obj.globalParameters.serverInfo.message
      });
    }
    if (context.eventchanger.eventname == EventsList.ChangeLocality) {
      context.ViewMode.View = ViewModes.homeloc;
    }
  }

  setUpData(data: CDData) {
    if (data.localityForecasts != null) this.data.localityForecasts = data.localityForecasts;
    if (data.timeLineBars != null) this.data.timeLineBars = data.timeLineBars;
    if (data.globalParameters != null) {
      if (data.globalParameters.uId != null) this.data.globalParameters.uId = data.globalParameters.uId;
      if (data.globalParameters.userName != null) this.data.globalParameters.userName = data.globalParameters.userName;
      if (data.globalParameters.rId != null) this.data.globalParameters.rId = data.globalParameters.rId;
      if (data.globalParameters.cId != null) this.data.globalParameters.cId = data.globalParameters.cId;
      if (data.globalParameters.forecastIssueDate != null) this.data.globalParameters.forecastIssueDate = data.globalParameters.forecastIssueDate;
      if (data.globalParameters.forecastDeadLineDate != null) this.data.globalParameters.forecastDeadLineDate = data.globalParameters.forecastDeadLineDate;
      if (data.globalParameters.mId != null) this.data.globalParameters.mId = data.globalParameters.mId;
      if (data.globalParameters.rankingBy != null) this.data.globalParameters.rankingBy = data.globalParameters.rankingBy;
      if (data.globalParameters.rankingScope != null) this.data.globalParameters.rankingScope = data.globalParameters.rankingScope;
      if (data.globalParameters.culture != null) this.data.globalParameters.culture = data.globalParameters.culture;
      if (data.globalParameters.urlNavs != null) this.data.globalParameters.urlNavs = data.globalParameters.urlNavs;
      this.data.globalParameters.serverInfo = data.globalParameters.serverInfo;
    }
    if (data.selectedRegion != null) this.data.selectedRegion = data.selectedRegion;
    if (data.maps != null) this.data.maps = data.maps;
    // this.setDataAndEventChanger(data, false);
  };
 
  public get_Locality_Name() {
    return this.eventchanger.get_Locality_Name(this.data);
  }

  public get_Locality_MaturityDateArr() {
    return this.data.localityForecasts ?
      this.data.localityForecasts.dayForecasts[0].maturityDateLabel : null;
  }

  public viewMap() {
    this.data.localityForecasts = null;
    this.eventchanger.viewMap();
  }

  public viewCities() {
    this.eventchanger.viewCities();
  }

  public showHeader() {
    return this.showFooter() || this.ViewMode.View === ViewModes.map || this.ViewMode.View === ViewModes.favorite || this.ViewMode.View === ViewModes.rank;
  }

  public showFooter() {
    return this.ViewMode.View === ViewModes.home || (this.ViewMode.View === ViewModes.homeloc && this.locExpand === false) || (this.ViewMode.View === ViewModes.rank) || (this.ViewMode.View === ViewModes.favorite);
  }

  // public showWholePage() {
  //   return this.ViewMode.View === ViewModes.home ||
  //     (this.ViewMode.View === ViewModes.homeloc && this.locExpand === false) ||
  //     this.ViewMode.View === ViewModes.rank;
  // }
  public showFL() {
    return this.ViewMode.View === ViewModes.home || this.ViewMode.View === ViewModes.favorite;
  }

  public showMaps() {
    return this.ViewMode.View === ViewModes.home || this.ViewMode.View === ViewModes.map;
  }

  public showLoc() {
    return this.ViewMode.View === ViewModes.homeloc || this.ViewMode.View === ViewModes.loc;
  }

  public getHomeUrl() {
    return this.eventchanger.homeUrl;
  }

}


// this.httpClient.get<CDData>(locUrl).pipe(
//   tap( data => {
//     this.data = data;
//     setTimeout(() => this.ViewMode.View="Locality", 0);
//     setTimeout(() => this.eventchanger.eventname=EventsList.ChangeLocality, 0);
//     setTimeout(() => this.eventchanger.Executed=true, 0);
//     this.launchMe();
//   })
//  ).subscribe();   



    // private SubscribeAndSetData(prevGlobal:string, url:string) {
    //   url = UrlSupport.format_MeteoHubWebApi_Urls(url, this.eventchanger, 
    //                                               this.data.globalParameters, this.data.localityForecasts);
    //   this.httpClient.get<CDData>(url).pipe(
    //     tap(val => {
    //       if (val.globalParameters.serverInfo == null) {
    //         this.setUpData(val);
    //       } else {
    //         this.data.globalParameters=JSON.parse(prevGlobal);
    //         this.messageservice.add({severity:'info', summary:'Info', 
    //                                  detail:val.globalParameters.serverInfo.message});
    //       }
    //       if (this.eventchanger.eventname==EventsList.ChangeLocality) {
    //         this.ViewMode.View='Locality';
    //       }
    //     }),
    //   ).subscribe();
    // }


     // const locality = this.route.snapshot.params[RouteParams.locality];
    // if (locality == null) {
    //   return Api_UrlManag.locViewUrl + this.emptyPath;
    // } else {
    //   var region = this.route.snapshot.params[RouteParams.region];
    //   if (region == null) {
    //     return Api_UrlManag.locViewUrl + locality + this.secondParamPath;
    //   } else {
    //     var culture = this.route.snapshot.params[RouteParams.culture];
    //     if (culture == null) culture = this.defCulture;
    //     return Api_UrlManag.locViewUrl + locality + '/' + region + '/' + culture;
    //   }
    // }

  // public launchView_rank() {
  //   const prms = this.route.snapshot.params;
  //   var url = Api_UrlManag.replace_sectionRank_Url(prms[RouteParams.rId],
  //     prms[RouteParams.cId], prms[RouteParams.culture], null, null, null);
  //   this.httpClient.get<CDData>(url).toPromise().then(data => {
  //     setTimeout(() => this.ViewMode.View = ViewModes.rank, 0);
  //     this.data = data;
  //   });
  // }

// private launchMap(url: string, viewMode: string,
  //   mapViewOpt: string, initLaunchMe: boolean, executed: boolean) {
  //   this.httpClient.get<CDData>(url).toPromise().then(data => {
  //     this.data = data;
  //     setTimeout(() => this.eventchanger.Executed = executed, 0);
  //     setTimeout(() => this.ViewMode.View = viewMode, 0);
  //     setTimeout(() => this.mapViewOption = mapViewOpt, 0);
  //     if (initLaunchMe) this.launchMe();
  //   });
  // }

  // private launchView_Loc(locUrl: string) {
  //   this.httpClient.get<CDData>(locUrl).toPromise().then(data => { 
  //     this.data = data;
  //     setTimeout(() => this.eventchanger.Executed = true, 0);
  //     setTimeout(() => this.ViewMode.View = ViewModes.homeloc, 0);
  //     setTimeout(() => this.eventchanger.eventname = EventsList.ChangeLocality, 0);
  //     this.launchMe();
  //   });
  // }
// private SubscribeAndSetData(prevGlobal: string, url: string) {
  //   url = Api_UrlManag.format_MeteoHubWebApi_Urls(url, this.eventchanger,
  //     this.data.globalParameters, this.data.localityForecasts);
  //   this.httpClient.get<CDData>(url).toPromise().then(
  //     val => {
  //       if (val.globalParameters.serverInfo == null) {
  //         this.setUpData(val);
  //       } else {
  //         this.data.globalParameters = JSON.parse(prevGlobal);
  //         this.messageservice.add({
  //           severity: 'info', summary: 'Info',
  //           detail: val.globalParameters.serverInfo.message
  //         });
  //       }
  //       if (this.eventchanger.eventname == EventsList.ChangeLocality) {
  //         this.ViewMode.View = ViewModes.homeloc;
  //       }
  //     });
  // }

  // private setMaps(viewMode: string, mapOpt: string, initMe: boolean, executed: boolean) {
  //   // const prms = this.route.snapshot.params;
  //   // var userId: string = prms[RouteParams.uId];
  //   // var url = null;
  //   // if (userId == null) {
  //   //   url = Api_UrlManag.sectionMapFirstLoadUrl;
  //   // } else {
  //   //   url = Api_UrlManag.replace_sectionMap_Url(userId,
  //   //     prms[RouteParams.rId], prms[RouteParams.cId], prms[RouteParams.forecastIssueDate],
  //   //     prms[RouteParams.forecastDeadLineDate], prms[RouteParams.userName], prms[RouteParams.culture]);
  //   // }
  //   const url = Api_UrlManag.get_sectionMap_Url(this.route.snapshot);
  //   // this.launchMap(url, viewMode, mapOpt, initMe, executed);
  //   this._DbAccess.getFromDbAndSubscribe_4Params<CDData>(url, this, this.launchMap, 
  //                                                        viewMode, mapOpt, initMe, executed);  
  // }