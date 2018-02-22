import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation, ViewContainerRef } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import {WorkflowService} from '../workflow.service';
import {WorkflowMeta} from '../workflow-meta';
import {State} from '../state';
import {Tree} from '../tree';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import {BackendRequestClass} from '../backend.request';
import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';

@Component({
  selector: 'app-simpletree',
  templateUrl: './simpletree.component.html',
  styleUrls: ['./simpletree.component.css']
})
export class SimpletreeComponent implements OnInit {
  @ViewChild('tree') private treeContainer: ElementRef;
  @Input() private data: any;
  private d3: D3; // private member let to hold d3 reference
  private margin;
  private parentNativeElement: any;
  private svg: any;
  private width: number;
  private height: number;
  private root: any;
  private duration: 750;
  private treemap: any;
  private currentState: any;
  private nWidth: any;
  private nHeight: any;
  tooltip: any;
  tree: any;
  errorMessage: string;
  meta: WorkflowMeta;
  states: State[];
  colors = {
    indigo: '#14143e',
    pink: '#fd1c49',
    orange: '#ff6e00',
    yellow: '#f0c800',
    mint: '#00efab',
    cyan: '#05d1ff',
    purple: '#841386',
    white: '#fff'
  };

  constructor(element: ElementRef, d3service: D3Service, private workflowService: WorkflowService, private backend: BackendRequestClass,
              overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal) {
    this.d3 = d3service.getD3();
    this.parentNativeElement = element.nativeElement;
    overlay.defaultViewContainer = vcRef;
  }

  ngOnInit() {
    // gets and sets data from data service
    this.getWorkflowMeta();
    this.getStates();
    this.initDimensions();
    // this.setDimensions();
    this.createSVG();
    this.declareTreeLayout();
    this.assignRootPositions();
    this.updateTree(this.root);
  }

  getWorkflowMeta() {
    this.workflowService.getWorkflowMeta()
      .subscribe(
        meta => { this.meta = meta; },
        error => this.errorMessage = <any>error);
  }

  getStates() {
    this.workflowService.getStates()
      .subscribe(
        states => { this.states = states; },
        error => this.errorMessage = <any>error);
  }

