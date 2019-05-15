// import { } from '@types/googlemaps';
import { GMapOptions, GMapBounds, ScreenSize, ScreenOptions } from '../entities/googleSup';
import {ActivatedRouteSnapshot} from "@angular/router";

export class DetailList {

  groups: GroupData[];

  SortAllInnerData() {
    this.SortGroups();
    this.SortGroupsInnerItems();
  }

  SortGroups() {
    this.groups.sort((a, b) => {
      if (a.groupBy < b.groupBy) { return -1; }
      if (a.groupBy > b.groupBy) { return 1; }
      return 0;
    });
  }

  SortGroupsInnerItems() {
    this.groups.forEach(grp => {
      if (grp.items != null) {
          grp.items.sort((a, b) => {
            if (a.locName < b.locName) { return -1; }
            if (a.locName > b.locName) { return 1; }
            return 0;
        });
      }
    });
  }
}

export class GroupData {
  groupBy: string;
  closed: boolean;
  items: DataItem[];
}

export class DataItem {
  locName: string;
  value: string;
  cVal: string;
  score: string;
  bgCol: string;
  eId: number;
  txCol: string;
}

export class UrlNavs {
  refreshIssueDate: string;
  refreshDeadLine: string;
  refreshUser: string;
  refreshRegion: string;
  refreshCategory: string;
  locOnMap: string;
  changeWithBounds: string;
  refreshLoc: string;
  localities: string;
}

export class GlobalParameters {
  uId: number;
  userName: string;
  rId: number;
  cId: number;
  forecastIssueDate: string;
  forecastDeadLineDate: string;
  mId?: any;
  rankingBy: number;
  rankingScope: number;
  culture: string;
  urlNavs: UrlNavs;
  serverInfo: ServerInfo;
}

export class ServerInfo {
  message: string;
  msgTypeId: string;
}

export class Region {
  regionMapUrl: string;
  regionId: number;
  region: string;
}

interface ILocality {
  elementId: number;
  name: string;
  geoPos: GeoCoords;
}

export class Locality implements ILocality {
  elementId: number;
  name: string;
  geoPos: GeoCoords;
}

export class Localities {
  categoryId: number;
  regionId: number;
  localities: Locality[];
}

export class PredictionType {
  predictionId: number;
  predictionName: string;
  maxScore: number;
}

export class PredictionOption {
  optionId: number;
  predictionId: number;
  name: string;
  iconUrl: string;
}

export class ParametersResources {
  categoryId: number;
  culture: string;
  predictionTypes: PredictionType[];
  predictionOptions: PredictionOption[];
}

export class Resources {
  regions: Region[];
  localities: Localities;
  parametersResources: ParametersResources;
}

export class SelectedRegion {
  regionMapUrl: string;
  regionId: number;
  region: string;
  mapHorizontalOffset: number;
  mapVerticalOffset: number;
  widthRatio: number;
  imageWidth: number;
  imageHeight: number;
  mapRootCoords?: MapRootCoords;
}

export class MapRootCoords {
  coord_Y_Initial: number;
  coord_Y_Final: number;
  coord_X_Initial: number;
  coord_X_Final: number;
}

export class Labels {
  checkPastForecastsLbl: string;
  forecastCoordLbl: string;
  byLbl: string;
}

export class ForwardDay {
  daysFromToday: number;
  label: string;
  dateStr: string;
}

export class TimeLineBars {
  labels: Labels;
  forwardDays?: ForwardDay[];
}

export class Labels2 {
  positionLbl: string;
  forecasterLbl: string;
  rankAccuracyLbl: string;
  rankAvgScoreLbl: string;
  rankTotScoreLbl: string;
}

export class UserItem {
  userId: number;
  username: string;
}

export class UserDropDown extends UserItem {
  selected: boolean;
  logo?: string;
}

export class UsersRanking extends UserItem {
  PositionByTotScore: number;
  PositionByAverage: number;
  PositionByAccuracy: number;
  ScoreByTotal: string;
  ScoreByAverage: string;
  ScoreByAccuracy: string;
  totPredictions: number;
  totCorrectPredictions: number;
  totIncorrectPredictions: number;
  maxScore: number;
}

export class Ranking {
  labels: Labels2;
  category?: any;
  rankingBy: number;
  rankingScope: number;
  usersRanking: UsersRanking[];
}

export class Favoriting {
  labels: Labels2;
  category?: any;
  rankingBy: number;
  rankingScope: number;
  usersRanking: UsersRanking[];
}

export class LabelsForMapScore {
  maxScoreLbl: string;
  totScoreLbl: string;
  scoreOnMaxScoreLbl: string;
  totPredictionsLbl: string;
  totCorrectPredictionsLbl: string;
  percOfCorrectPredictionsLbl: string;
}

export class LabelsForForecasts {
  localityNameLbl: string;
  valueLbl: string;
  correctValueLbl: string;
  scoreLbl: string;
}

export class Maturity {
  maturityId: number;
  daysToMaturity: number;
  hourOfDay: number;
}

export class MapScore {
  totScoreString: string;
  totalScore: number;
  maxScore: number;
  scoreOnMaxScore: string;
  scoreOnMaxScoreNum: number;
  totPredictions: number;
  totCorrectPredictions: number;
  percOfCorrectPredictions: string;
  percOfCorrectPredsNum: number;
}

export class GeoCoords {
  Lat: number;
  Long: number;
}

// N.B. E' la sola classe utilizzata per l'acquisizione dei dati delle previsioni a db.
export class PredictionAndScore {
  id: number;
  value: string;
  url: string;
  cVal?: string;
  cUrl?: string;
  score?: string;
  txCol?: string;
  bgCol?: string;
  topRating?: boolean;
}

export class Forecast {
  eId: number;
  locName: string;
  GeoPos: GeoCoords;
  priority: number;
  region: string;
  nId?: number;
  weatherData: PredictionAndScore[];
}

export class Map {
  maturity: Maturity;
  maturityDateLabel: string[];
  mapScore: MapScore;
  forecasts: Forecast[];
  mapSummary: MapSummary;
  zoomInfo?: ZoomSetting; 
}

