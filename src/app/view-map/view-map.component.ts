/// <reference types="@types/googlemaps" />
import { Component, Input, OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { DbAccess } from "../entities/dbAccess";

import {
  GlobalParameters,
  LabelsForMapScore,
  LabelsForForecasts,
  Maps,
  Map,
  Forecast,
  DetailList,
  GroupData,
  DataItem,
  EventChanger,
  MapOptions,
  App_UrlManag,
  SearchElement,
  GeoCoords,
  Locality,
  Api_UrlManag,
  MapsManag,
  ZoomState,
  
} from '../entities/entities';

import {
  MapsOptionsManag,
  GMapBounds,
  MarkerSupport,
  ScreenOptions,
} from '../entities/googleSup';


@Component({
  selector: 'view-map',
  templateUrl: './view-map.component.html',
  providers: [DbAccess],
  styleUrls: ['./view-map.component.css']
})

export class ViewMapComponent {
  constructor(private _DbAccess: DbAccess) { }

  // myControl = new FormControl();
  // options: string[] = ['One', 'Two', 'Three'];
  // filteredOptions: Observable<string[]>;

  // ngOnInit() {
  //   this.filteredOptions = this.myControl.valueChanges
  //     .pipe(
  //       startWith(''),
  //       map(value => this._filter(value))
  //     );
  // }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.options.filter(option => option.toLowerCase().includes(filterValue));
  // }
  
  @Input() labelsformapscore: LabelsForMapScore;
  @Input() labelsforforecasts: LabelsForForecasts;
  @Input() globalParameters: GlobalParameters;
  @Input() selectedView: string = MapOptions.Map;

  @Input() eventchanger: EventChanger;

  @ViewChild('gmap') gmapElement: ElementRef;

    // ----------------------------------------------------------------------------------

  groupList: DetailList;
  groupsParamType = 0;
  openedGroups: Array<string>;
  mapWidth: number;

  MapStatistics: boolean;
  MapStatisticsX = 0;
  MapStatisticsW = 0;
  MapStatisticsBackgroundColor: string;
  MapStatisticsForegroundColor: string;

  Lb1: string;
  Lb2: string;
  Vl1: string;
  Vl2: string;
  LegendFontSize: string;

  ViewStatisticsButton;

  MapCalendar: boolean;
  MapCalendarX = 0;
  MapCalendarW = 0;
  LegendCalendarFontSize1: string;
  LegendCalendarFontSize2: string;

  weekday: string;
  dayofmonth: string;
  hour: string;
  ValueFontSize: string;

  
  mapDiv: HTMLElement;
  googleMap: google.maps.Map;
  markers: google.maps.Marker[] = [];


  // -------------------------------------- maps --------------------------------------

  selMap: Map;
  _maps: Maps;

  mapsManag: MapsManag;

  @Input('maps')
  set maps(value: Maps) {
    this._maps = value;
    //Se cambia la data di scadenza o di emissione viene chiamato set maps e reinstanziato MapsManag.
    //Su aggiornamento dell'utente previsore, non viene chiamato set maps e rimane la vecchia array
    //di mappe con le previsioni del utente di default che servono per i dati che contengono 
    //inerenti le scadenze (es: MaturityId e forecastIssueDate etc.)
    this.mapsManag = new MapsManag(value, value.hoursBarInfo, this.eventchanger);
    this.selMap = this.mapsManag.getMapByCurrentIndex();
    this.refreshMapAndRegions();
  }
  get maps(): Maps {
    return this._maps;
  }

// -------------------------- Da @Input('maps') -------------------------

  refreshMapAndRegions() {
    this.selectedView = MapOptions.Map;
    this.mapWidth = 0; // Force render map;
    this.updateLocGroupsByParamType(0);  // AGGIORNA LA LISTA NODI REGIONE - COMUNI
    this.renderGoogleMap();
  }

  // ------------GOOGLE MAP------------GOOGLE MAP------------ GOOGLE MAP------------GOOGLE MAP------------

  renderGoogleMap() {
    if (!this.initScreenBySize()) { return; }
    if (!this.iniGoogleMap()) { return; }
    //N.B. Dopo il metodo this.iniGoogleMap() lo zoom dell'oggetto googleMap è sicuramente definitivo.
    const zoom = this.googleMap.getZoom();
    const zoomState = this.mapsManag.getZoomState(zoom);
    const imgSize = this.mapsManag.getMapIconsSize(zoom, this._maps);
    switch (zoomState) {
      case ZoomState.Active_Over_Level_7:
        this.setMapMarkers(this.selMap.forecasts, imgSize);
        break;
      case ZoomState.Active_Within_Level_7:
        this.set_MapMarkers_ByZoomLevel(zoom, imgSize);
        break;
      default:
        this.set_MapMarkers_ByZoomLevel(zoom, imgSize);
        break;
    }
    this.setMapSummary();
  }

  initScreenBySize(): boolean {
    if (this.gmapElement == null) { return false; }
    this.mapDiv = this.gmapElement.nativeElement;
    if (this.mapDiv == null) { return false; }
    const areawidth: number = this.mapDiv.clientWidth;
    if (areawidth === 0) { return false; }
    this.mapWidth = areawidth;
    this.mapsManag.setScreenBySize(areawidth); // => set this.screenType
    return true;
  }

  idleListener: google.maps.MapsEventListener;

  add_Idle_Listener(main: ViewMapComponent) {
    if (main.idleListener != null) { return; }
    main.idleListener = 
      google.maps.event.addListener(main.googleMap, 'idle', function(ev) {
        main.bounds_changed_handler();
    });
  }

  remove_Idle_Listener() {
    if (this.idleListener != null) {
      google.maps.event.removeListener(this.idleListener);
      this.idleListener = null;
    }
  }

  iniGoogleMap(): boolean {
    if (this.googleMap != null) { return true; }
    this.googleMap = MapsOptionsManag.initMap(this.mapDiv, this.maps, this.mapsManag.screenType);
    const main = this;
    this.googleMap.addListener('zoom_changed', function() {
      main.zoom_changed_handler();
    });
    this.add_Idle_Listener(main);
    return (this.googleMap != null);
  }

  zoom_changed_handler() {
    const zoom = this.googleMap.getZoom();
    const zoomChanged = this.mapsManag.check_zoom_changed_under_level_8(zoom);
    if (zoomChanged === true) {
      this.refresh_Map_Without_Bounds(); 
    }
  }

  bounds_changed_handler() {
    const zoom = this.googleMap.getZoom();
    if (this.mapsManag.check_bounds_changed(zoom)) {
      const mb = GMapBounds.getGoogleMapBounds(this.googleMap);
      // Se (zoom > 7) Setto evtChanger.activeMapBounds a mb, in modo da comunicare al gestore degli eventi 
      // globali viewLoaderComponent.launchMe() (attivo tramite timer e che accede all'oggetto globale 
      // eventChanger) di selezionare l'url globalParams.urlNavs.changeWithBounds per accedere al db. In 
      // pratica, si tratta di una chiamata che accomuna tutti gli eventi globali (changeUser, changeIssueDate, 
      // changeDeadlineDate etc.) aggiungendo i parametri bounds (minLat, minLong, maxLat, maxLong) 
      // in modo da recuperare solo i dati dell'ora corrente (corrispondente ad un dato MaturityId)
      // escludendo le mappe che si riferiscono alle altre scadenze della giornata e includendo solo le 
      // località ricomprese nei limiti (bounds) settati tramite lo zoom della mappa correntemente
      // visualizzata.
      this.eventchanger.set_Map_Bounds(mb);
      this.refresh_Map_With_Bounds(mb);  
    }
  }
 
  set_MapMarkers_ByZoomLevel(zoom: number, imgSize: number) {
    const priority = ScreenOptions.getPriorityByZoomLevel(zoom);
    const filteredForecasts = this.filterLocalities(priority);
    this.setMapMarkers(filteredForecasts, imgSize);
  }

  filterLocalities(priority: number): Array<Forecast> {
    if (this.selMap == null) { return null; }
    const main = this;
    let fcasts: Array<Forecast> = []; 
    if (priority != null) {
      for (const fcast of main.selMap.forecasts) {
        if (!fcast || !fcast.GeoPos || !fcast.GeoPos.Lat) { continue; }
        main.addCityPriority(fcasts, priority, fcast);
      }
    } else {
      fcasts = main.selMap.forecasts;
    }   
    return fcasts;
  }
 
  mkLocIdKey = 'eId';
  mkLocNameKey = 'locName';
  mkNotMonitoredLocIdKey = 'nmeId';
  mkLocLat = 'locLat';
  mkLocLng = 'locLng';

  setMapMarkers(mapForecasts: Array<Forecast>, imgSize: number) {
    if (mapForecasts == null) { return; }
    const locIdKey = this.mkLocIdKey;
    const locNameKey = this.mkLocNameKey;
    const notMonitoredLocIdKey = this.mkNotMonitoredLocIdKey;
    const locLat = this.mkLocLat;
    const locLng = this.mkLocLng;
    const main = this;
    main.removeMarkers();
    const iconsPath = App_UrlManag.weatherIconsPath;
    const circleImgSize = imgSize + 2;

    const locOnMap = main.eventchanger.locOnMapId != null;
    const locOnMapId: number = main.eventchanger.locOnMapId;

    mapForecasts.forEach(function(mapFrcst) {
      const coords = new google.maps.LatLng(mapFrcst.GeoPos.Lat, mapFrcst.GeoPos.Long);
      const circle_icon = MarkerSupport.getCircleIconUrlByBgColor(mapFrcst.weatherData[0].bgCol);
      main.create_Center_Push_ImageMarker(coords, 1, circle_icon, circleImgSize);

      let imgUrl = iconsPath + mapFrcst.weatherData[0].url;
      imgUrl = imgUrl != null ? imgUrl.replace('.png', '.svg'): '';
      const marker = main.create_Center_Push_ImageMarker(coords, 2, imgUrl, imgSize);

      if (locOnMap) {
        const locMapId = mapFrcst.nId != null ? mapFrcst.nId : mapFrcst.eId;
        if (locOnMapId === locMapId) {
          const defMrk = MarkerSupport.createDefaultMarker(main.googleMap, coords, 3);
          main.markers.push(defMrk);
        }
      }

      marker.set(locIdKey, mapFrcst.eId);  // es. id loc monitorata: Manerbio
      marker.set(locNameKey, mapFrcst.locName);  // es. nome loc NON monitorata: Leno
      marker.set(notMonitoredLocIdKey, mapFrcst.nId); // es. id loc NON monitorata: Leno
      marker.set(locLat, mapFrcst.GeoPos.Lat);  // es. Latitudine loc (Manerbio o Leno)
      marker.set(locLng, mapFrcst.GeoPos.Long);  // es. Longitudine loc (Manerbio o Leno)
   
      marker.addListener('click', () => {
        main.markerHandler(marker);
      });
    });
  }

  markerHandler(marker: google.maps.Marker) {
    const locId = marker.get(this.mkLocIdKey);
    const locName = marker.get(this.mkLocNameKey);
    const locIdNotMonitored = marker.get(this.mkNotMonitoredLocIdKey);
    const lat = marker.get(this.mkLocLat);
    const lng = marker.get(this.mkLocLng);
    this.selectLocality(locId, locName, locIdNotMonitored, lat, lng);
  }

  selectLocality(eid: number, locName: string, neid: number, lat: number, lng: number) {
    if (neid != null) {
      const srce = new SearchElement(); 
      srce.elementId = neid; // Leno
      srce.mappedElementId = eid; // Manerbio
      srce.name = locName; // Leno
      srce.geoPos = new GeoCoords(); // Leno
      srce.geoPos.Lat = lat; // Leno
      srce.geoPos.Long = lng; // Leno
      this.eventchanger.ChangeNotMonitLoc(srce, this.globalParameters, true, false);
    } else {
      const se = new Locality();   
      se.elementId = eid; // Manerbio
      se.name = locName; // Manerbio
      se.geoPos = new GeoCoords(); // Manerbio
      se.geoPos.Lat = lat; // Manerbio
      se.geoPos.Long = lng; // Manerbio
      this.eventchanger.ChangeLoc(se, this.globalParameters, true );
    }
  }

  addCityPriority(fcasts: Array<Forecast>, priority: number, item: Forecast) {
    if (item.priority <= priority)  { fcasts.push(item); }
  }

  create_Center_Push_ImageMarker(coords: google.maps.LatLng, zIdx: number, imgUrl: string, imgSize: number): google.maps.Marker {
    const marker = MarkerSupport.createImageMarker(this.googleMap, coords, zIdx, imgUrl, imgSize);
    this.markers.push(marker);
    return marker;
  }

  // Removes the markers from the map and from the array.
  removeMarkers() {
    this.clearMarkers();
    this.markers = [];
  }

  // Removes the markers from the map, but keeps them in the array.
  clearMarkers() {
    this.setMapInAllMarkers(null);
  }

  // Sets the map on all markers in the array.
  setMapInAllMarkers(ggmap) {
    const length = this.markers.length;
    for (let i = 0; i < length; i++) {
      this.markers[i].setMap(ggmap);
    }
  }

  // ------------------------------------- selectHour //-------------------------------------

  public selectHour(index: number) {
    if (this.mapsManag.currentIndex === index) return;
    this.mapsManag.currentIndex = index;
    this.refreshMap();
  }

  public selectUser(usr:any):void {
    if (usr == null) return;
    this.globalParameters.uId = usr.userId;
    this.globalParameters.userName = usr.username;
    this.refreshMap();
  }

  refreshMap() {
    if (this.eventchanger.mapBoundsAreSet()) {
      const bounds = this.eventchanger.activeMapBounds;
      if (bounds.zoom == null) { bounds.zoom = this.googleMap.getZoom(); }
      this.refresh_Map_With_Bounds(bounds);  
    } else {
      this.refresh_Map_Without_Bounds();
    }
  }

// ------------------------------------- refresh_Map_With_Bounds -------------------------------------

  refresh_Map_With_Bounds(mb: GMapBounds) {   
    if (!this.mapsManag.setGlobParam_mId(this.globalParameters)) return;  
    const url = Api_UrlManag.replace_map_bounds_url(this.globalParameters, mb);
    if (url == null) { return; }
    this._DbAccess.getFromDbAndSubscribe<Map>(url, this, this.set_Map_And_Refresh);  
  }

  set_Map_And_Refresh(context: ViewMapComponent, map: Map) {
    context.selMap = map;
    context.refreshMapAndRegions();
  }

  // ----------------------------------- refresh_Map_Without_Bounds -----------------------------------

  refresh_Map_Without_Bounds() {
    //Su evento selectUser viene aggiornato l'utente corrente in this.globalParameters.uId.
    //Se l'oggetto Maps contenuto in this.mapsManag ha un userId diverso dall'utente correntemente
    //selezionato, il metodo this.mapsManag.getUserMapByCurrentIndex() restituisce null e si va a db.
    const map = this.mapsManag.getUserMapByCurrentIndex(this.globalParameters.uId);
    if (map != null) {
      this.set_Map_And_Refresh(this, map);
    } else {
      if (!this.mapsManag.setGlobParam_mId(this.globalParameters)) return;
      const url = Api_UrlManag.replace_single_map_url(this.globalParameters);
      if (url == null) { return; }
      this.remove_Idle_Listener();
      this._DbAccess.getFromDbAndSubscribe<Map>(url, this, this.set_Map_AddIdle_And_Refresh);   
    }
  }

  set_Map_AddIdle_And_Refresh(context: ViewMapComponent, map: Map) {
    context.add_Idle_Listener(context);
    context.selMap = map
    context.refreshMapAndRegions();
  }

// ---------------------------------------- VARIE --------------------------------------------


  viewMap() {
    console.log("v1", "item");
    this.selectedView = MapOptions.Map;
  }

  viewStatistics() {
    console.log("v1", "item");
    this.selectedView = MapOptions.Statistics;
  }

  viewCities() {
    console.log("v1", "item");
    this.selectedView = MapOptions.Cities;
  }

  viewLocations() {
    console.log("v1", "item");
    this.selectedView = MapOptions.Location;
  }

  public selectCityDetail(item) {
    console.log("v1", item);
    this.eventchanger.ChangeLocalityById(item.eId);
  }

  BtnSelectedClass(s: String) {
    if (this.selectedView === s) { return 'btn btn-primary MapDetailsCitiesButton '; }
    return 'btn btn-default MapDetailsCitiesButton';
  }

  ProgressBar(level: number, values: string) {
    const value = +values.replace('%', '').replace(',', '.');
    if (level === 1) {
      if (value >= 30) { return '30%'; } else { return value + '%'; }
    }
    if (level === 2) {
      if (value <= 30) { return '0%'; } else if (value >= 60) { return '30%'; } else if (value < 60) { return value - 30 + '%'; }
    }
    if (level === 3) {
      if (value <= 60) { return '0%'; } else { return value - 60 + '%'; }
    }
  }

  // -------------------------- LISTA REGIONI -------------------- (Ricostruisce la lista per raggruppamento)---------

  public updateLocGroupsByParamType(value: number) {
    if (this.selMap == null) { return; }
    this.groupsParamType = value;
    if (this.openedGroups == null) { this.openedGroups = new Array<string>(); }
    this.groupList = new DetailList();
    this.groupList.groups = new Array<GroupData>();
    let group = new GroupData();
    for (const fcast of this.selMap.forecasts) {
      const grpName = fcast.region;
      if (group.groupBy !== grpName) {
        group = this.groupList.groups.find(grp => grp.groupBy === grpName);
        if (group == null) {
          group = new GroupData();
          group.groupBy = grpName;
          group.items = new Array<DataItem>();
          group.closed = !this.openedGroups.some(x => x === group.groupBy);
          this.groupList.groups.push(group);
        }
      }
      const item = new DataItem();
      item.cVal = fcast.weatherData[value].cVal;
      item.locName = fcast.locName;
      item.eId = fcast.eId;
      item.score = fcast.weatherData[value].score;
      item.value = fcast.weatherData[value].value;
      item.bgCol = fcast.weatherData[value].bgCol;
      item.txCol = fcast.weatherData[value].txCol;
      group.items.push(item);
    }

    this.groupList.SortAllInnerData();

  }

  public areaCollapse(value: GroupData) {
    if (value.closed) {
      this.openedGroups.push(value.groupBy);
      value.closed = false;
    } else {
      value.closed = true;
      this.openedGroups.splice(this.openedGroups.indexOf(value.groupBy), 1);
    }
  }

  public ButtonSelected(value: number) {
    if (this.groupsParamType === value) {
      return 'btn-primary collapsed btn btn-sm';
    } else {
      return 'btn-default collapsed btn btn-sm';
    }
  }

// ---------------------------------------- setMapSummary --------------------------------------------

  setMapSummary() {
    const main = this;
    if (main.selMap.mapSummary != null) {
      if (main.selMap.mapSummary.model === 'Statistics') {
        if (main.selMap.mapSummary.eval === 'Red') {
          main.MapStatisticsBackgroundColor = '#d9534f';
          main.MapStatisticsForegroundColor = '#ffffff';
        }
        if (main.selMap.mapSummary.eval === 'Yellow') {
          main.MapStatisticsBackgroundColor = '#f0ad4e';
          main.MapStatisticsForegroundColor = '#ffffff';
        }
        if (main.selMap.mapSummary.eval === 'Green') {
          main.MapStatisticsBackgroundColor = '#72BA55';
          main.MapStatisticsForegroundColor = '#ffffff';
        }
        if (main.selMap.mapSummary.eval === 'Azure') {
          main.MapStatisticsBackgroundColor = '#5bc0de';
          main.MapStatisticsForegroundColor = '#ffffff';
        }
        if (main.selMap.mapSummary.eval === 'Gold') {
          main.MapStatisticsBackgroundColor = '#337ab7';
          main.MapStatisticsForegroundColor = '#ffffff';
        }
        let prc = 33;
        main.LegendFontSize = '11';
        main.ValueFontSize =  '14';
        if (main.mapWidth >= 520) {
          main.LegendFontSize = '11';
          main.ValueFontSize =  '14';
        }
        if (main.mapWidth >= 700) {
          main.LegendFontSize = '13';
          main.ValueFontSize =  '15';
        }
        if (main.mapWidth >= 830) {
          main.LegendFontSize = '15';
          main.ValueFontSize =  '15';
        }
        if (main.mapWidth >= 540) { prc = 20; }
        main.MapStatistics = (main.selMap.mapSummary.model === 'Statistics');
        main.MapCalendar = false;
        main.ViewStatisticsButton = (main.selMap.mapSummary.model === 'Statistics');
        main.MapStatisticsW = (main.mapWidth / 100 * prc);
        main.MapStatisticsX = main.mapWidth - main.MapStatisticsW - 3;
        main.Lb1 = main.selMap.mapSummary.content[0];
        main.Vl1 = main.selMap.mapSummary.content[1];
        main.Lb2 = main.selMap.mapSummary.content[2];
        main.Vl2 = main.selMap.mapSummary.content[3];
      }
      if (main.selMap.mapSummary.model === 'Calendar') {
        main.LegendCalendarFontSize1 = '12';
        if (main.mapWidth >= 520) { main.LegendCalendarFontSize1 = '12'; }
        if (main.mapWidth >= 700) { main.LegendCalendarFontSize1 = '12'; }
        if (main.mapWidth >= 830) { main.LegendCalendarFontSize1 = '12'; }
        main.LegendCalendarFontSize2 = '36';
        if (main.mapWidth >= 520) { main.LegendCalendarFontSize2 = '36'; }
        if (main.mapWidth >= 700) { main.LegendCalendarFontSize2 = '36'; }
        if (main.mapWidth >= 830) { main.LegendCalendarFontSize2 = '36'; }

        main.MapCalendar = (main.selMap.mapSummary.model === 'Calendar');
        let pc = 15;
        // Rendo invisibile qualora sono sotto 520
        if (main.mapWidth <= 420) { pc = 30; }

        main.MapStatistics = false;
        main.ViewStatisticsButton = false;
        main.MapCalendarW = (main.mapWidth / 100 * pc);
        main.MapCalendarX = main.mapWidth - main.MapCalendarW - 3;
        main.weekday = main.selMap.mapSummary.content[0];
        main.dayofmonth = main.selMap.mapSummary.content[1];
        main.hour = main.selMap.mapSummary.content[2];
      }
    } else {
      main.MapStatistics = false;
      main.ViewStatisticsButton = false;
      main.MapCalendar = false;
    }
  }
}
