import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HoursBar } from "../entities/entities";

import { } from 'jquery';
import '../../assets/rangeslider.min.js';

@Component({ 
  selector: 'view-stepper',
  templateUrl: './view-stepper.component.html',
  styleUrls: ['./view-stepper.component.css']
})

export class ViewStepperComponent  {

  _barData: HoursBar;
  @Input('barData')
  set barData(value: HoursBar) {
    this._barData = value;
    this.setupTimeStepper();
  }
  get barData(): HoursBar {
    return this._barData;
  }
 
  @Output() onChange: EventEmitter<number> = new EventEmitter<number>();
     
  setupTimeStepper() {
    var main = this;
    var $stepper = $('#timestepper');
    if ($stepper == null) return; 
    $stepper.rangeslider('destroy');
    var $ruler = $('<div class="rangeslider__ruler">');
    if ($ruler == null) return;
    $ruler[0].innerHTML = this.getRulerRange($stepper);
    $stepper.rangeslider({
      polyfill: false,
      onInit: function() {
        this.rng = this.$range;
        this.$range.prepend($ruler);
      },
      onSlideEnd: function(value, position) {
        main.onSlideChange(position);
      }
    });
    var idx = this._barData.index + 1;
    if (idx > this._barData.hours.length) idx = this._barData.hours.length;
    $stepper.rangeslider().val(idx).change();
  }
  getRulerRange($element) {
    var stps = this._barData.hours;
    if (stps == null) return '';
    $element.attr('max', stps.length);
    var html = '';
    for (var i = 0; i < stps.length; i++) {
      html += stps[i] + ' '; 
    }
    return html; 
  }

  onSlideChange(index:number) {
    this.onChange.emit(index -1);
  }
 
}


  // _steps: Array<string>;
  // @Input('steps')
  // set steps(value: Array<string>) {
  //   this._steps = value;
  //   this.setupTimeStepper();
  // }
  // get steps(): Array<string> {
  //   return this._steps;
  // }
