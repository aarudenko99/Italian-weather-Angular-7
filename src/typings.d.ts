/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

interface JQuery {
  rangeslider(options?: any): any;

  rangeslider(value:string, ok:boolean);

  ioslist(options?: any): any;

  radialprogress(options?: any): any;
}
