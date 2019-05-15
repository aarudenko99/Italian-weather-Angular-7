import { Component, Input } from '@angular/core';
import {ViewMode} from "../view-loader/view-loader.component";

@Component({
  selector: 'view-bar-maps',
  templateUrl: './view-bar-maps.component.html',
  styleUrls: ['./view-bar-maps.component.css']
})
export class ViewBarMapsComponent {
  
  @Input() viewMode: ViewMode;

  @Input() userName: string;
  @Input() maturityDateLabel: string[];
 
  // MaturityDateString() {
  //   var arrLabel = this.maturityDateLabel;
  //   return arrLabel ? arrLabel[0] + '&nbsp;' + arrLabel[1] + '&nbsp;' + arrLabel[2] : '';
  // }
   
}

