import { Injectable } from '@angular/core';

import {of} from 'rxjs/observable/of'; 

import {HttpClient, HttpParams} from '@angular/common/http';
import {map } from 'rxjs/operators';

import { Localities } from "../entities/entities";
import { Api_UrlManag, GlobalParameters, DynamicRes, SearchElement, DynamicResManager } from "../entities/entities";

const PARAMS = new HttpParams({
    fromObject: {
      action: 'opensearch',
      format: 'json',
      origin: '*'
    }
});
  

@Injectable()
export class DbAccess {

constructor(private http: HttpClient) {}

    // resultObj: any;

    public getFromDbAndSubscribe<T>(url: string, context, func)
    {
        const obs = this.http.get<T>(url);
        if (obs == null) return null;
        obs.subscribe(val => {
            setTimeout(() => func(context, val), 0);
        });
    }

    public getFromDbAndSubscribe_1Params<T>(url: string, context, func, prm1)
    {
        const obs = this.http.get<T>(url);
        if (obs == null) return null;
        obs.subscribe(val => {
            setTimeout(() => func(context, val, prm1), 0);
        });
    }

    public getFromDbAndSubscribe_3Params<T>(url: string, context, func, prm1?, prm2?, prm3?)
    {
        const obs = this.http.get<T>(url);
        if (obs == null) return null;
        obs.subscribe(val => {
            setTimeout(() => func(context, val, prm1, prm2, prm3), 0);
        });
    }

}


@Injectable()
export class SearchService {
    constructor(private http: HttpClient) {}

    public CurrentUrl: string;
    public globalParameters: GlobalParameters;

    public localities: Array<string>;
    private resManag: DynamicResManager = new DynamicResManager(); 

    public buildLocalitiesArray(value: Localities) {
        this.localities = new Array<string>();
        for (let loc of value.localities) {
        this.localities.push(loc.name);
        };
    }

    public findSearchLocalityByModel(model:any): SearchElement {
        return this.resManag.findSearchLocalityByModel(model);
    }

    getUrlAndBuildArray(term: string) {
        return Api_UrlManag.format_SearchElement_Url(term, this.globalParameters);
    }

    search(term: string) 
    {
        if (term === '') { return of([]); }
        
        var locs = this.localities.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
        if (locs != null && locs.length > 0) { return of(locs); } 
        
        this.CurrentUrl = this.getUrlAndBuildArray(term);

        return this.http
        .get<DynamicRes>(this.CurrentUrl, {params: PARAMS.set('search', term)}).pipe(
        map(response => this.resManag.buildSearchArray(response))
        );

    }

}
  