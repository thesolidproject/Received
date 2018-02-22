var app = angular.module('WorkflowWidget', ['d3']);
var d3 = angular.module('d3', [])
   .factory('d3service', ['$document', '$q', '$rootScope',
      function($document, $q, $rootScope) {
         var d = $q.defer();

         function onScriptLoad() {
            // Load client in the browser
            $rootScope.$apply(function() {
               d.resolve(window.d3);
            });
         }
         // Create a script tag with d3 as the source
         // and call our onScriptLoad callback when it
         // has been loaded
         var scriptTag = $document[0].createElement('script');
         scriptTag.type = 'text/javascript';
         scriptTag.async = true;
         scriptTag.src = 'sources/d3/d3.min.js';
         //scriptTag.src = '//cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3.min.js';
         scriptTag.onreadystatechange = function() {
            if (this.readyState == 'complete') onScriptLoad();
         };
         scriptTag.onload = onScriptLoad;

         var s = $document[0].getElementsByTagName('body')[0];
         s.appendChild(scriptTag);

         return {
            d3: function() {
               return d.promise;
            }
         };
      }
   ]);

// application controller
var ctrl = app.controller("treeCrtl", function($scope, $http) {

   // scope variable declarations
   $scope.data = {};
   $scope.tree = {}; // two-way bound scope variable
   $scope.workflowmeta = {};
   $scope.treearray = [];
   $scope.templateType = 'default';
   $scope.showDefault = true;
   $scope.showFlourish = false;
   $scope.viewInfo = {
      showDefault: true,
      showFlourish: false,
      showmeta: false
   };

   $http({
      method: 'GET',
      url: 'workflow.json'
   }).then(function(response) {
      $scope.data = response.data;

      //get workflow metadata from response
      $scope.workflowmeta = $scope.data[0].workflow;
      $scope.states = $scope.data[0].workflow.states;
      maketree();
   }, function(error) {
      throw error;
   });

   $scope.showDefault = function() {
      $scope.viewInfo.showDefault = true;
      $scope.viewInfo.showFlourish = false;
   };

   $scope.showFlourish = function() {
      $scope.viewInfo.showDefault = false;
      $scope.viewInfo.showFlourish = true;
   };

   $scope.showMeta = function() {
      $scope.viewInfo.showmeta = !$scope.viewInfo.showmeta;
   };

   function maketree() {
      var previous, current;
      for (var i = 0, len = $scope.states.length; i < len; i++) {
         current = $scope.states[i];

         // tree is empty push root node
         if ($scope.treearray.length === 0) {
            current.children = [];
            $scope.treearray.push(current);
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
            $scope.treearray[0].children.push(current);
         }
      }
      $scope.tree = Object.assign({}, $scope.treearray[0]);
   }
});