export class ZoomSetting {
  zoom: number;
  inhabitants: number;
  imgSize: number;
}

export class MapSummary {
  arrLabels: Array<string>;
  arrValues: Array<string>;
  model: string;
  content: Array<string>;
  eval: string;
}

export class Maps {
  labelsForMapScore: LabelsForMapScore;
  labelsForForecasts: LabelsForForecasts;
  userId: number;
  userName: string;
  issueDateLabel: string[];
  hoursBarInfo: HoursBar;
  mapList: Map[];
  options?: GMapOptions;
  bounds?: GMapBounds;
}

export class MapsManag {

  public static zoomLimit = 8;

  zoomInit = false;
  boundsInit = false;

  defUserMaps: Maps;
  hoursBarInfo: HoursBar;
  evtChanger: EventChanger;
  currentIndex: number = -1;

  allMapsValued = false;

  constructor(maps: Maps, hoursBar: HoursBar, evtChngr: EventChanger) {
    this.defUserMaps = maps;
    this.allMapsValued = this.allMapsAreValued();
    this.hoursBarInfo = hoursBar;
    this.evtChanger = evtChngr;
    this.currentIndex = this.getDefaultCurrentIndex();
  }

  screenType: ScreenSize = null;
  // screenType_Zoom: ScreenSize = null;

  currentZoom: number = null;  // N.B. se non è mai stato modificato lo zoom, è nullo

  allMapsAreValued() {
    const maps = this.defUserMaps;
    if (maps == null) return false;
    if (maps.mapList == null) return false;
    if (maps.mapList.length == null) return false;
    let atLeastOneEmpty = false;
    maps.mapList.forEach(map => {
      if (atLeastOneEmpty === true) { return; }
      atLeastOneEmpty = this.mapForecasts_KO(map);
    });
    return atLeastOneEmpty === false;  
  }

  public mapForecasts_KO(map: Map): boolean {
    if (map == null) return true;
    if (map.forecasts == null) return true;
    return (map.forecasts.length < 1);
  }


  public getDefaultCurrentIndex() {
    if (this.hoursBarInfo != null) {
      return (this.hoursBarInfo.index == null) ? 0 : this.hoursBarInfo.index;
    } else {
      return 0;
    }
  }

  setGlobParam_mId(globPrms: GlobalParameters) { 
    const selMap = this.getMapByCurrentIndex();
    if (selMap == null) return false;
    if (selMap.maturity == null) return false;
    globPrms.mId = selMap.maturity.maturityId;  
    return true;
  }

  public getUserMapByCurrentIndex(uId: number): Map {
    if (!this.allMapsValued) return null;
    if (this.defUserMaps == null) return null;
    if (this.defUserMaps.userId !== uId) return null;
    return this.getMapByCurrentIndex();
  }

  public getMapByCurrentIndex(): Map {
    if (this.defUserMaps == null) return null;
    if (this.defUserMaps.mapList == null) return null;
    const index = this.currentIndex;
    if (this.defUserMaps.mapList.length <= index) return null;
    return this.defUserMaps.mapList[index];
  }

  //PER ORA INUTILIZZATO
  public setScreenBySize(areawidth: number) {
    this.screenType = ScreenOptions.getScreenBySize(areawidth);
  }

  public getZoomState(zoom: number): ZoomState {
    if (this.evtChanger.mapBoundsAreSet()) {
      // E' stato attivato un evento globale (EventChanger.ChangeUser, EventChanger.ChangeDeadlineDate etc.)
      // gestito dal timer nel viewLoader, mentre l'oggetto EventChanger.activeMapBounds era impostato sui confini  
      // della mappa modificati tramite lo zoom o il trascinamento (con livello di zoom superiore a 7). 
      // Aggiornato l'oggetto maps del componente viewMap, scatta la relativa function di aggiornamento che 
      // richiama renderGoogleMap(). Vengono aggiornati i google Markers direttamente sulle Forecast della selMap 
      // senza ulteriori filtri che vengono effettuati normalmente sulle 189 località canoniche caricate 
      // di default senza zoom.
      return ZoomState.Active_Over_Level_7;
    } else {
      if (this.check_Zoom_Under_Level_8(zoom)) {
        // E' già stato attivato almeno una volta lo zoom NON SUPERIORE AL LIVELLO 7; 
        // Il livello di priorità delle località da visualizzare sulla mappa 
        // lo imposto in base al livello di zoom considerando il campo this.screenType_Zoom.
        return ZoomState.Active_Within_Level_7;
      } else {
        // Lo zoom non è mai stato attivato; La priority delle località la ricavo da this.screenType.
        return ZoomState.Active_Over_Level_7;
      }
    }
  }


  // ----------------------------------------

  public check_bounds_changed(zoom: number) {   
    const ok = this.checkBounds(zoom);
    // if (ok) { this.screenType_Zoom = null; }
    return ok;
  }

  public checkBounds(zoom: number) {
    if (this.boundsInit === false) {
      this.boundsInit = true;
      return false;
    } else {
      this.currentZoom = zoom;
      return zoom >= MapsManag.zoomLimit;
    }
  }

