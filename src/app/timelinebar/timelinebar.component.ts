import { Component, OnInit, Input } from '@angular/core';
// import {CalendarModule} from 'primeng/primeng';

export class barDay {
  label: string;
  dateSrt: string;
  isEmission: boolean;
  isForecast: boolean;
  isNow: boolean;
  buttonStyle: string;

  public setBarItem(day:ForwardDay, issueDate:string, deadLineDate:string) {
    this.label=day.label;
    this.dateSrt=day.dateStr;
    this.isNow=(day.daysFromToday===0);
    this.isEmission = EventChanger.checkDateStrings(day.dateStr, issueDate);
    this.isForecast = EventChanger.checkDateStrings(day.dateStr, deadLineDate);
    this.buttonStyle = this.getButtonStyle();
  }

  private getButtonStyle() {
    let buttonstyle = "TimeLineNormalColor";
    if (this.isEmission) buttonstyle = "TimeLineEmissionColor";
    if (this.isNow) buttonstyle = "TimeLineNowColor";
    if (this.isForecast) buttonstyle = "TimeLineForecastColor";
    return "TimeLineButton " + buttonstyle;
  }
 
}
 
import {
  ForwardDay,
  EventChanger,
  EventsList
} from "../entities/entities";

@Component({
  selector: 'app-timelinebar',
  templateUrl: './timelinebar.component.html',
  styleUrls: ['./timelinebar.component.css']
})
export class TimelinebarComponent implements OnInit {

  barDays: Array<barDay> = [];
  enableCalendar: boolean;
  isTouchDevice: boolean = 'ontouchstart' in window || navigator.maxTouchPoints>0;

  @Input() minDateValue: Date;
  @Input() maxDateValue: Date = new Date();

  _emissionDate: Date;
  @Input('emissionDate')
  set emissionDate(value: Date) {
    this._emissionDate = value;
    this.enableCalendar=false;
    let date = this._emissionDate;
    let newdate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    // this.eventchanger.changeIssueDeadlineDate(newdate);
    this.eventchanger.update_IssueDeadlineDate(newdate);
  }
  get emissionDate(): Date {
    return this._emissionDate;
  }
 
  @Input() eventchanger: EventChanger;
  
  //1) Prima viene impostata la forecastIssueDate.
  _forecastIssueDate: string;
  @Input('forecastIssueDate')
  set forecastIssueDate(value: string) {
    this._forecastIssueDate = value;
  }
  get forecastIssueDate(): string {
    return this._forecastIssueDate;
  }

  //2) Poi viene impostata la forecastDeadLineDate.
  _forecastDeadLineDate: string;
  @Input('forecastDeadLineDate')
  set forecastDeadLineDate(value: string) {
    this._forecastDeadLineDate = value;
    if (this.eventchanger.eventname === EventsList.ChangeDeadlineDate) this.UpdateBar();
  }
  get forecastDeadLineDate(): string {
    return this._forecastDeadLineDate;
  }

  //1) Alla fine vengono impostati i barDay tramite la Array<ForwardDay>.
  _forwardDays: Array<ForwardDay>;
  @Input('forwardDays')
  set forwardDays(value: Array<ForwardDay>) {
    this._forwardDays = value;
    this.UpdateBar();
  }
  get forwardDays(): Array<ForwardDay> {
    return this._forwardDays;
  }
  
  public emissionLabel: string;
  // previsioneLabel: string;
 
  UpdateBar() {
    if (this._forwardDays==null||this._forwardDays.length==0) return;
    this.barDays = [];
    let days = 0;
    for (let day of this._forwardDays) {
      days++
      let item = new barDay();
      item.setBarItem(day, this._forecastIssueDate, this._forecastDeadLineDate);
      if (days === 1) this.setEmissionLabel(item, day);
      this.barDays.push(item);
    }
  }

//&&item.isEmission
  setEmissionLabel(item:barDay, day:ForwardDay) {
    if (item.isNow) {
      this.emissionLabel="OGGI";
    } else {
      if (item.isEmission&&!item.isNow&&day.daysFromToday<0) {
        this.emissionLabel=Math.abs(day.daysFromToday).toString()+" gg fa";
      }
    }
  }
 
  constructor() {
  }

  ngOnInit() {
      // var TBar = document.getElementById('ScrollItem');
      // if (TBar==null) throw ("Errore nello ScrollItem");
      // if(!this.isTouchDevice) TBar.style.overflowX = "hidden"; 
  }


  GetScrollStyle() {
    const IsMobile = this.isTouchDevice;
    return IsMobile ? 'TimelineMobileForecastDaysContainer' : 'TimelineDesktopForecastDaysContainer';
  }

  BackWardForecast() {
    var TBar = document.getElementById('ScrollItem');
    if (TBar==null) throw ("Errore nello ScrollItem");
    TBar.scrollLeft -= 70;
  }

  ForWardForecast() {
    var TBar = document.getElementById('ScrollItem');
    if (TBar==null) throw ("Errore nello ScrollItem");
    TBar.scrollLeft += 70;
  }
 
  UpdateForecastsDeadline(item:barDay) {
    if (this.eventchanger==null) {return;}
    this.eventchanger.update_DeadlineDate(item.dateSrt);
  }
  
  MobileDay(item:string) {
    return item.split(' ')[1];
  }
  MobileWeekDay(item:string) {
    return item.split(' ')[0].substring(0,3);
  }

    ShowCalendar() {
        this.enableCalendar=true;
    }
    HideCalendar() {
        this.enableCalendar=false;
    }

}




// ForWard() {
//   let date = new Date(this._forecastIssueDate);
//   date.setDate(date.getDate()+1);
//   let newdate = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
//   if (this.eventchanger!=null&&this.eventchanger.eventname== EventsList.ChangeLocality)
//   {
//     this.eventchanger.deadlineDate=null;
//     this.eventchanger.issueDate=newdate;
//     this.eventchanger.Executed=false;
//   }
//   else
//   {
//     this.eventchanger.changeIssueDate(newdate);
//   }
// }


// BackWard() {
//   let date = new Date(this._forecastIssueDate);
//   date.setDate(date.getDate()-1);
//   let newdate = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
//   if (this.eventchanger!=null&&this.eventchanger.eventname== EventsList.ChangeLocality)
//   {
//     this.eventchanger.deadlineDate=null;
//     this.eventchanger.issueDate=newdate;
//     this.eventchanger.Executed=false;
//   }
//   else
//   {
//     this.eventchanger.changeIssueDate(newdate);
//   }
// }