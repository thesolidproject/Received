import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BackendRequestClass } from './backend.request';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { AlertModule } from 'ng2-bootstrap'; // bootstrap import
import { ButtonsModule } from 'ng2-bootstrap';
import { D3Service } from 'd3-ng2-service'; // d3 import
import { AppComponent } from './app.component';
import { WorkflowtreeComponent } from './workflowtree/workflowtree.component';
import { WorkflowService } from './workflow.service';
import { HomeComponent } from './home/home.component';
import { TooltipModule } from 'ngx-tooltip';
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { GaugeModule } from 'ng-gauge';
import { SimpletreeComponent } from './simpletree/simpletree.component';
import { WidgetcontrolsComponent } from './widgetcontrols/widgetcontrols.component';
import { BootstrapSwitchModule } from 'angular2-bootstrap-switch'; // addd for bootstrap toggle switch
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // added for bootstrap toggle switch
// test
@NgModule({
  declarations: [
    AppComponent,
    WorkflowtreeComponent,
    HomeComponent,
    SimpletreeComponent,
    WidgetcontrolsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    TooltipModule,
    ButtonsModule.forRoot(),
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    BootstrapModalModule,
    BootstrapSwitchModule.forRoot(), // added for bootstrap toggle switch
    BrowserAnimationsModule // added for bootstrap toggle switch
  ],

  providers: [D3Service, WorkflowService, BackendRequestClass,
    { provide: APP_INITIALIZER, useFactory: loadConfig, deps: [BackendRequestClass], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function loadConfig(config: BackendRequestClass) {
  return () => config.load();
}
