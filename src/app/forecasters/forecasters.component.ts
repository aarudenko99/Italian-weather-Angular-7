import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { UserDropDown, EventChanger } from "../entities/entities";
  
const USERS: Array<UserDropDown> = [
  {'userId': 25, 'username': 'MeteoDrome.it', 'logo':'lg25.png', 'selected':false},
  {'userId': 24, 'username': 'IlMeteo.it', 'logo':'lg24.jpg', 'selected':false},
  {'userId': 19, 'username': '3BMeteo.com', 'logo':'lg19.png', 'selected':false},
  {'userId': 31, 'username': 'WorldWeatherOnline', 'logo':'lg31.jpg', 'selected':false},
  {'userId': 32, 'username': 'OpenWeatherMap.org', 'logo':'lg32.png', 'selected':false},
  {'userId': 44, 'username': 'AccuWeather.com', 'logo':'lg44.png', 'selected':false}
];

@Component({ 
  selector: 'forecasters',
  templateUrl: './forecasters.component.html',
  styleUrls: ['./forecasters.component.css'],
  encapsulation: ViewEncapsulation.None  // Enable dynamic HTML styles
})

export class ForecastersComponent  implements OnInit {

  public items:Array<UserDropDown> = [];

  @Input() eventchanger: EventChanger;

  @Input('uId') 
  set uId(value: number) {
    this.fillDropDown(value, USERS);
  }

  @Output() Selected: EventEmitter<any> = new EventEmitter();
 
  public ngOnInit():any {}

  public onChange(value:any):void {
    var usr = this.items.find(item => item.userId == value);
    this.Selected.emit(usr);
    // this.eventchanger.refreshUser(usr);
  }

  fillDropDown(selUserId:number, users?: Array<UserDropDown>) {
    if (users == null) return;
    this.items = [];
    users.forEach((user) => {
      user.selected = (user.userId === selUserId);
      this.items.push(user);
    });
  }
}