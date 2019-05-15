/// <reference types="@types/googlemaps" />
import { Maps, ZoomSetting } from '../entities/entities';
// ------------------------------------------- OPZIONI MAPPA --------------------------------------------------
// ------------------------------------------------------------------------------------------------------------

export class GMapBounds {

  // Info centratura e zoom su specifica località (evento api: locOnMap)
    eId: number;
    neId?: number;
    centerLat = 42.40443;
    centerLng = 12.856702;
    zoomInfo: ZoomSetting;
  
  // Info bounds: limiti di una determinata area (settati con lo zoom della mappa).
    minLat: number;
    minLng: number;
    maxLat: number;
    maxLng: number;

    zoom?: number;


  public static getGoogleMapBounds(map: google.maps.Map): GMapBounds {
    const mb = new GMapBounds();
    mb.zoom = map.getZoom();
    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    mb.minLat = sw.lat();
    mb.minLng = sw.lng();
    const ne = bounds.getNorthEast();
    mb.maxLat = ne.lat();
    mb.maxLng = ne.lng();
    return mb;
  }
}


export class GMapOptions implements google.maps.MapOptions {

  zoom?: number = 6;

  center: google.maps.LatLng;
  streetViewControl = false;

  strfullscreenControlPos?: string; 
  fullscreenControlOptions?: google.maps.FullscreenControlOptions;

  gestureHandling?: google.maps.GestureHandlingOptions;

  mapTypeControl? = false;
  strMapTypeControlPos?: string;
  mapTypeControlOptions?: google.maps.MapTypeControlOptions;
  strMapTypeId = 'hybrid';  // google.maps.MapTypeId.ROADMAP ==> roadmap, satellite, hybrid, terrain
  mapTypeId? = google.maps.MapTypeId.HYBRID;

  strRotateControlPos?: string;
  rotateControlOptions?: google.maps.RotateControlOptions;

  strStreetViewControlPos?: string;
  streetViewControlOptions?: google.maps.StreetViewControlOptions;

  styles?: google.maps.MapTypeStyle[];

  strZoomControlStyle: string;
  strZoomControlPos: string;
  zoomControlOptions?: google.maps.ZoomControlOptions;
}

export class MapsOptionsManag {

  public static initMap(mapDiv: HTMLElement, maps: Maps, screenType: number): google.maps.Map {
    const mapOptions = MapsOptionsManag.initMapOptions(maps);
    MapsOptionsManag.initBounds(mapOptions, maps.bounds, screenType);
    const googleMap = new google.maps.Map(mapDiv, mapOptions);
    // MapsOptionsManag.setMapBounds(googleMap, maps.bounds);
    return googleMap;
  }
 
  public static initMapOptions(maps: Maps): GMapOptions {

    return new GMapOptions();
    // if (maps.options == null) { return new GMapOptions(); }

    // const mapOpts = maps.options;
    // const result = new GMapOptions();

    // if (mapOpts.strMapTypeId != null) {
    //   result.mapTypeId = google.maps.MapTypeId[mapOpts.strMapTypeId];
    // }

    // result.fullscreenControlOptions = 
    // this.parseControlPosition(result.fullscreenControlOptions, mapOpts.strfullscreenControlPos);

    // result.mapTypeControlOptions = 
    // this.parseControlPosition(result.mapTypeControlOptions, mapOpts.strMapTypeControlPos);

    // result.rotateControlOptions = 
    // this.parseControlPosition(result.rotateControlOptions, mapOpts.strRotateControlPos);
    
    // result.streetViewControlOptions = 
    // this.parseControlPosition(result.streetViewControlOptions, mapOpts.strStreetViewControlPos);

    // result.zoomControlOptions = 
    // this.parseControlPosition(result.zoomControlOptions, mapOpts.strZoomControlPos);

    // if (mapOpts.strZoomControlStyle != null) {
    //   if (result.zoomControlOptions != null) {
    //     result.zoomControlOptions.style = google.maps.ZoomControlStyle[mapOpts.strZoomControlStyle];
    //   }     
    // }
    // return result;
  }

  public static initBounds(mapOpts: GMapOptions, bounds: GMapBounds, screenType: number) {
    if (bounds == null) {
      bounds = new GMapBounds();
      //mapOpts.zoom = ScreenOptions.getMapZoomByScreenType(screenType);
      //mapOpts.zoom = ScreenOptions.Zoom1;
      mapOpts.zoom = ScreenOptions.getMapZoomByScreenType(ScreenSize.SmartPhone); 
    } else {
      if (bounds.zoom == null) {
        mapOpts.zoom = ScreenOptions.getMapZoomByScreenType(screenType);
      } else {
        mapOpts.zoom = bounds.zoom;
      }
    }
    mapOpts.center = new google.maps.LatLng(bounds.centerLat, bounds.centerLng);
  }

