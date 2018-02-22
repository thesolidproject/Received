"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/map");
var WorkflowService = (function () {
    function WorkflowService(http) {
        this.http = http;
        this.workflowUrl = '/data/workflow.json'; // can be changed
    }
    WorkflowService.prototype.getWorkflowMeta = function () {
        return this.http.get(this.workflowUrl).map(this.extractMeta).catch(this.handleError);
    };
    WorkflowService.prototype.extractMeta = function (res) {
        var body = res.json();
        return body[0].workflow || {};
    };
    WorkflowService.prototype.handleError = function (error) {
        // In a real world app, you might use a remote logging infrastructure
        var errMsg;
        if (error instanceof http_1.Response) {
            var body = error.json() || '';
            var err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || '') + " " + err;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable_1.Observable.throw(errMsg);
    };
    return WorkflowService;
}());
WorkflowService = __decorate([
    core_1.Injectable()
], WorkflowService);
exports.WorkflowService = WorkflowService;