// flourish for workflow view
ctrl.directive("workFlourish", ['d3service', function(d3service) {
   return {
      restrict: 'E',
      scope: {
         tree: '='
      },
      link: function link(scope, el, attr) {
         d3service.d3().then(function(d3) {

            // needs to get from parent document
            var margin = {
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20
               },
               width = 960 - margin.right - margin.left,
               height = 960 - margin.top - margin.bottom; // edited so node expansion would fit
            var i = 0,
               duration = 750,
               root;
            var treeLayout = d3.layout.tree()
               .size([height, width]);

            var diagonal = d3.svg.diagonal()
               .projection(function(d) {
                  return [d.y, d.x];
               });

            var svg = d3.select(el[0]).append("svg")
               .attr("width", width + margin.right + margin.left)
               .attr("height", height + margin.top + margin.bottom)
               .append("g")
               .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Browser onresize event
            window.onresize = function() {
               scope.$apply();
            };

            // The time format for tooltip
            var formatTime = d3.time.format("%e %B");

            // watch for data changes and re-render
            scope.$watch('tree', function(newVals, oldVals) {
               return scope.render(newVals);
            }, true);

            // define render function
            scope.render = function(tree) {

               svg.selectAll('*').remove();
               //recursively collapse children
               function collapse(d) {
                  if (d.children) {
                     d._children = d.children;
                     d._children.forEach(collapse);
                     d.children = null;
                  }
               }

               // Toggle children on click.
               function click(d) {
                  if (d.children) {
                     d._children = d.children;
                     d.children = null;
                  } else {
                     d.children = d._children;
                     d._children = null;
                  }
                  update(d);
               }

               root = tree;
               root.x0 = height / 2;
               root.y0 = 0;
               root.children.forEach(collapse);
               update(root);

               d3.select(self.frameElement).style("height", "960px");

               function update(source) {
                  // Compute the new tree layout.
                  var nodes = treeLayout.nodes(root).reverse(),
                     links = treeLayout.links(nodes);

                  // Normalize for fixed-depth.
                  nodes.forEach(function(d) {
                     d.y = d.depth * 300;
                  }); // changed to make node expansion fit

                  // Update the nodes
                  var node = svg.selectAll("g.node")
                     .data(nodes, function(d) {
                        return d.id || (d.id = ++i);
                     });

                  // Enter any new nodes at the parent's previous position.
                  var nodeEnter = node.enter().append("g")
                     .attr("class", "node")
                     .attr("transform", function(d) {
                        return "translate(" + source.y0 + "," + source.x0 + ")";
                     })
                     .on("click", click);

                  nodeEnter.append('rect')
                     .attr('width', 1e-6)
                     .attr('height', 1e-6);

                  nodeEnter.append("text")
                     .attr("x", 10)
                     .attr("y", -8)
                     .attr("dy", ".35em")
                     .text(function(d) {
                        return d.name;
                     })
                     .style("font-size", '20px');

                  /*nodeEnter.append("text")
                  	.attr("y", 12)
                  	.attr("x", 6)
                  	.attr("dx", ".35em")
                  	.text(function(d) {
                  		//var percentcomplete = "Percent Complete: " + d.percentcomplete + "%"
                  		return d.percentcomplete;
                  	});*/
                  //console.log(nodeEnter);

                  //Append schedule status
                  // [&#xf155;]
                  nodeEnter.append("circle")
                     .attr("cx", 120)
                     .attr("cy", -30)
                     .attr("r", 8)
                     .style("fill", function(d) {
                        return (d.schedule == "S1") ? "blue" : "white";
                     })
                     .style("stroke", "black")
                     .style("stroke-width", '2px');

                  nodeEnter.append("circle")
                     .attr("cx", 140)
                     .attr("cy", -30)
                     .attr("r", 8)
                     .style("fill", function(d) {
                        return (d.schedule == "S2") ? "green" : "white";
                     })
                     .style("stroke", "black")
                     .style("stroke-width", '2px');

                  nodeEnter.append("circle")
                     .attr("cx", 160)
                     .attr("cy", -30)
                     .attr("r", 8)
                     .style("fill", function(d) {
                        return (d.schedule == "S3") ? "yellow" : "white";
                     })
                     .style("stroke", "black")
                     .style("stroke-width", '2px');

                  nodeEnter.append("circle")
                     .attr("cx", 180)
                     .attr("cy", -30)
                     .attr("r", 8)
                     .style("fill", function(d) {
                        return (d.schedule == "S4") ? "red" : "white";
                     })
                     .style("stroke", "black")
                     .style("stroke-width", '2px');

                  // Append cost


                  nodeEnter.append("circle")
                     .attr("cx", 180)
                     .attr("cy", 0)
                     .attr("r", 9)
                     .style("fill", "green")
                     .style("stroke", "black")
                     .style("stroke-width", '1px');
                  nodeEnter.append('text')
                     .attr("x", 176)
                     .attr("y", 5)
                     //.attr("dx", ".35em")
                     .style("font-family", "FontAwesome")
                     .style("font-size", "14px")
                     .style("color", "white")
                     .text(function(d) {
                        return "\uf155";
                     });

                  // Transition nodes to their new position.
                  var nodeUpdate = node.transition()
                     .duration(duration)
                     .attr("transform", function(d) {
                        return "translate(" + d.y + "," + d.x + ")";
                     });

                  var nodeHeight = 100,
                     nodeWidth = 200;
                  nodeUpdate.select('rect')
                     .attr('rx', 6) // rounded corners for rectangle
                     .attr('ry', 6) // rounded corners for rectangle
                     .attr('y', -(nodeHeight / 2))
                     .attr('width', nodeWidth)
                     .attr('height', nodeHeight)
                     .style('fill', function(d) {
                        if (d.quality == 'Q1') {
                           return '#7F90FC'
                        } else if (d.quality == 'Q2') {
                           return '#7FFD7F'
                        } else if (d.quality == 'Q3') {
                           return '#FFFE70'
                        } else if (d.quality == 'Q4') {
                           return '#FC6668'
                        } else {
                           return '#FFF'
                        }
                     })
                     .style("stroke", function(d) {
                        return (d.quality == 'Q4') ? "red" : "steelblue"
                     })
                     .style("stroke-width", function(d) {
                        return (d.quality == 'Q4') ? "8px" : "1.5px"
                     });


                  nodeUpdate.select("text")
                     .style("fill-opacity", 1);


                  // Transition exiting nodes to the parent's new position.
                  var nodeExit = node.exit().transition()
                     .duration(duration)
                     .attr("transform", function(d) {
                        return "translate(" + source.y + "," + source.x + ")";
                     })
                     .remove();

                  nodeExit.select('rect')
                     .attr('width', 1e-6)
                     .attr('height', 1e-6);

                  nodeExit.select("text")
                     .style("fill-opacity", 1e-6);

                  // Update the links
                  var link = svg.selectAll("path.link")
                     .data(links, function(d) {
                        return d.target.id;
                     });

                  // Enter any new links at the parent's previous position.
                  link.enter().insert("path", "g")
                     .attr("class", "link")
                     .attr("d", function(d) {
                        var o = {
                           x: source.x0,
                           y: source.y0
                        };
                        return diagonal({
                           source: o,
                           target: o
                        });
                     });

                  // Transition links to their new position.
                  link.transition()
                     .duration(duration)
                     .attr("d", diagonal);

                  // Transition exiting nodes to the parent's new position.
                  link.exit().transition()
                     .duration(duration)
                     .attr("d", function(d) {
                        var o = {
                           x: source.x,
                           y: source.y
                        };
                        return diagonal({
                           source: o,
                           target: o
                        });
                     })
                     .remove();

                  // Stash the old positions for transition.
                  nodes.forEach(function(d) {
                     d.x0 = d.x;
                     d.y0 = d.y;
                  });
               }
            }
         });
      }
   }
}]);