  public static parseControlPosition(controlOptions: any, str: string) {
    if (str == null) { return null; }
    if (str.length < 1) { return null; }
    if (controlOptions != null) {
      // if (google.maps.ControlPosition != null) {}
      controlOptions.position = google.maps.ControlPosition[str];
      return controlOptions;
    } else {
      // if (google.maps.ControlPosition == null) { return null; }
      controlOptions = {
        position: google.maps.ControlPosition = google.maps.ControlPosition[str]
      };
      return controlOptions;
    }
  }

  public static setMapBounds(googleMap: google.maps.Map, bounds: GMapBounds) {
    if (bounds == null) { return; }
    const sw = new google.maps.LatLng(bounds.minLat, bounds.minLng);
    const ne = new google.maps.LatLng(bounds.maxLat, bounds.maxLng);
    let buonds = new google.maps.LatLngBounds(sw, ne);
    googleMap.panToBounds(buonds);
  }

}

export enum ScreenSize {
  Desktop = 4, Tablet = 3, SmartTablet = 2, SmartPhone = 1
}

export class ScreenOptions {

  public static Prty1 = 1;
  public static Prty2 = 2;
  public static Prty3 = 3;
  public static Prty4 = 4;

  public static Zoom1 = 5;
  public static Zoom2 = 6;
  public static Zoom3 = 7;
  public static Zoom4 = 8;

  public static getScreenBySize(size: number): ScreenSize {
    if (size > 900) {
      // Large Screen:  Aggiungo la località, a prescindere dalla dimensione dello schermo
      return ScreenSize.Desktop;
    }
    if (size > 700) {
      // Tablet: se sono arrivato fino qui è perchè lo schermo non è più largo di 900.
      // Se è più largo di 700 e meno di 900 è un tablet e aggiungo le città con priorità  da 1 a 3.
      return ScreenSize.Tablet;
    }
    if (size > 500) {
      // SmartTablet: aggiungo le città con priorità 1 e 2 (le principali come roma, torino e le importanti come brescia).
      return ScreenSize.SmartTablet;
    } else {
      // Smartphone: aggiugno solo le città principali.
      return ScreenSize.SmartPhone;
    }
  }

  public static getMapZoomByScreenType(screenType: ScreenSize): number {
    let result: number = ScreenOptions.Zoom1;
    switch (screenType) {
      case ScreenSize.Desktop:
        result = ScreenOptions.Zoom4;
        break;
      case ScreenSize.Tablet:
        result = ScreenOptions.Zoom3;
        break;
      case ScreenSize.SmartTablet:
        result = ScreenOptions.Zoom2;
        break;
      case ScreenSize.SmartPhone:
        result = ScreenOptions.Zoom1;
        break;
      default:
        break;
    }
    return result;
  }

  public static getPriorityByZoomLevel(zoom: number): number {
    if (zoom <= ScreenOptions.Zoom1) {
      return ScreenOptions.Prty1;
    }
    if (zoom <= ScreenOptions.Zoom2) {
      return ScreenOptions.Prty2; //Verranno visualizzate le località con priorità <= 2
    }
    if (zoom <= ScreenOptions.Zoom3) {
      return ScreenOptions.Prty3;
    } else {
      return ScreenOptions.Prty4;
    }
  }

  // public static getScreenTypeByZoomLevel(zoom: number): ScreenSize {
  //   if (zoom <= ScreenOptions.Zoom1) {
  //     return ScreenSize.SmartPhone;
  //   }
  //   if (zoom <= ScreenOptions.Zoom2) {
  //     return ScreenSize.SmartTablet;
  //   }
  //   if (zoom <= ScreenOptions.Zoom3) {
  //     return ScreenSize.Tablet;
  //   } else {
  //     return ScreenSize.Desktop;
  //   }
  // }

}

// --------------------------------------- MarkerSupport ----------------------------------------

export class MarkerSupport {

  public static iconsPath = 'account%2fresources%2ficons%2f';

