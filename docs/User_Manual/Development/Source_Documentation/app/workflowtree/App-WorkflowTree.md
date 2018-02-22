# Workflow Widget

## Workflow Tree

**Date last Modified: 06 May 2017**

--------------------------------------------------------------------------------

Found in File: code/ang2/src/app/workflowtree/

### Introduction

Similar to that of the Driver Program, the workflow tree set up the foundation for the workflow.

File                           | Description
------------------------------ | -------------------------------------------------------------------
workflowtree.component.css     | Styling Template Document for the workflow tree.
workflowtree.component.htnl    | Template for the workflow tree, that will be printed to the screen.
workflowtree.component.js      | Script that builds the workflow tree, based on components.
workflowtree.component.spec.ts | Script that assigns and compiles each workflow component
workflowtree.component.ts      | Primary class that builds the tree (breakdown below)

### Workflow Tree Construction

#### Import Statements

Each import, shown below, is required to allow proper function in our tree. From controlling what occurs in our clicks to managing our workflow objects; each serves a purpose.

```
import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import {WorkflowService} from '../workflow.service';
import {WorkflowMeta} from '../workflow-meta';
import {State} from '../state';
import {Tree} from '../tree';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
```

Imported Class   | Function
---------------- | -----------------------------------------------------------------------------------------------------------------------------------------------------
Angular Core     | Core elements from Angular-CLI are required to connect to our library. These components and function are broken down in the table directly following.
D3Service        | Our program integrates with D3 and Angular. This class manages the functionality between the two.
WorkflowService  |
State            | Object created to maintain and operate the data within each state.
Tree             | Object created to maintain and operate the tree of states in the workflow diagram.
Observable       | Controls the click interaction with each state, and the state of the tree.
~/operator/map   | Uses the mapping functionality to assist with building the trees
~/operator/catch | Uses error handling classes that catch when a particular piece of data is missing.
~/operator/do    | Allow for loops within the program so that we can hide/show all nodes when requested.

#### Component Object

The overall workflow component is encapsulated in this class. We use this block to tell the Widget where to find the template, the styling document and the type of view encapsulation.

```
@Component({
  selector: 'app-workflowtree',
  templateUrl: './workflowtree.component.html',
  styleUrls: ['./workflowtree.component.css'],
  encapsulation: ViewEncapsulation.None
})
```

Attribute     | Value Description
------------- | -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
Selector      | The application to run in app-[subfolder] naming scheme
TemplateURL   | The template to build, regarding the page
StyleURLs     | The relative location of the style document(s)
Encapsulation | The method to encapsulate the application {Emulated, Native, None}. See definition [here](https://angular.io/docs/ts/latest/api/core/index/ViewEncapsulation-enum.html)

## Class Variables

In order to maintain efficiency in our widget, there must be some class variables that control different portions. Items includeL the animation duration, default error messages, and D3 Data. Please see the table below for explicit definitions of each attribute.

```
@ViewChild('tree') private treeContainer: ElementRef;
@Input() private data: any;
private s: any;
private d: any;
private d3: D3; // private member let to hold d3 reference
private margin;
private parentNativeElement: any;
private svg: any;
private width: number;
private height: number;
private root: any;
private duration: 750;
private treemap: any;
private tree: any;
errorMessage: string;
meta: WorkflowMeta;
states: State[];
```

Variable            | Type         | Description
------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
s                   | ANY          | **Not Used**
d                   | ANY          | Used to assign the diagonal position of the nodes. See diagonal() for more info.
d3                  | D3           | Private member let to hold d3 reference
margin              | ANY          | Used to set the margins of the workflow. This value is set in setDimensions();
parentNativeElement | ANY          | **Not Used**
svg                 | ANY          | Used to create a custom SVG for each node. This value is modified and used in createSVG()
width               | NUMBER       | Used to set the width of the workflow. This value is set in setDimensions()
height              | NUMBER       | Used to set the height of the workflow. This value is set in setDimensions()
root                | ANY          | Controls the root node in the workflow. This value is set in assignRootPositions()
duration            | NUMBER       | Duration of the animation when expanding and collapsing nodes.
treemap             | ANY          | The map of the tree, declared when initializing the tree from the D3 service. Treemap is the parent object of Tree(), which houses the visualization and data objects. This value is set in declareTreeLayout()
tree                | ANY          | The explicit data, taken from the treemap.
errorMessage        | ANY          | String to display the current error when one arises.
meta                | WORKFLOWMETA | Metadata of the workflow. This is taken from the Workflow JSON object.
states              | State[]      | The array of states to be shown in the tree. Each node is a state.

## Function Operations

Due to the amount of methods in this class, the function operations have been moved to a seperate document, with in-depth analysis of their primary functions. Please see the document "App-WorkflowTree-Functions.md" [here]() to view.
