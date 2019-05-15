import { Component, Input, OnInit } from '@angular/core';
import { EventChanger, EventsList } from "../entities/entities";


@Component({
  selector: 'view-bar-locality',
  templateUrl: './view-bar-locality.component.html',
  styleUrls: ['./view-bar-locality.component.css']
})
export class ViewBarLocalityComponent implements OnInit {

  //expandImgPath: string;
    locFullscreen:boolean = false;

  constructor() {
    //this.expandImgPath = 'account/resources/icons/expand.png';
  }

  ngOnInit() {
  }
 
  @Input() eventchanger: EventChanger;

  @Input() locName: string;
  @Input() maturityDateLabel: string[];
 
  MaturityDateString() {
    var arrLabel = this.maturityDateLabel;
    return arrLabel ? arrLabel[0] : '';
  }

  viewMap() {
    this.eventchanger.viewMap();
  }

  viewCities() {
    this.eventchanger.viewCities();
  }
  

  viewExpandCollapse() {
    this.eventchanger.eventname = EventsList.LocSectionExpand;
    this.eventchanger.Executed = false;
    this.locFullscreen = !this.locFullscreen;
  }


    
}
