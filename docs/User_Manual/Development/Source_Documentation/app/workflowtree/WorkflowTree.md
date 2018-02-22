# Workflow Widget

## Workflow Tree

**Date last Modified: 06 May 2017**

--------------------------------------------------------------------------------

Found in File: code/ang2/src/app/workflowtree/workflowtree.component.ts

### Introduction

The workflowtree.component.ts is the parent class that builds the primary workflow tree. This file outlines the functions, as well as their content with in-depth analysis and breakdowns - which may be improved in future development.

For Variables and Import statements, please refer to the App-WorkflowTree.md document provided in this directory.

### Functions

Please see the below table for an outline of functions within this class:

Link in Document                     | Function Name         | Short Description
------------------------------------ | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
[Jump To Def.](#constructor)         | Constructor()         | Allocates memory usage to build the workflow. While also assigning
[Jump To Def.](#ngOnInit)            | ngOnInit()            | On the initialization of the workflow application, the environment must first set the required variables to select states. This is where the root is set and the diagram is built.
[Jump To Def.](#getWorkflowMeta)     | getWorkflowMeta()     | Using the workflow service, get the metadata from the JSON object and set the results to the metadata of this class.
[Jump To Def.](#getStates)           | getStates()           | Gets the states from the JSON object so that the workflow can be built
[Jump To Def.](#extractTree)         | extractTree()         | Get the tree objects from the display and store the related data in an tree object.
[Jump To Def.](#setDimensions)       | setDimensions()       | Sets the dimensions for the workflow tree. Takes into consideration the margins of the document and applies the relative width and height.
[Jump To Def.](#createSVG)           | createSVG()           | Create a Node element in an SVG format. This is just for the parent node object.
[Jump To Def.](#declareTreeLayout)   | declareTreeLayout()   | Sets the tree layout by considering the size of the tree and mapping the appropriate nodes.
[Jump To Def.](#assignRootPositions) | assignRootPositions() | Sets the root positions of the tree, considering the position of all direct children.
[Jump To Def.](#diagonal)            | diagonal()            | _Deprecated_ Sets the path of the line from a child node to the parent.
[Jump To Def.](#updateTree)          | updateTree()          | Builds the tree based on the input data. This method is comprised of several smaller methods, that each contribute to building the tree and setting each node's location.

#### Constructor

```
constructor(element: ElementRef, d3service: D3Service, private workflowService: WorkflowService) {
  this.d3 = d3service.getD3();
  this.parentNativeElement = element.nativeElement;
}
```

#### ngOnInit

```
ngOnInit() {
  // gets and sets data from data service
  this.getWorkflowMeta();
  this.getStates();
  this.setDimensions();
  this.createSVG();
  this.declareTreeLayout();
  this.assignRootPositions();
  this.updateTree(this.root);
  if (this.data) {
    this.updateTree(this.root);
  }
}
```

#### ngOnChanges

```
ngOnChanges() {
  if (this.tree) {
    this.updateTree(this.root);
  }
}
```

#### getWorkflowMeta

```
getWorkflowMeta() {
  this.workflowService.getWorkflowMeta()
    .subscribe(
      meta => { this.meta = meta; },
      error => this.errorMessage = <any>error);
}
```

#### getStates

```
getStates() {
  this.workflowService.getStates()
    .subscribe(
      states => { this.states = states; },
      error => this.errorMessage = <any>error);
}
```

#### extractTree

```
extractTree(res: any): Tree {
    const states = res[0].workflow.states;
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
```

#### setDimensions

```
setDimensions() {
    this.margin = {top: 20, right: 120, bottom: 20, left: 120},
    this.width = 1200 - this.margin.right - this.margin.left,
    this.height = 1200 - this.margin.top - this.margin.bottom;
}
```

#### createSVG

```
createSVG() {
  const d3 = this.d3;
  let element = this.treeContainer.nativeElement;
  this.svg = d3.select(element).append("svg")
    .attr("width", this.width + this.margin.right + this.margin.left)
    .attr("height", this.height + this.margin.top + this.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
}
```

#### declareTreeLayout

```
declareTreeLayout() {
    const d3 = this.d3;
    this.treemap = d3.tree().size([this.height, this.width]);
  }
```

#### assignRootPositions

```
assignRootPositions() {
    const d3 = this.d3;
    this.tree = this.extractTree(this.data);
    this.root = d3.hierarchy(this.tree, function(d) { return d.children; });
    this.root.x0 = this.height / 2;
    this.root.y0 = 0;
  }
```

#### updateTree

```
updateTree(source) {

    let i = 0;
    // Assigns the x and y position for the nodes
    let treeData = this.treemap(this.root);

    // console.log(this.root);

    // Compute the new tree layout
    let nodes = treeData.descendants(),
        links = treeData.descendants().slice(1);

    // Normalize for fixed-depth
    nodes.forEach(function(d) { d.y = d.depth * 180});

    // Nodes section //

    let node = this.svg.selectAll('g.node')
        .data(nodes, function(d) { return d.id || (d.id = ++this.i); });

    // console.log(node);

    let nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
    .on('click', this.click);

    nodeEnter.append('rect')
      .attr('width', 1e-6)
      .attr('height', 1e-6)

    nodeEnter.append("text")
      .attr("x", 10)
      .attr("y", -8)
      .attr("dy", ".35em")
      .text(function(d) { return d.data.name; });

    nodeEnter.append("text")
      .attr("y", 12)
      .attr("x", 6)
      .attr("dx", ".35em")
      .text(function(d) { return d.data.desc; });

    let images = nodeEnter.append("svg:image")
        .attr("xlink:href",  function(d) {
          if (d.data.schedule == 'S1') {return "http://i.imgur.com/k0srehK.png"}
          else if (d.data.schedule == 'S2') {return "http://i.imgur.com/JLwtary.png"}
          else if (d.data.schedule == 'S3') {return "http://i.imgur.com/OMtxjuq.png"}
          else if (d.data.schedule == 'S4') {return "http://i.imgur.com/VTsIXhi.png"}
          else {return "http://i.imgur.com/uUyHbKP.png"}
          })
          .attr("y", -65)
          .attr("x", 88)
          .attr("height", 150)
          .attr("width", 55);

    nodeEnter.append("svg:image")
      .attr("xlink:href",  function(d) {
        if (d.data.cost == 'C1') {return "http://i.imgur.com/W8eIxxE.png"}
        else if (d.data.cost == 'C2') {return "http://i.imgur.com/hSveatT.png"}
        else if (d.data.cost == 'C3') {return "http://i.imgur.com/tNO2RJY.png"}
        else if (d.data.cost == 'C4') {return "http://i.imgur.com/lVFdPzx.png"}
        else {return "http://i.imgur.com/uUyHbKP.png"}
        })
        .attr("y", -85)
        .attr("x", 88)
        .attr("height", 150)
        .attr("width", 55);



    // UPDATE Nodes

    let nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
  nodeUpdate.transition()
    .duration(this.duration)
    .attr("transform", function(d) {
        return "translate(" + d.y + "," + d.x + ")";
     });

  // Update the node attributes and style
  nodeUpdate.select('circle.node')
    .attr('r', 10)
    .style("fill", function(d) {
        return d._children ? "lightsteelblue" : "#fff";
    })
    .attr('cursor', 'pointer');


  let nodeHeight = 40, nodeWidth = 150;

  nodeUpdate.select('rect')
    .attr('rx', 6)
    .attr('ry', 6)
    .attr('y', -(nodeHeight / 2))
    .attr('width', nodeWidth)
    .attr('height', nodeHeight)
    .style('fill', function(d) {
      if (d.data.quality == 'Q1') {return '#7F90FC'}
      else if (d.data.quality == 'Q2') {return '#7FFD7F'}
      else if (d.data.quality == 'Q3') {return '#FFFE70'}
      else if (d.data.quality == 'Q4') {return '#FC6668'}
      else {return '#FFF'}
    });

    nodeUpdate.select("text")
      .style("fill-opacity", 1);

    // Node exit
    let nodeExit = node.exit().transition()
      .duration(this.duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select('rect')
    .attr('width', 1e-6)
    .attr('height', 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);


  // Update the links…
  let link = this.svg.selectAll('path.link')
      .data(links, function(d) {
        console.log(d);
        return d.id;
      });

  //Enter any new links at the parent's previous position.
  // ** I dont know if this is correct, but it compiles
  let linkEnter = link.enter().insert('path', 'g')
      .attr('class', 'link')
      .attr('d', function(d){
        var o = {x: source.x0, y: source.y0};
        let path = `M ${source.y0} ${source.x0}
                    C ${(source.y + d.y) / 2} ${source.x},
                      ${(source.y + d.y) / 2} ${d.x},
                      ${d.y} ${d.x}`;
        return path;
        // return this.diagonal(d);
      });

  // Transition links to their new position.
  link.transition()
      .duration(this.duration)
    .attr('d', function(d){
      // return this.diagonal(d, d.parent)
      var o = {x: d.x0, y: d.parent.y0};
      let path = `M ${source.y0} ${source.x0}
                    C ${(source.y + d.y) / 2} ${source.x},
                      ${(source.y + d.y) / 2} ${d.x},
                      ${d.y} ${d.x}`;
      return path;
    });

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(this.duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        let path = `M ${source.y0} ${source.x0}
                    C ${(source.y + d.y) / 2} ${source.x},
                      ${(source.y + d.y) / 2} ${d.x},
                      ${d.y} ${d.x}`;
        return path;
        // return this.diagonal(d);
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
```
