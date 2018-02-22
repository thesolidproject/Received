import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


import { WorkflowMeta } from './workflow-meta';
import { State } from './state';
import { Tree } from './tree';

@Injectable()
export class WorkflowService {
  @Output() fire: EventEmitter<any> = new EventEmitter();
  @Output() dataChangeObserver: EventEmitter <any> = new EventEmitter();
  private workflowUrl = 'assets/workflow.json'; // can be changed
  private result: Object = null;

  constructor(private http: Http) { }

  getWorkflowMeta(): Observable<WorkflowMeta> {
    return this.http.get(this.workflowUrl)
      .map(this.extractMeta)
      .catch(this.handleError);
  }
  getStates(): Observable<State[]> {
    return this.http.get(this.workflowUrl)
      .map(this.extractStates)
      .catch(this.handleError);
  }
  getTree(): Observable<Tree> {
    return this.http.get(this.workflowUrl)
      .map(this.extractTree)
      .catch(this.handleError);
  }

  private extractMeta(res: Response) {
    const body = res.json();
    // console.log(body[0].workflow.states);
    return body[0].workflow || { };
  }
  private extractStates(res: Response) {
    const body = res.json();
    return body[0].workflow.states || { };
  }
  private extractTree(res: Response) {
    const body = res.json();
    const states = body[0].workflow.states;
    const treearray = [];
    let previous, current, tree;
    for (let i = 0, len = states.length; i < len  ; i++) {
      current = states[i];
      // tree is empty push root node
      if (treearray.length === 0) {
        current.children = [];
        treearray.push(current);
        previous = current;
        continue;
      }
      // if id is 1 more than the previous then parent child relationship is assumed
      if (current.id === previous.id + 1) {

        current.children = [];
        previous.children.push(current);
        previous = current;
      } else {
        current.children = [];
        treearray[0].children.push(current);
      }
    }
    tree = Object.assign({}, treearray[0]);
    return tree;
  }

  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  change(input: any) {
    console.log('change started');
    this.fire.emit(input);
  }

  getEmittedValue() {
    return this.fire;
  }
}
