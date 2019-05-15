import { Component, Input  } from '@angular/core';
 
import '../../assets/jquery.ioslist.js';

import {
  LocalityForecasts,
  PredictionAndScore,
  UserForecast,
  EventChanger,
  DayForecast,
  App_UrlManag
} from "../entities/entities";

@Component({
  selector: 'view-locality',
  templateUrl: './view-locality.component.html',
  styleUrls: ['./view-locality.component.css']
})

export class ViewLocalityComponent { 
  
  public isTopRatingClass(item:PredictionAndScore):boolean {
    if (item==null) return false;
    if (item.topRating==null) return false;
    return item.topRating;
  }
 
  private _localityForecasts:LocalityForecasts;
  @Input('localityForecasts')
  set localityForecasts(value:LocalityForecasts) {
    this.resetIosList(); //hack: resetto il componente
    this._localityForecasts = value;
    if (value == null) return;
    this.launchIosList();
  }
  get localityForecasts() {
    return this._localityForecasts;
  }
  
  @Input() eventchanger: EventChanger;

  resetIosList() {
    $("#statistics .ioslist-fake-header").remove(); //hack: resetto il componente
  }

  launchIosList() {
    var dt = new Date();
    var currentTime = dt.getHours();
    var currentHeight;
    $(function() {
      $("#statistics").ioslist();
      // alert("aasdasd");
      var section_block = 0;
      var section01 = $(".ioslist-group-container:nth-child(1)").height();
      var section02 = $(".ioslist-group-container:nth-child(2)").height();
      var section03 = $(".ioslist-group-container:nth-child(3)").height();
      var section04 = $(".ioslist-group-container:nth-child(4)").height();
      var section05 = $(".ioslist-group-container:nth-child(5)").height();
      var section06 = $(".ioslist-group-container:nth-child(6)").height();
      var section = $(".ioslist-group-header").height();
        
      if((currentTime>=0) && (currentTime < 7)){
        section_block = 0;
      }
      else if((currentTime>=7) && (currentTime < 10)){
        section_block = section01+section+10;
      }
      else if((currentTime>=10) && (currentTime < 13)){
        section_block = section01+section02+2*section+10;
      }
      else if((currentTime>=13) && (currentTime < 16)){
        section_block = section01+section02+section03+3*section+10;
      }
      else if((currentTime>=16) && (currentTime < 19)){
        section_block = section01+section02+section03+section04+4*section+10;
      }
      else if((currentTime>=19) && (currentTime < 22)){
        section_block = section01+section02+section03+section04+section05+5*section+10;
      }
      else{
        section_block = section01+section02+section03+section04+section05+section06+6*section+10;
      }
      $(".ioslist-wrapper").scrollTop(section_block);
    });
  }

  GetBackgroundColor(index:number, item:UserForecast) {
    if (item==null) return '';
    var bgCol = item.userPredictions[index].bgCol;
    return (bgCol != null) ? bgCol : '';
  }
 
  startCharIdx = 2;
  CellUserRanking(item:UserForecast) {
    if (item==null) return "";
    if (!this.IsRanking(item.username)) return "-";
    return item.username.substr(0, this.startCharIdx);
  }

  CellUserId(item:UserForecast) {
    if (item == null) return "";
    return item.userId.toString();
  }

  IsRanking(username:string) {
    return username.indexOf(' - ') > 0;
  }
   
  CellForecastDisableStyle(corValue:string) {
    if (corValue==null) return "CellForecastDisableStyle";
    return "";
  }

  CellValue(corValue:string) {
    if (corValue==null) return "-";
    return corValue;
  }
 
  CellScore(idx:number, subitem:UserForecast):string {
    const predInfo = subitem.userPredictions[idx];
    if (predInfo==null) return "-";
    return predInfo.score != null? predInfo.score: "-";
  }
 
  @Input() LocalityDetail:number = -1;
  ShowLocalityDetail(value:number) {
    this.LocalityDetail=value;
  }

  PointSwitchButtonSelected(v:number) {
    if (this.LocalityDetail==v) return "btn btn-primary btn-block PointSwitchButton";
    else return "btn btn-default btn-block PointSwitchButton";
  }

  ProgressBar(level:number,values:string) {
    let value = +values.replace('%','').replace(',','.');
    if (level==1) {
      if (value>=30) return "30%";
      else return value+"%";
    }
    if (level==2) {
      if (value<=30) return "0%";
      else if (value>=60) return "30%";
      else if (value<60) return value-30+"%";
    }
    if (level==3) {
      if (value<=60) return "0%";
      else return value-60+"%";
    }
  }

  GoToSite(subitem:UserForecast) {
    let url = subitem.webSiteUrl;
    if (url != null) { 
      let myWindow = window.open(url);     
    }
  }
 
//---------------------------------- URL ---------------------------------------


  GetUrlPath(item:UserForecast) {
    const str = App_UrlManag.weatherIconsPath + item.userPredictions[0].url;
    return str != null ? str.replace('.png', '.svg'): '';
  }

  UrlOK(item:UserForecast) {
    const weather = item.userPredictions[0];
    const value = (weather != null) ? weather.url: null;
    return value != null;
  }
 
  GetCorrectUrlPath(item:DayForecast) {
    return App_UrlManag.weatherIconsPath + this.GetCorrectUrl(item);
  }

  CorrectUrlOK(item:DayForecast) {
    return this.GetCorrectUrl(item) != null;
  }

  private GetCorrectUrl(item:DayForecast) {
    const predictions = item.usersForecasts[0].userPredictions[0];
    const str = (predictions != null) ? predictions.cUrl: null;
    return str != null ? str.replace('.png', '.svg'): null;
  }


  visibleDescr = false;
  visibleTemp = false;
  visiblePrec = false;

  showTemp() {
    this.visibleTemp = !this.visibleTemp;
  }

  showPrec() {
    this.visiblePrec = !this.visiblePrec;
  }

  showDescr() {
    this.resetIosList();
    // this.launchIosList();
    this.visibleDescr = !this.visibleDescr;
  }

  getItemId(item) {
    return 'fr_' + item.maturityDateLabel[2].replace(':', '_');
  }

  
}