  public check_zoom_changed_under_level_8(zoom: number) {
    if (this.check_Zoom_Under_Level_8(zoom)) {
      // Lo zoom è attivo, ma sotto il livello 8. I dati delle previsioni vengono recuperati senza 
      // specificare i mapBounds, ovvero i limiti della mappa entro i quali acquisire le previsioni.
      this.evtChanger.set_Map_Bounds(null);
      // const screenTp = ScreenOptions.getScreenTypeByZoomLevel(zoom);
      if (this.currentZoom !== zoom) {
        this.currentZoom = zoom;
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  public check_Zoom_Under_Level_8(zoom: number) {
      return zoom < MapsManag.zoomLimit;
  }

 
// ------------------------------------------ getMapIconsSize() ----------------------------------------

  defImgSize = 30;
  baseZoom = 5;
  incremental = 5;
  maxSize = 60;

  public getMapIconsSize(zoom: number, maps: Maps) {
    const size = this.getImageSize(maps);
    if (size) {
      return size;
    } else {
      return this.calcImageSizeByZoom(zoom);
    }
  }

  calcImageSizeByZoom(zoom: number) {
    const diff = zoom - this.baseZoom;
    const incr = diff * this.incremental;
    const res = this.defImgSize + incr;
    return res > this.maxSize ? this.maxSize : res;    
  }

  getImageSize(maps: Maps) {
    if (maps.bounds == null) {
      return null;
    } else {
      if (maps.bounds.zoomInfo == null) {
        return null;
      } else {
        if (maps.bounds.zoomInfo.imgSize == null) {
            return null;
        } else {
          return maps.bounds.zoomInfo.imgSize;
        }
      }
    }
  }
  
}

export enum ZoomState {
  Never_Activated = 0, Active_Within_Level_7 = 1, Active_Over_Level_7 = 2
}

export class HoursBar {
  index: number;
  hours: Array<string>;
}

export class CDData {
  globalParameters: GlobalParameters;
  resources: Resources;
  selectedRegion: SelectedRegion;
  timeLineBars: TimeLineBars;
  ranking: Ranking;
  maps: Maps;
  localityForecasts?: LocalityForecasts;
}

export class LocalityForecasts {
  currentLocality: SearchElement;
  issueDateLabel: Array<string>;
  dayForecasts: Array<DayForecast>;
}

export class DayForecast {
  maturityDateLabel: Array<string>;
  usersForecasts: Array<UserForecast>;
}

export class UserForecast {
  userId: number;
  userPredictions: Array<PredictionAndScore>;
  username: string;
  webSiteUrl: string;
  userLogo?: string;
}

// ---------------------------- DynamicRes ------------------------

export class DynamicResManager {

  dynamicRes: DynamicRes;

  public buildSearchArray(dynamRes: DynamicRes): Array<string> {
    const locsArray = new Array<string>();
    if (dynamRes == null) { return locsArray; }
    this.dynamicRes = dynamRes;
    for (const loc of dynamRes.filteredLocalities) {
      locsArray.push(loc.name);
    }
    return locsArray;
  }

  public findSearchLocalityByModel(model: any)  {
    if (this.dynamicRes == null) { return null; }
    model = model.toLowerCase();
    for (const loc of this.dynamicRes.filteredLocalities) {
      if (loc.name.toLowerCase() === model) { return loc; }
    }
    return null;
  }
}

export class DynamicRes {

  filteredLocalities: Array<SearchElement>;

}

export class SearchElement implements ILocality {

  elementId: number;
  name: string;
  geoPos: GeoCoords;
  mappedElementId?: number;
  mappedElementName?: string;

  public changeLocality(locality: Locality) {
    this.elementId = locality.elementId;
    this.name = locality.name;
    this.mappedElementId = null;
    this.mappedElementName = null;
    this.geoPos = locality.geoPos;
  }
}

export class LocalityInfo {
  elementId: any;
  notMonitoredElementId?: any;

  Lat?: number;
  Long?: number;

  public static getLocalityInfo(se: SearchElement, loc: Locality): LocalityInfo {
    if (se) {
      return this.getLocalityInfoBySearchElement(se);
    } else {
      return this.getLocalityInfoByLocality(loc);
    }
  }

  public static getLocalityInfoBySearchElement(se: SearchElement): LocalityInfo {
    if (se == null) return null;
    if (se.geoPos == null) return null;
    if (se.geoPos.Lat == null) return null;
    const locInfo = new LocalityInfo();
    if (se.mappedElementId != null) {
      locInfo.elementId = se.mappedElementId;
      locInfo.notMonitoredElementId = se.elementId;
    } else {
      locInfo.elementId = se.elementId;
      locInfo.notMonitoredElementId = null;
    }
    locInfo.setGeoCoords(se.geoPos);
    return locInfo;
  }

  public static getLocalityInfoByLocality(loc: Locality): LocalityInfo {
    if (loc == null) return null;
    if (loc.geoPos == null) return null;
    if (loc.geoPos.Lat == null) return null;
    const locInfo = new LocalityInfo();
    locInfo.elementId = loc.elementId;
    locInfo.notMonitoredElementId = null;
    locInfo.setGeoCoords(loc.geoPos);
    return locInfo;
  }

  setGeoCoords(gc: GeoCoords) {
    this.Lat = gc.Lat;
    this.Long = gc.Long;
  }

}

// ---------------------------- support ------------------------

export class EventChanger {
  eventname: string;
  eventLocality?: SearchElement;
  Executed: boolean;
  issueDate: string;
  deadlineDate: string;
  userId: number;
  userName: string;
  activeMapBounds: GMapBounds;
  localities: Localities;

  locOnMapId?: number;

  homeUrl = App_UrlManag.HomeUrl;


  public set_Map_Bounds(mapBounds: GMapBounds) {
    this.activeMapBounds = mapBounds;
  }

  public mapBoundsAreSet(): boolean {
    return this.activeMapBounds != null;
  }

  public static checkDateStrings(dateStr1: string, dateStr2: string): boolean {
    if (dateStr1 == null) { return null; }
    if (dateStr2 == null) { return null; }
    const arr1 = dateStr1.split('-');
    const arr2 = dateStr2.split('-');
    let result = true;
    for (let i = 0; i < arr1.length; i++) {
      const num1 = parseInt(arr1[i], 10);
      const num2 = parseInt(arr2[i], 10);
      if (num1 !== num2) {
        result = false;
        break;
      }
    }
    return result;
  }

  public isFirstLoad(): boolean {
    return (this.eventname == null);
  }

  public isLocalityEvent(): boolean {
    return (this.eventname === EventsList.ChangeLocality || this.eventname === EventsList.LocOnMap);
  }

  public tryToReplaceLocGeoPos(url: string): string {
    const loc = this.eventLocality;
    if (loc == null) { return url; }
    if (loc.geoPos == null) { return url; }
    return Api_UrlManag.replace_lat_long_params(url, loc.geoPos.Lat, loc.geoPos.Long);
  }

  public changeHour() {
    // Non setta this.Executed = false perchè i dati delle previsioni su mappa di tutte le ore del giorno
    // corrente, sono stati restituiti nel json su primo caricamento.
    this.eventname = EventsList.ChangeHour;
  }

  //-----------------------------------  IssueDate - DeadlineDate ----------------------------------

  // 1 - IssueDate
  public update_IssueDate(dateSrt:string) {
    if (this.eventname===EventsList.ChangeLocality)
    {
      this.issueDate=dateSrt;
      this.Executed=false;
    }
    else
    {
      this.changeIssueDate(dateSrt);
    }
  }

  // 2 - DeadlineDate
  public update_DeadlineDate(dateSrt:string) {
    if (this.eventname===EventsList.ChangeLocality)
    {
      this.deadlineDate=dateSrt;
      // this.issueDate=null;
      this.Executed=false;
    }
    else
    {
      this.changeDeadlineDate(dateSrt);
    }
  }

  // 3 - IssueDeadlineDate
  public update_IssueDeadlineDate(dateSrt:string) {
    if (this.eventname===EventsList.ChangeLocality)
    {
      this.issueDate = dateSrt;
      this.deadlineDate = dateSrt;
      this.Executed=false;
    }
    else
    {
      this.changeIssueDeadlineDate(dateSrt);
    }
  }

  // 1 - IssueDate
  public changeIssueDate(newdate: string) {
    this.eventname = EventsList.ChangeIssueDate;
    this.issueDate = newdate;
    this.Executed = false;
  }

  // 2 - DeadlineDate
  public changeDeadlineDate(newdate: string) {
    this.eventname = EventsList.ChangeDeadlineDate;
    this.deadlineDate = newdate;
    this.Executed = false;
  }

  // 3 - IssueDeadlineDate
  public changeIssueDeadlineDate(newdate: string) {
    this.eventname = EventsList.ChangeIssueDeadlineDate;
    this.issueDate = newdate;
    this.deadlineDate = newdate;
    this.Executed = false;
  }

  //---------------------------------------------------------------------------------------------------


  public refreshUser(item: UserItem) {
    this.eventname = EventsList.ChangeUser;
    this.userId = item.userId;
    this.userName = item.username;
    this.Executed = false;
  }

  public ChangeLocalityById(elementId: number) {
    let loc = this.findLocalityById(elementId);
    if (loc == null) {
      loc = new Locality();
      loc.elementId = elementId;
    }
  }

  public ChangeLoc(loc: Locality, gp: GlobalParameters, resetUrl: boolean) {
    this.eventname = EventsList.ChangeLocality;
    
    if (this.eventLocality == null) { this.eventLocality = new SearchElement(); }
    this.eventLocality.changeLocality(loc);
  
    if (resetUrl) { this.ResetHomeUrl(null, loc, gp); }     
    this.Executed = false;
  }

  public ChangeNotMonitLoc(se: SearchElement, gp: GlobalParameters, resetUrl: boolean, executed: boolean) {
    this.eventname = EventsList.ChangeLocality;
    this.eventLocality = se;
    if (resetUrl) { this.ResetHomeUrl(se, null, gp); }     
    this.Executed = executed;
  }

  public ResetHomeUrl(se: SearchElement, loc: Locality, gp: GlobalParameters) {
    const locInfo = LocalityInfo.getLocalityInfo(se, loc);
    if (locInfo == null) { return; }
    this.homeUrl = App_UrlManag.get_locOnMap_FrontEnd_App_Url(locInfo, gp);
  }

  public setLocOnMap() {
    this.eventname = EventsList.LocOnMap;
    this.Executed = false;
  }
 
  public get_Current_LocalityInfo(): LocalityInfo {
    return LocalityInfo.getLocalityInfoBySearchElement(this.eventLocality);
  }

  public get_Locality_Name(data: CDData) {
    var locName = this.getLocalityName(this.eventLocality);
    if (locName) {
      return locName;
    } else {
      locName = this.getLocalityName(data.localityForecasts.currentLocality);
      return locName != null ? locName : '';
    }
  }

  public getLocalityName(loc: SearchElement) {
    if (loc) {
      return loc.name;
    } else {
      return null;
    }
  }

  //Serve per il reindirizzamento ai siti meteo di origine.
  public tryToReplaceLocalityName(url: string) {
    const notMonitLoc = this.eventLocality;
    if (notMonitLoc) {
      if (notMonitLoc.mappedElementName && notMonitLoc.name) {
        url = url.replace(notMonitLoc.mappedElementName.toLowerCase(), notMonitLoc.name.toLowerCase());
      }
    }
    return url;
  }

  public viewMap() {
    this.eventname = EventsList.LoadMaps;
    this.Executed = false;
  }

  public viewCities() {
    this.eventname = EventsList.LoadCities;
    this.Executed = false;
  }

  public findLocalityById(id: number) {
    if (this.localities == null) { return null; }
    const locs = this.localities.localities;
    if (locs == null) { return null; }   
    for (let loc of locs) {
      if (loc.elementId === id) return loc; 
    };
    return null;
  }

  public findLocalityByName(name: string) {
    
    if (this.localities == null) { return null; }
    const locs = this.localities.localities;
   
    if (locs == null) { return null; }   
    name = name.toLowerCase();
    for (let loc of locs) {
      if (loc.name.toLowerCase() === name) return loc; 
    };
    return null;
  }

  public isMobile() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) { check = true; }})(navigator.userAgent||navigator.vendor);
    return check;
  }

}