// default view for nodes
ctrl.directive("workDefault", ['d3service', function(d3service) {
   return {
      restrict: 'EA',
      scope: {
         tree: '='
      },
      link: function link(scope, el, attr) {
         d3service.d3().then(function(d3) {

            var margin = {
                  top: 20,
                  right: 120,
                  bottom: 20,
                  left: 120
               },
               width = 960 - margin.right - margin.left,
               height = 800 - margin.top - margin.bottom;
            var i = 0,
               duration = 750,
               root;
            var treeLayout = d3.layout.tree()
               .size([height, width]);

            var diagonal = d3.svg.diagonal()
               .projection(function(d) {
                  return [d.y, d.x];
               });

            var svg = d3.select(el[0]).append("svg")
               .attr("width", width + margin.right + margin.left)
               .attr("height", height + margin.top + margin.bottom)
               .append("g")
               .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Browser onresize event
            window.onresize = function() {
               scope.$apply();
            };

            // watch for data changes and re-render
            scope.$watch('tree', function(newVals, oldVals) {
               return scope.render(newVals);
            }, true);

            // define render function
            scope.render = function(tree) {

               svg.selectAll('*').remove();
               //recursively collapse children
               function collapse(d) {
                  if (d.children) {
                     d._children = d.children;
                     d._children.forEach(collapse);
                     d.children = null;
                  }
               }

               // Toggle children on click.
               function click(d) {
                  if (d.children) {
                     d._children = d.children;
                     d.children = null;
                  } else {
                     d.children = d._children;
                     d._children = null;
                  }
                  update(d);
               }

               root = tree;
               root.x0 = height / 2;
               root.y0 = 0;
               root.children.forEach(collapse);
               update(root);

               d3.select(self.frameElement).style("height", "800px");

               function update(source) {
                  // Compute the new tree layout.
                  var nodes = treeLayout.nodes(root).reverse(),
                     links = treeLayout.links(nodes);

                  // Normalize for fixed-depth.
                  nodes.forEach(function(d) {
                     d.y = d.depth * 180;
                  });

                  // Update the nodes
                  var node = svg.selectAll("g.node")
                     .data(nodes, function(d) {
                        return d.id || (d.id = ++i);
                     });

                  // Enter any new nodes at the parent's previous position.
                  var nodeEnter = node.enter().append("g")
                     .attr("class", "node")
                     .attr("transform", function(d) {
                        return "translate(" + source.y0 + "," + source.x0 + ")";
                     })
                     .on("click", click);

                  nodeEnter.append('rect')
                     .attr('width', 1e-6)
                     .attr('height', 1e-6);

                  nodeEnter.append("text")
                     .attr("x", 10)
                     .attr("y", -8)
                     .attr("dy", ".35em")
                     .text(function(d) {
                        return d.name;
                     })
                     .style("font-size", '20px');

                  nodeEnter.append("text")
                     .attr("x", 6)
                     .attr("y", 12)
                     .attr("dx", ".35em")
                     .text(function(d) {
                        var percentcomplete = "Percent Complete: " + d.percentcomplete + "%";
                        return percentcomplete;
                     });
                  console.log(nodeEnter);

                  // Transition nodes to their new position.
                  var nodeUpdate = node.transition()
                     .duration(duration)
                     .attr("transform", function(d) {
                        return "translate(" + d.y + "," + d.x + ")";
                     });

                  var nodeHeight = 100,
                     nodeWidth = 150;
                  nodeUpdate.select('rect')
                     .attr('rx', 6)
                     .attr('ry', 6)
                     .attr('y', -(nodeHeight / 2))
                     .attr('width', nodeWidth)
                     .attr('height', nodeHeight);



                  nodeUpdate.select("text")
                     .style("fill-opacity", 1);

                  // Transition exiting nodes to the parent's new position.
                  var nodeExit = node.exit().transition()
                     .duration(duration)
                     .attr("transform", function(d) {
                        return "translate(" + source.y + "," + source.x + ")";
                     })
                     .remove();

                  nodeExit.select('rect')
                     .attr('width', 1e-6)
                     .attr('height', 1e-6);

                  nodeExit.select("text")
                     .style("fill-opacity", 1e-6);

                  // Update the links
                  var link = svg.selectAll("path.link")
                     .data(links, function(d) {
                        return d.target.id;
                     });

                  // Enter any new links at the parent's previous position.
                  link.enter().insert("path", "g")
                     .attr("class", "link")
                     .attr("d", function(d) {
                        var o = {
                           x: source.x0,
                           y: source.y0
                        };
                        return diagonal({
                           source: o,
                           target: o
                        });
                     });

                  // Transition links to their new position.
                  link.transition()
                     .duration(duration)
                     .attr("d", diagonal);

                  // Transition exiting nodes to the parent's new position.
                  link.exit().transition()
                     .duration(duration)
                     .attr("d", function(d) {
                        var o = {
                           x: source.x,
                           y: source.y
                        };
                        return diagonal({
                           source: o,
                           target: o
                        });
                     })
                     .remove();

                  // Stash the old positions for transition.
                  nodes.forEach(function(d) {
                     d.x0 = d.x;
                     d.y0 = d.y;
                  });
               }
            }
         });
      }
   }
}]);

var btCrtl = app.controller("viewToggleCrtl", function($scope) {
   $scope.var = '<work-flourish tree="tree"></work-flourish>';
   $scope.change = function(where) {
      $scope.var = where;
   };
   $scope.templateType = 'default';
});

app.directive('flowToggle', function() {
   return {
      scope: {
         templateType: '@'
      },
      restrict: 'E',
      //replace: true,
      template: '<div ng-if="templateType == \'default\'">' +
         '</div>' + '<work-default tree="tree"></work-default>' +
         '<div ng-if="templateType == \'flourish\'">' +
         '<work-flourish tree="tree"></work-flourish>' +
         '</div>',
      link: function($scope, element, attrs) {
         $scope.toggleView = function() {
            console.log(element);
            this.template = '<work-default tree="tree"></work-default>';
         }
      }
   }
});
