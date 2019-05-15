import { Component, Input } from '@angular/core';
import { } from 'jquery';
//import * as $ from "jquery";


import { EventChanger, GlobalParameters, Labels2, Ranking, UsersRanking, App_UrlManag } from "../entities/entities";

@Component({
  selector: 'rankinglist',
  templateUrl: './rankinglist.component.html',
  styleUrls: ['./rankinglist.component.css']
})
export class RankingListComponent {
  @Input() ranking: Ranking;
  @Input() labels: Labels2;
  @Input() globalParameters: GlobalParameters;
  @Input() eventchanger: EventChanger;

  ngOnInit() {
    this.ranking.usersRanking = this.ranking.usersRanking.sort((n1, n2) => {
      if (n1.PositionByAccuracy > n2.PositionByAccuracy) {
        return 1;
      }
      if (n1.PositionByAccuracy < n2.PositionByAccuracy) {
        return -1;
      }
      return 0;
    });
  }

  ngAfterContentInit() {
    $(function() {
      $('#ranking-container .radial-progress').each(function(){
        $(this).radialprogress();
      });
    });	
  }

  getBarStyle(item: UsersRanking) {
    // return "width: " + item.ScoreByAccuracy + ";";
    return parseFloat(item.ScoreByAccuracy.substr(0, item.ScoreByAccuracy.length - 2));
  }

  // refreshUser(item: UsersRanking) {
  // const url =  App_UrlManag.get_map_FrontEnd_App_Url()
  // let myWindow = window.open(url);     
  // }
  

  // refreshUser(item: UsersRanking) {
  //   this.eventchanger.refreshUser(item);
  // }

}