export class MapOptions {
  public static Cities = 'Cities';
  public static Map = 'Map';
  public static Statistics = 'Statistics';
  public static Location = 'Location';
}

export class EventsList {
  public static ChangeLocality = 'Change locality';
  public static ChangeIssueDeadlineDate = 'Change issue deadline date';
  public static ChangeIssueDate = 'Change issue date';
  public static ChangeDeadlineDate = 'Change deadline date';
  public static ChangeUser = 'Change user';
  public static LoadMaps = 'Load maps';
  public static LoadCities = 'Load cities';
  public static LocOnMap = 'Loc On Map';
  public static ChangeHour = 'Change Hour';
  public static LocSectionExpand = 'Loc Section Expand';
}

export class ViewModes {
  public static home = 'home';
  public static homeloc = 'homeloc';
  public static rank = 'rank';
  public static favorite = 'favorite';
  public static map = 'map';
  public static loc = 'loc';
  public static homelocbyid = 'homelocbyid';
  public static homelocgeoloc = 'homelocgeoloc';
  public static loconmap = 'loconmap';
}

export class App_UrlManag {

  public static AppDomain = 'https://app.meteodrome.it/';
  public static HomeUrl = App_UrlManag.AppDomain + ViewModes.home;
  public static HomeLocUrl = App_UrlManag.AppDomain + ViewModes.homeloc;
  public static MapUrl = App_UrlManag.AppDomain + ViewModes.map;
  public static resources = 'account/resources/';
  public static logos = App_UrlManag.resources + 'loghi/';
  public static icons = App_UrlManag.resources + 'icons/';
  public static images = App_UrlManag.resources + 'images/';
  public static weatherIconsPath = 'account/resources/icons/weathericons/';
  public static map = 'map';