  public static getCircleIconUrlByBgColor(bgCol?: string) {
    let circle_icon = MarkerSupport.iconsPath + 'transparent.png';
    switch ( bgCol ) {
    case '#006600':
      circle_icon = MarkerSupport.iconsPath + 'green.png';
      break;
    case '#ae0707':
      circle_icon = MarkerSupport.iconsPath + 'red.png';
      break;
    case '#e6be11':
      circle_icon = MarkerSupport.iconsPath + 'yellow.png';
      break;
    case '#ae0707':
      circle_icon = MarkerSupport.iconsPath + 'red.png';
      break;
    case '#0037a8':
      circle_icon = MarkerSupport.iconsPath + 'blue.png';
      break;
    }
    return circle_icon;
  }

  public static createImageMarker(googleMap: google.maps.Map, coords: google.maps.LatLng,
                                  zIdx: number, imgUrl: string, imgSize: number): google.maps.Marker {
    const image = {
      url: imgUrl,
      size: new google.maps.Size(imgSize, imgSize),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(imgSize / 2, imgSize / 2)
    };
    const marker = new google.maps.Marker({
      position: coords,
      icon: image,
      map: googleMap,
      zIndex: zIdx
    });
    return marker;
  }

  public static createDefaultMarker(googleMap: google.maps.Map, coords: google.maps.LatLng,
                                                                zIdx: number): google.maps.Marker {
    const marker = new google.maps.Marker({
      position: coords,
      map: googleMap,
      zIndex: zIdx
    });
    return marker;
  }

}



 // public static initMapOptions(options: GMapOptions, screenType: number): google.maps.MapOptions {
  //   const mapOptions = options == null ? new GMapOptions() : options;
  //   const mapProp: google.maps.MapOptions = {
  //     center: new google.maps.LatLng(mapOptions.centerLat, mapOptions.centerLng),
  //     mapTypeId: MapsOptionsManag.parseMapTypeId(mapOptions.mapTypeId),
  //     mapTypeControl: mapOptions.mapTypeControl,
  //     streetViewControl: mapOptions.streetViewControl
  //   };
  //   if (options == null) {
  //     mapProp.zoom = ScreenOptions.getMapZoomByScreenType(screenType);
  //   } else {
  //     mapProp.zoom = options.zoom;
  //   }
  //   return mapProp;
  // }
 // static parseMapTypeId(sMapTypeId: string): google.maps.MapTypeId {
  //   sMapTypeId = sMapTypeId.toLowerCase();
  //   let result: google.maps.MapTypeId;
  //   switch (sMapTypeId) {
  //     case 'roadmap':
  //       result = google.maps.MapTypeId.ROADMAP;
  //       break;
  //     case 'satellite':
  //       result = google.maps.MapTypeId.SATELLITE;
  //       break;
  //     case 'hybrid':
  //       result = google.maps.MapTypeId.HYBRID;
  //       break;
  //     case 'terrain':
  //       result = google.maps.MapTypeId.TERRAIN;
  //       break;
  //     default:
  //       result = google.maps.MapTypeId.SATELLITE;
  //       break;
  //   }
  //   return result;
  // }
    // if (mapOpts.overviewMapControlOpened != null) {
    //   if (mapOpts.overviewMapControlOptions != null) {
    //     mapOpts.overviewMapControlOptions.opened = mapOpts.overviewMapControlOpened;
    //   }
    // else {
    //   const opt: any = { opened: boolean = mapOpts.overviewMapControlOpened };
    //   mapOpts.overviewMapControlOptions = opt;
    // }
    // }  


  // public static parseControlPosition(controlOptions: any, str: string): any {
  //   if (str == null) { return controlOptions; }
  //   if (controlOptions != null) {
  //     if (google.maps.ControlPosition != null) {
  //       controlOptions.position = google.maps.ControlPosition[str];
  //     }
  //     return controlOptions;
  //   } else {
  //     const positionContainer: any = {
  //       position: google.maps.ControlPosition = google.maps.ControlPosition[str]
  //     };
  //     return positionContainer;
  //   }
  // }

   // public static initBounds(mapOpts: GMapOptions, bounds: GMapBounds, screenType: number) {
  //   if (bounds == null) {
  //     bounds = new GMapBounds();
  //     mapOpts.zoom = ScreenOptions.getMapZoomByScreenType(screenType);
  //   } else {
  //     if (bounds.zoomInfo == null) {
  //       mapOpts.zoom = ScreenOptions.getMapZoomByScreenType(screenType);
  //     } else {
  //       if (bounds.zoomInfo.zoom == null) {
  //         mapOpts.zoom = 10;
  //       } else {
  //         mapOpts.zoom = bounds.zoomInfo.zoom;
  //       }
  //     }
  //   }
  //   mapOpts.center = new google.maps.LatLng(bounds.centerLat, bounds.centerLng);
  // }
