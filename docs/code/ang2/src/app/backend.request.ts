import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class BackendRequestClass {

  private result: Object = null;

  constructor(private http: Http) {

  }

  public getResult() {
    return this.result;
  }

  public load() {
    return new Promise((resolve, reject) => {
      this.http.get('assets/workflow.json').map( res => res.json() ).catch((error: any): any => {
        reject(false);
        return Observable.throw(error.json().error || 'Server error');
      }).subscribe( (callResult) => {
        this.result = callResult;
        resolve(true);
      });

    });
  }
}