  public static logo = 'logo_meteodrome.png';
  public static logo_compact = 'logo_meteodrome_compact.png';

  public static get_locOnMap_FrontEnd_App_Url(lc: LocalityInfo, gp: GlobalParameters ) {    
    let url = Api_UrlManag.replace_locOnMap_FrontEnd_App_Url(lc, gp);
    return App_UrlManag.AppDomain + url;
  }

  public static get_map_FrontEnd_App_Url(gp: GlobalParameters ) {    
    let url = Api_UrlManag.replace_sectionMap_Url(gp.uId, gp.rId, gp.cId, gp.forecastIssueDate,
                                                  gp.forecastDeadLineDate, gp.userName, gp.culture);                                                
    return App_UrlManag.AppDomain + App_UrlManag.map + '/' + url;
  }

  // public static replace_png_with_swg(url: string) {
  // }

}

export class Api_UrlManag {

  // public static urlDomain = 'http://localhost:9213/api/';
  public static urlDomain = 'https://meteohubwebapi.azurewebsites.net/api/';

  public static eId = '{eId:int}';
  public static neId = '{neId:int?}';
  public static uId = '{uId:int}';
  public static rId = '{rId:int}';
  public static cId = '{cId:int}';
  public static userName = '{userName}';
  public static forecastIssueDate = '{forecastIssueDate}';
  public static forecastDeadLineDate = '{forecastDeadLineDate}';
  public static culture = '{culture}';
  public static cultNull = '{culture?}';

  public static rankingBy = '{rankingBy:int?}';
  public static rankingScope = '{rankingScope:int?}';
  public static mId_Nullable = '{mId:int?}';
  public static mId = '{mId:int}';

  public static zoom = '{zoom:int}';
  public static minLat = '{minLat:double}';
  public static maxLat = '{maxLat:double}';
  public static minLng = '{minLng:double}';
  public static maxLng = '{maxLng:double}';

  public static lat = '{lat:double}';
  public static lng = '{lng:double}';

  public static def_Culture = 'it-IT';
  public static def_rId = '307';
  public static def_cId = '4';

  public static locEmptyPath = ' ';

  public static search = '{search}';

  // private static defaultLocalityId = '3066';

  public static compareEval = 'CompareEval/';

  public static homeLocByIdUrl = Api_UrlManag.urlDomain + 'loc/homeLocById/';
  public static homeLocGeoloc = Api_UrlManag.urlDomain + 'loc/homeLocGeoloc';

  public static homeLocByIdParams = "{eId:int}/{rId:int}/{culture?}/{neId:int?}";

  public static sectionRankUrl = 'CompareEval/sectionRankLoad/{rId:int}/{cId:int}/{culture}';
  public static rankUrl_OptionPrms =  '/{rankingBy:int?}/{rankingScope:int?}/{mId:int?}';

  public static locViewUrl = Api_UrlManag.urlDomain + 'loc/homeLoc/';
  public static sectionMapFirstLoadUrl = Api_UrlManag.urlDomain + 'CompareEval/sectionMapFirstLoad/it-IT';

  public static sectionMapLoad = 'CompareEval/sectionMapLoad/';
  public static mapRefreshBounds = 'CompareEval/mapRefreshBounds/';
  public static mapRefresh = 'CompareEval/mapRefresh/';
  public static mapBoundsParams = '/{zoom:int}/{minLat:double}/{maxLat:double}/{minLng:double}/{maxLng:double}';


  public static mapParams = '{uId:int}/{rId:int}/{cId:int}/{forecastIssueDate}';
  public static mapParamsEnd = '/{forecastDeadLineDate}/{userName}/{culture}';

  public static locOnMap = "locOnMap/{eId:int}/{rId:int}/{cId:int}/{forecastIssueDate}/{forecastDeadLineDate}/{culture}/{lat:double}/{lng:double}/{neId:int?}";

    // ------------------------------ locOnMap ---------------------------------

    public static get_locOnMap_WebApi_Url(snapshot: ActivatedRouteSnapshot, evtChanger: EventChanger) {
      let url = this.compareEval + this.locOnMap;
      const prms = snapshot.params;
      const eid = prms[RouteParams.eId];
      const neid = prms[RouteParams.neId];
      const locOnMapId = neid == null ? eid : neid;
      evtChanger.locOnMapId = parseInt(locOnMapId, 10);
      url = this.try_to_Replace_LocInfo(url, eid, neid);
      url = this.replaceNumber(url, this.rId, prms[RouteParams.rId]);
      url = this.replaceNumber(url, this.cId, prms[RouteParams.cId]);
      url = url.replace(this.forecastIssueDate, prms[RouteParams.forecastIssueDate]);
      url = url.replace(this.forecastDeadLineDate, prms[RouteParams.forecastDeadLineDate]);
      url = url.replace(this.culture,  prms[RouteParams.culture]);
      url = Api_UrlManag.replace_lat_long_params(url, prms[RouteParams.lat], prms[RouteParams.lng]);
      return this.urlDomain + url;
    }

