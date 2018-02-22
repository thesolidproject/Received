import { Component, OnInit } from '@angular/core';
import { BackendRequestClass } from '../backend.request';
import { WorkflowService } from '../workflow.service';
import { WidgetcontrolsComponent } from '../widgetcontrols/widgetcontrols.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  wfdata: any;
  layout: any;
  wfs: any;
  subscription: any;
  constructor(private backendRequest: BackendRequestClass, wfs: WorkflowService) {
    this.layout = 'flourish';
    this.wfs = wfs;
  }

  ngOnInit() {
    setTimeout(() => {
      this.generateData();

      // change the data periodically
      setInterval(() => this.generateData(), 3000);
    }, 1000);
    this.subscription = this.wfs.getEmittedValue()
      .subscribe(item => this.layout = item);
  }
  // use backend service to get data
  generateData() {
    this.wfdata = this.backendRequest.getResult();
    // this.wfdata = this.workflowService.getResult();
    // console.log(this.wfdata);
  }

}
