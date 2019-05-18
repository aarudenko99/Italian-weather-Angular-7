import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap} from 'rxjs/operators';
import { SearchService } from "../entities/dbAccess";
import { EventChanger, GlobalParameters, SearchElement, App_UrlManag } from "../entities/entities";


@Component({
  selector: 'app-user-favorite',
  templateUrl: './user-favorite.component.html',
  providers: [SearchService],
  styleUrls: ['./user-favorite.component.css']
})
export class UserFavoriteComponent implements OnInit {

  item_text;
  cart;
  constructor(private _service: SearchService) {  }

  ngOnInit() { 
    if (localStorage) {
      if (!localStorage['locations']) this.cart = [];
      else this.cart = JSON.parse(localStorage['locations']);            
      if (!(this.cart instanceof Array)) this.cart = [];
    }
  }

  getList = this._service;
  _EVC: EventChanger;
  @Input('eventchanger')
  set setEventChanger(value: EventChanger) { 
    if (value) {
      this._EVC = value;
      if (this._service) {
        this._service.buildLocalitiesArray(value.localities);
      }
    }
  }

  // ------------------------- globalParameters -----------------------------

  private _GP: GlobalParameters;
  @Input('globalParameters')
  set globalParameters(value: GlobalParameters) {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", value);
    if (value) {
      this._GP = value;
      if (this._service) {
        this._service.globalParameters = value; 
      }
    }
  }
  get globalParameters(): GlobalParameters {
    return this._GP;
  }
  

  add_list(data) {
    if(data.f_item != ''){
      if (localStorage) {
        var counter = 0, existing_item = 0;
        if (!localStorage['locations']) this.cart = [];
        else this.cart = JSON.parse(localStorage['locations']);            
        if (!(this.cart instanceof Array)) this.cart = [];
        for(var i=0; i<this.cart.length; i++)
        {
          if(this.cart[i] == data.browser) counter++;
        }
  
        if(counter <= 0)
        {
          for(var i=0; i<this.getList.localities.length; i++)
          {
            if(this.getList.localities[i] == data.browser) existing_item++;
          }
          if(existing_item == 1)
            this.cart.push(data.browser);
        }
        else
          this.item_text = null;
  
        localStorage.setItem('locations', JSON.stringify(this.cart));
      }
    }
  }

  removeItem(_item){
    if (localStorage) {
      if (!localStorage['locations']) this.cart = [];
      else this.cart = JSON.parse(localStorage['locations']);            
      if (!(this.cart instanceof Array)) this.cart = [];
      for(var i=0; i<this.cart.length; i++)
      {
        if ( this.cart[i] === _item) {
          this.cart.splice(i, 1); 
        }
      }

      localStorage.setItem('locations', JSON.stringify(this.cart));
    }
  }

  weatherItem(_item){
    alert(_item);
  }
}