    public static replace_locOnMap_FrontEnd_App_Url(lc: LocalityInfo, globPrms: GlobalParameters ) {                                           
      let url = this.locOnMap;
      url = this.try_to_Replace_LocInfo(url, lc.elementId, lc.notMonitoredElementId);
      url = this.replaceNumber(url, this.rId, globPrms.rId);
      url = this.replaceNumber(url, this.cId, globPrms.cId);
      url = url.replace(this.forecastIssueDate, globPrms.forecastIssueDate);
      url = url.replace(this.forecastDeadLineDate, globPrms.forecastDeadLineDate);
      url = url.replace(this.culture,  globPrms.culture);
      return Api_UrlManag.replace_lat_long_params(url, lc.Lat, lc.Long);
    }
  
  // ------------------------------ sectionMap ---------------------------------

  public static get_sectionMap_Url(snapshot: ActivatedRouteSnapshot) {
    const prms = snapshot.params;
    var userId: string = prms[RouteParams.uId];
    var url = null;
    if (userId == null) {
      url = Api_UrlManag.sectionMapFirstLoadUrl;
    } else {
      url = Api_UrlManag.replace_sectionMap_Url(userId,
        prms[RouteParams.rId], prms[RouteParams.cId], prms[RouteParams.forecastIssueDate],
        prms[RouteParams.forecastDeadLineDate], prms[RouteParams.userName], prms[RouteParams.culture]);
      url =  this.urlDomain +  Api_UrlManag.sectionMapLoad + url;
    }
    return url;
  }

  public static replace_sectionMap_Url(uId: any, rId: any, cId: any, issueDate: any, deadLineDate: any, userName: any, culture: any) {
    let mapparams = Api_UrlManag.replace_common_map_params(uId, rId, cId, issueDate);
    let lastSegment = Api_UrlManag.mapParamsEnd;
    lastSegment = lastSegment.replace(this.forecastDeadLineDate, deadLineDate);
    lastSegment = lastSegment.replace(this.userName, userName);
    if (culture == null) { culture = this.def_Culture; }
    lastSegment = lastSegment.replace(this.culture, culture);
    return mapparams + lastSegment;
  }

  // ------------------------------ RefreshBounds ---------------------------------

  public static replace_map_bounds_url(globPrms: GlobalParameters, bounds: GMapBounds) {
    let mapParams = Api_UrlManag.replace_single_map_params(globPrms); // compreso param /mId                                                   
    let mapBoundsPrms = Api_UrlManag.replace_map_bounds_params(bounds); // da /zoom/...
    return this.urlDomain + Api_UrlManag.mapRefreshBounds + mapParams + mapBoundsPrms;
  }

  public static replace_single_map_url(globPrms: GlobalParameters) {
    let mapParams = Api_UrlManag.replace_single_map_params(globPrms); // compreso param /mId                                                   
    return this.urlDomain + Api_UrlManag.mapRefresh + mapParams;
  }

  public static replace_single_map_params(glbPrms: GlobalParameters) {
    const url = this.replace_common_map_params(glbPrms.uId, glbPrms.rId, glbPrms.cId, glbPrms.forecastIssueDate);
    return url + '/' + glbPrms.mId.toString();
  }

  public static replace_common_map_params(uId: any, rId: any, cId: any, issueDate: any) {
    let url = Api_UrlManag.mapParams;
    url = url.replace(this.uId, uId.toString());
    url = url.replace(this.rId, rId.toString());
    url = url.replace(this.cId, cId.toString());
    url = url.replace(this.forecastIssueDate, issueDate);
    return url;
  }

  public static replace_map_bounds_params(bounds: GMapBounds) {
    return this.replace_map_bounds_base_params(Api_UrlManag.mapBoundsParams, bounds);
  }

  public static replace_map_bounds_base_params(url: string, bounds: GMapBounds) {
    if (bounds == null) { return url; }
    url = this.replace_string(url, this.zoom,  bounds.zoom);
    url = this.replace_string(url, this.minLat,  bounds.minLat);
    url = this.replace_string(url, this.maxLat,  bounds.maxLat);
    url = this.replace_string(url, this.minLng,  bounds.minLng);
    url = this.replace_string(url, this.maxLng,  bounds.maxLng);
    return url;
  }

  public static replace_string(url: string, search: string, prm: any) {
    if (prm == null) {
      return url;
    } else {
      return url.replace(search, prm.toString());
    }
  }

  public static replace_lat_long_params(url: string, lat: any, lng: any) {
    if (lat != null) { url = url.replace(this.lat, lat.toString()); }
    if (lng != null) { url = url.replace(this.lng, lng.toString()); }
    return url;
  }

  // ------------------------------ sectionRank ---------------------------------

  public static get_sectionRank_Url(snapshot: ActivatedRouteSnapshot) {
    const prms = snapshot.params;
    return Api_UrlManag.replace_sectionRank_Url(prms[RouteParams.rId],
                              prms[RouteParams.cId], prms[RouteParams.culture], null, null, null);
  }

  public static replace_sectionRank_Url(rId: any, cId: any, culture: any,
                                        rankingBy?: any, rankingScope?: any, mId?: any) {
    let url = Api_UrlManag.sectionRankUrl;
    if (rId == null) { rId = this.def_rId; }
    if (cId == null) { cId = this.def_cId; }
    if (culture == null) { culture = this.def_Culture; }
    url = url.replace(this.rId, rId);
    url = url.replace(this.cId, cId);
    url = url.replace(this.culture, culture);
    if (rankingBy != null) {
      let optPrms = Api_UrlManag.rankUrl_OptionPrms;
      optPrms = optPrms.replace(this.rankingBy, rankingBy);
      optPrms = optPrms.replace(this.rankingScope, rankingScope);
      if (mId == null) { mId = ''; }
      optPrms = optPrms.replace(this.mId_Nullable, mId);
      url = url + optPrms;
    }
     return this.urlDomain + url;
  }

//****************** favorite ************** */