  extractTree(res: any): Tree {
    const states = res[0].workflow.states;
    console.log(res[0].workflow.state.id);
    const treearray = [];
    this.currentState = res[0].workflow.state.id;
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
        previous = current;
        treearray[0].children.push(current);
      }
    }
    tree = Object.assign({}, treearray[0]);
    // console.log(tree);
    return tree;
  }

  /*  Method initializes dimensions for the svg object
   *  Params: none */
  initDimensions() {

    this.margin = {top: 20, right: 20, bottom: 20, left: 20};
    this.height = window.innerHeight - 50 - this.margin.top - this.margin.bottom;
    this.width = window.innerWidth - this.margin.right - this.margin.left;

    // this.nHeight = 40;
    // this.nWidth = 220;
    this.nHeight = window.innerHeight / 18;
    this.nWidth = window.innerWidth / 7;
  }

  /*  Sets new dimensions for tree
   *  Params: (all optional) height and width of window and node object after window resize */
  setDimensions(newHeight?, newWidth?, nodeH?, nodeW?) {

    // this.margin = {top: 20, right: 20, bottom: 20, left: 20};
    newHeight != null ? this.height = newHeight - this.margin.top - this.margin.bottom :
      this.height = 1000 - this.margin.top - this.margin.bottom;
    newWidth != null ? this.width = newWidth - this.margin.right - this.margin.left :
      this.width = 1400 - this.margin.right - this.margin.left;
    // console.log(this.height);
    this.nWidth = nodeW;
    this.nHeight = nodeH;
  }

  onResize(event) {
    const d3 = this.d3;
    let nodeH = 0, nodeW;
    const newHeight = event.target.innerHeight - 50;
    console.log('newHeight %i', newHeight);
    const newWidth = event.target.innerWidth - 50;
    console.log('newWidth %i', newWidth);
    (newHeight < 740) ? nodeH = newHeight / 18 : nodeH = 40;
    (newWidth < 1500) ? nodeW = newWidth / 7 : nodeW = 220;

    // clears svg element for new tree
    d3.select('svg').remove();

    // need to update dimensions after getting these new sizes
    this.getWorkflowMeta();
    this.getStates();
    this.setDimensions(newHeight, newWidth, nodeH, nodeW);
    this.createSVG();
    this.declareTreeLayout();
    this.assignRootPositions();
    this.updateTree(this.root);
  }

  createSVG() {
    const d3 = this.d3;
    const width = this.width;
    const height = this.height;
    console.log(height);
    // let element = this.parentNativeElement;
    const element = this.treeContainer.nativeElement;
    this.svg = d3.select(element).append('svg')
      .attr('width', this.width + this.margin.right + this.margin.left)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    // declares tooltip element
    this.tooltip = d3.select(element).append('div').attr('class', 'toolTip');
  }

  declareTreeLayout() {
    console.log(this.height);
    const d3 = this.d3;
    this.treemap = d3.tree().size([this.height, this.width]);
  }

  assignRootPositions() {
    // console.log(this.height);
    const d3 = this.d3;
    this.tree = this.extractTree(this.data);
    // console.log(this.data);
    // this.tree = this.data;
    this.root = d3.hierarchy(this.tree);
    this.root.x0 = this.height / 2;
    // console.log(this.root.x0);
    this.root.y0 = 0;
  }

  diagonal(source, destination) {
    console.log(source);
    console.log(destination);
    var x = destination.x + 150 / 2;
    var y = destination.y;
    var px = source.x + 40 / 2;
    var py = source.y + 40;
    return 'M' + x + ',' + y
      + 'C' + x + ',' + (y + py) / 2
      + ' ' + x + ',' + (y + py) / 2
      + ' ' + px + ',' + py;
  }


  updateTree(source) {
    const modal = this.modal;
    let nodeHeight = this.nHeight;
    let nodeWidth = this.nWidth;
    const d3 = this.d3;
    const costOffset = 18; // offset in px for the cost symbol based on symbol size
    let currentState = this.currentState;
    let i = 0;

    // Assigns the x and y position for the nodes
    let treeData = this.treemap(this.root);

    // Compute the new tree layout
    let nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

    // Normalize for fixed-depth
    nodes.forEach(function(d) {  d.y = d.depth * (nodeWidth + 25); });

    // Nodes section //

    let node = this.svg.selectAll('g.node')
      .data(nodes, function(d) {
        return d.id || (d.id = ++i);
      });

    // Enter any new modes at the parent's previous position.
    let nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr('transform', function(d) {
        return 'translate(' + source.y0 + ',' + source.x0 + ')';
      });

			nodeEnter.append('rect')
	      .attr('width', 1e-6)
	      .attr('height', 1e-6)
	      .on('mouseover', function(d) {


        const xPosition = this.getBoundingClientRect().left + (nodeWidth / 10);
        const yPosition = (this.getBoundingClientRect().top - (nodeHeight * 2.5));

        // console.log(this.getBoundingClientRect());
        // console.log(this.getBoundingClientRect().top);
        // console.log(yPosition);
        d3.select('#tooltip')
          .style('left', xPosition + 'px')
          .style('top', yPosition + 'px')
          .select('#value')
          .text(d.data.desc);
				d3.select('#tooltip')
					.select('#progress')
					.text(d.data.percentcomplete);

        d3.select('#tooltip').classed('hidden', false);
      })
      .on('mouseout', function() {
        d3.select('#tooltip').classed('hidden', true);
      })
      .on('click', function(d){
        d3.select('#tooltip').classed('hidden', true);

        modal.alert()
          .size('lg')
          .showClose(true)
          .titleHtml(`State ID: ` + d.data.id)
					.body(`<!--<h4>State Details:</h4>-->
						<div class="description-container">
								<span class="modal-stateID"> State ID: ` + ' ' + d.data.id + `</span>
								<span class="modal-stateName">` + ' ' + d.data.name + `</span>
								<span class="modal-description">` + ' ' + d.data.desc + `</span>
						</div>
                 <div class="stateMeta">
									 <ul class="first-col">
										<li>Status:` + ' ' + d.data.status + `</li>
										<li>Rev:` + ' ' + d.data.rev + `</li>
										<li>Iteration:` + ' ' + d.data.iteration + `</li>
										<li>Percent Complete:` + ' ' + d.data.percentcomplete + `</li>
										<!--<li>Participants:` + ' ' + d.data.participants + `</li>-->
									</ul>
									<ul class="second-col">
										<li>Actual Hours:` + ' ' + d.data.actualhours + `</li>
										<li>Planned Hours:` + ' ' + d.data.plannedhours + `</li>
										<li>Start:` + ' ' + d.data.start + `</li>
										<li>End:` + ' ' + d.data.end + `</li>
									</ul>
                 </div>
          `)
          .open();
      })
      .on('dblclick', function(d) {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        this.update(d);
      });

			nodeEnter.append('text')
				.attr("id", "state-name")
	      .attr('x', 10)
	      //.attr('y', -8)
				.attr('y', function (d){
	        return nodeHeight / 12;
	      })
	      .attr('dy', '.35em')
	      .text(function(d) { return d.data.name; });

    // UPDATE Nodes

    let nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate.transition()
      .duration(this.duration)
      .attr('transform', function(d) {
        return 'translate(' + d.y + ',' + d.x + ')';
      });

			nodeUpdate.selectAll('rect')
		    .attr('rx', 6)
		    .attr('ry', 6)
		    .attr('y', -(nodeHeight / 2))
		    .attr('width', nodeWidth)
		    .attr('height', nodeHeight)
		    .style('fill', function(d) {
		      if (d.data.quality == 'Q1') {return '#7F90FC'; }
		      else if (d.data.quality == 'Q2') {return '#7FFD7F'; }
		      else if (d.data.quality == 'Q3') {return '#FFFE70'; }
		      else if (d.data.quality == 'Q4') {return '#FC6668'; }
		      else {return '#FFF'; }
		    })
		    .style('stroke', function (d){
		      return (d.data.id === currentState) ? '#05d1ff' : '#636363';
		    })
		    .style('stroke-width', function (d){
		    return (d.data.id === currentState) ? '5px' : '2.5px';
		  });

    nodeUpdate.select('text')
      .style('fill-opacity', 1);

    // Node exit
    let nodeExit = node.exit().transition()
      .duration(this.duration)
      .attr('transform', function(d) { return 'translate(' + source.y + ',' + source.x + ')'; })
      .remove();

    nodeExit.select('rect')
      .attr('width', 1e-6)
      .attr('height', 1e-6);

    nodeExit.select('text')
      .style('fill-opacity', 1e-6);


    // Update the links…
    let link = this.svg.selectAll('.link')
      .data(links);

    // Enter any new links at the parent's previous position.
    // ** I dont know if this is correct, but it compiles
    let linkEnter = link.enter().insert('path', 'g')
      .attr('class', 'link')
      .attr('d', function(d){
        // let o = {x: source.x0, y: source.y0};
        // return this.diagonal(o, o);
        return 'M' + d.y + ',' + d.x + 'C' + (d.y + d.parent.y) / 2 + ',' + d.x + ' ' + (d.y + d.parent.y) / 2 + ',' + d.parent.x + ' ' + d.parent.y + ',' + d.parent.x;
      });

    // Transition links to their new position.
    link.transition()
      .duration(this.duration)
      .attr('d', function(d){
        var o = {x: d.x0, y: d.parent.y0};
        // return this.diagonal(d, d.parent);
        return 'M' + d.y + ',' + d.x + 'C' + (d.y + d.parent.y) / 2 + ',' + d.x + ' ' + (d.y + d.parent.y) / 2 + ',' + d.parent.x + ' ' + d.parent.y + ',' + d.parent.x;
      });


    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(this.duration)

      .attr('d', function(d) {
        // var o = {x: source.x, y: source.y};
        // return this.diagonal(o, o);
        return 'M' + d.y + ',' + d.x + 'C' + (d.y + d.parent.y) / 2 + ',' + d.x + ' ' + (d.y + d.parent.y) / 2 + ',' + d.parent.x + ' ' + d.parent.y + ',' + d.parent.x;
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

// Toggle children on click.
  click(d) {
    console.log(this.root);
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    console.log(d);
    this.updateTree(d);
  }

  collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(this.collapse);
      d.children = null;
    }
  }
}