  public static get_sectionFavorite_Url(snapshot: ActivatedRouteSnapshot) {
    const prms = snapshot.params;
    return Api_UrlManag.replace_sectionFavorite_Url(prms[RouteParams.rId],
                              prms[RouteParams.cId], prms[RouteParams.culture], null, null, null);
  }

  public static replace_sectionFavorite_Url(rId: any, cId: any, culture: any,
                                        rankingBy?: any, rankingScope?: any, mId?: any) {
    let url = Api_UrlManag.sectionRankUrl;
    if (rId == null) { rId = this.def_rId; }
    if (cId == null) { cId = this.def_cId; }
    if (culture == null) { culture = this.def_Culture; }
    url = url.replace(this.rId, rId);
    url = url.replace(this.cId, cId);
    url = url.replace(this.culture, culture);
    if (rankingBy != null) {
      let optPrms = Api_UrlManag.rankUrl_OptionPrms;
      optPrms = optPrms.replace(this.rankingBy, rankingBy);
      optPrms = optPrms.replace(this.rankingScope, rankingScope);
      if (mId == null) { mId = ''; }
      optPrms = optPrms.replace(this.mId_Nullable, mId);
      url = url + optPrms;
    }
     return this.urlDomain + url;
  }
  // ------------------------------ select_MeteoHubWebApi_Url ---------------------------------

  public static select_WebApi_Url(evtCngr: EventChanger, glPrms: GlobalParameters) {
    console.log("v1", evtCngr);
    console.log("v2", glPrms);
    
    if (evtCngr.eventname === EventsList.ChangeLocality) {
      if (evtCngr.issueDate != null) { glPrms.forecastIssueDate = evtCngr.issueDate; }
      if (evtCngr.deadlineDate != null) { glPrms.forecastDeadLineDate = evtCngr.deadlineDate; }
        return glPrms.urlNavs.refreshLoc;
      } else {
      if (evtCngr.eventname === EventsList.LocOnMap) {
        return glPrms.urlNavs.locOnMap;
      } else {
        const withBoundsUrl = glPrms.urlNavs.changeWithBounds;
        const boundsSet = evtCngr.mapBoundsAreSet();
        if (evtCngr.eventname === EventsList.ChangeIssueDeadlineDate) {
          glPrms.forecastIssueDate = evtCngr.issueDate;
          glPrms.forecastDeadLineDate = evtCngr.deadlineDate;
          this.VerifyDeadlineDate(glPrms); // Verify and change deadline
          return (boundsSet) ? withBoundsUrl: glPrms.urlNavs.refreshIssueDate;
        }
        if (evtCngr.eventname === EventsList.ChangeIssueDate) {
          glPrms.forecastIssueDate = evtCngr.issueDate;
          this.VerifyDeadlineDate(glPrms); // Verify and change deadline
          return (boundsSet) ? withBoundsUrl: glPrms.urlNavs.refreshIssueDate;
        }
        if (evtCngr.eventname === EventsList.ChangeDeadlineDate) {
          glPrms.forecastDeadLineDate = evtCngr.deadlineDate;
          return (boundsSet) ? withBoundsUrl: glPrms.urlNavs.refreshDeadLine;
        }
        if (evtCngr.eventname === EventsList.ChangeUser) {
          glPrms.uId = evtCngr.userId;
          glPrms.userName = evtCngr.userName;
          return (boundsSet) ? withBoundsUrl: glPrms.urlNavs.refreshUser;
        }  
      }
    }
    return null;
  }

  public static VerifyDeadlineDate(globParams: GlobalParameters) {
    // Verify and change deadline
    const a = new Date(globParams.forecastIssueDate);
    const b = new Date(globParams.forecastDeadLineDate);
    if ( a > b ) {
      globParams.forecastDeadLineDate = globParams.forecastIssueDate;
    }
  }

  // ------------------------------ format_MeteoHubWebApi_Urls ---------------------------------
  
  public static format_WebApi_Urls(url: string, evtCngr: EventChanger, 
                                   gPrms: GlobalParameters, locFrcsts?: LocalityForecasts) {                                           
    url = this.try_to_Replace_LocInfo_By_EvtChanger(url, evtCngr, locFrcsts);
    url = this.replaceNumber(url, this.uId, gPrms.uId);
    url = this.replaceNumber(url, this.rId, gPrms.rId);
    url = this.replaceNumber(url, this.cId, gPrms.cId);
    url = url.replace(this.userName, gPrms.userName);
    url = url.replace(this.forecastIssueDate, gPrms.forecastIssueDate);
    url = url.replace(this.forecastDeadLineDate, gPrms.forecastDeadLineDate);
    url = url.replace(this.culture, gPrms.culture);
    if (evtCngr.mapBoundsAreSet()) {
      url = this.replace_map_bounds_base_params(url, evtCngr.activeMapBounds);
    }
    url = evtCngr.tryToReplaceLocGeoPos(url);
    return this.urlDomain + url;
  }

  public static try_to_Replace_LocInfo_By_EvtChanger(url: string, evtCngr: EventChanger, 
                                                     localityForecasts?: LocalityForecasts) {
    const locInfo = this.get_Current_LocalityInfo(evtCngr, localityForecasts);
    if (locInfo == null) { return url; }
    return this.try_to_Replace_LocInfo(url, locInfo.elementId, locInfo.notMonitoredElementId);
  }

  public static try_to_Replace_LocInfo(url: string, eid: any, neid: any) {
    if (eid == null) { return url; }
    url = url.replace(this.eId, eid.toString());
    if (neid != null) {
      url = url.replace(this.neId, neid.toString());
    } else {
      url = url.replace('/' + this.neId, '');
    }
    return url;
  }

  private static get_Current_LocalityInfo(evtCngr: EventChanger, locFrcsts?: LocalityForecasts) {
    if (!evtCngr.isLocalityEvent()) { return null; }  
    let locInfo = evtCngr.get_Current_LocalityInfo();
    if (locInfo == null)  {
      if (locFrcsts != null) { 
        locInfo = LocalityInfo.getLocalityInfoBySearchElement(locFrcsts.currentLocality);
      }
    }
    return locInfo;
  }

  // ------------------------------ localities ---------------------------------

  // localities/{search}/{rId:int}
  public static format_SearchElement_Url(src: string, globParams: GlobalParameters) {
    if (globParams == null) { return null; }
    let url = globParams.urlNavs.localities;
    url = url.replace(this.search, src);
    url = this.replaceNumber(url, this.rId, globParams.rId);
    return this.urlDomain + url;
  }

  private static replaceNumber(str: string, placeHolder: string, value: number) {
    if (value != null) {
      return str.replace(placeHolder, value.toString());
    } else {
      return str;
    }
  }

  public static getLocalityUrl(snapshot: ActivatedRouteSnapshot) {
    const locality = snapshot.params[RouteParams.locality];
    const region = snapshot.params[RouteParams.region];
    const culture = snapshot.params[RouteParams.culture];
    return Api_UrlManag.buildLocalityUrl(locality, region, culture);
  }
  
  //Lato server i parametri sono i seguenti:      'loc/homeLoc/{loc}/{reg}/{culture?}'
  //I parametri delle chiamata all'app angular    :mode/:loc/:region/:culture
  public static buildLocalityUrl(locality:string, region:string, culture:string) {
    if (locality == null) {
      return Api_UrlManag.locViewUrl + Api_UrlManag.locEmptyPath;
    } else {
      if (region == null) {
        return Api_UrlManag.locViewUrl + locality;
      } else {
        if (culture == null) culture = this.def_Culture;
        return Api_UrlManag.locViewUrl + locality + '/' + region + '/' + culture;
      }
    }
  }

  public static getHomeLocByIdUrl(snapshot: ActivatedRouteSnapshot) {
    const eId = snapshot.params[RouteParams.eId];
    const neId = snapshot.params[RouteParams.neId];
    const rId = snapshot.params[RouteParams.rId];
    const culture = snapshot.params[RouteParams.culture];
    return Api_UrlManag.buildHomeLocByIdUrl(eId, neId, rId, culture);
  }

  // public static homeLocByIdUrl = Api_UrlManag.urlDomain + 'loc/homeLocById/';  
  // public static homeLocByIdParams = "{eId:int}/{rId:int}/{culture?}/{neId:int?}";
  public static buildHomeLocByIdUrl(eid: any, neid: any, rid: any, culture: string) {   
    let url: string; 
    if (eid == null) {
      url = this.homeLocGeoloc;
    } else {    
      let params = this.try_to_Replace_LocInfo(this.homeLocByIdParams, eid, neid);
      if (rid == null) { rid = this.def_rId; }
      if (culture == null) { culture = this.def_Culture; }
      params = this.replaceNumber(params, this.rId, rid);
      params = params.replace(this.cultNull, culture);
      url = this.homeLocByIdUrl + params;
    }
    return url;                                        
  }
}

  // ------------------------------------- GlobConstants ----------------------------------------

export class RouteParams {

  public static mode = 'mode';

  public static locality = 'locality';
  public static region = 'region';
  public static culture = 'culture';

  public static eId = 'eId';
  public static neId = 'neId';

  public static uId = 'uId';
  public static rId = 'rId';
  public static cId = 'cId';
  public static userName = 'userName';
  public static forecastIssueDate = 'forecastIssueDate';
  public static forecastDeadLineDate = 'forecastDeadLineDate';

  public static rankingBy = 'rankingBy';
  public static rankingScope = 'rankingScope';
  public static mId = 'mId';

  public static lat = 'lat';
  public static lng = 'lng';
  
}



 
  // public getDefaultSelectedMap() {
  //   return this.originalMapList[this.currentIndex];
  // }

  // public getOriginalMapByIndex(index: number): Map {
  //   if (this.originalMapList == null) return null;
  //   if (this.originalMapList.length <= index) return null;
  //   return this.originalMapList[index];
  // }

  // public setCurrentIndex(currentIdx: number) {
  //   if (this.evtChanger.eventname !== EventsList.ChangeUser) {
  //     this.currentIndex = this.getDefaultCurrentIndex();
  //   } else {
  //     this.currentIndex = currentIdx;
  //   }
  // }

    // public initEntireAreaData(maps: Maps): Map[] {
  //   if (maps == null) return null;
  //   if (maps.bounds) {
  //     // Se maps.bounds è istanziato significa che abbiamo preso i dati della singola mappa zoommata
  //     // riferiti alla sola corrente scadenza oraria e non alle altre della giornata. 
  //     // Nessuna array map.forecasts può essere riutilizzata senza accedere a db per i filtri
  //     // inferiori a 8 sull'intera area geografica.
  //     return this.initEntireAreaDataEmpty(maps.mapList);
  //   } else {
  //     const result: Map[] = [];
  //     maps.mapList.forEach(map => { 
  //       const mp = this.checkMapForecasts(map) ? map : null;
  //       if (mp == null) { this.thereAreEmptyForecasts = true; }
  //       result.push(mp);
  //     });
  //     return result;
  //   }
  // }

  // public initEntireAreaDataEmpty(maps: Map[]): Map[] {
  //   this.thereAreEmptyForecasts = true;
  //   const result: Map[] = [];
  //   maps.forEach(map => { 
  //     result.push(null);
  //   });
  //   return result;
  // }

  // public tryToGetMapByIndex(index: number): Map {
  //   const map = this.getMapByIndex(index);
  //   if (this.checkMapForecasts(map)) {
  //     return map;
  //   } else {
  //     return null;
  //   }
  // }

  // public setEntireAreaDataMap(map: Map) {
  //   if (this.entireAreaData == null) return;
  //   if (this.entireAreaData.length <= this.currentIndex) return;
  //   this.entireAreaData[this.currentIndex] = map;
  // }

  // public getMapByIndex(index: number): Map {
  //   if (this.entireAreaData == null) return null;
  //   if (this.entireAreaData.length <= index) return null;
  //   return this.entireAreaData[index];
  // }
