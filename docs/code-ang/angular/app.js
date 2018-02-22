var app = angular.module('WorkflowWidget',['d3']);
var d3 = angular.module('d3', [])
	.factory('d3service',['$document', '$q', '$rootScope',
		function($document, $q, $rootScope) {
			var d = $q.defer();
			function onScriptLoad() {
				// Load client in the browser
				$rootScope.$apply(function() { d.resolve(window.d3); });
			}
			// Create a script tag with d3 as the source
			// and call our onScriptLoad callback when it
			// has been loaded
			var scriptTag = $document[0].createElement('script');
			scriptTag.type = 'text/javascript';
			scriptTag.async = true;
			scriptTag.src = 'sources/d3/d3.min.js';
			//scriptTag.src = '//cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3.min.js';
			scriptTag.onreadystatechange = function () {
				if (this.readyState == 'complete') onScriptLoad();
			};
			scriptTag.onload = onScriptLoad;

			var s = $document[0].getElementsByTagName('body')[0];
			s.appendChild(scriptTag);

			return {
				d3: function() { return d.promise; }
			};
	}]);

var ctrl = app.controller("treeCrtl", function ($scope, $http) {

	// variable declarations
	$scope.data = {};
	$scope.tree = {};	// two-way bound scope variable
	$scope.workflowmeta = {};
	$scope.treearray = [];

	$http({
		method: 'GET',
		url: 'workflow.json'
	}).then(function (response){
		$scope.data = response.data;

		//get workflow metadata from response
		$scope.workflowmeta = $scope.data[0].workflow;
		$scope.states = $scope.data[0].workflow.states;

		console.log($scope.tree);
		maketree();
		console.log($scope.tree);

	},function (error){
		throw error;
	});

	function maketree() {
		var previous, current;
		for (var i = 0, len = $scope.states.length; i < len; i++) {
			current = $scope.states[i];
			//delete current['children'];
			//console.log(typeof current.children);

			// tree is empty push root node
			if ($scope.treearray.length === 0) {
				current.children = [];
				$scope.treearray.push(current);
				previous = current;
				//console.log(previous.id, current.id + 1, (current.id + 1 === previous.id + 1));
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
		console.log($scope.tree);
	}
});

ctrl.directive("workFlourish", ['d3service', function (d3service) {
	return {
		restrict: 'EA',
		scope: {
			tree: '='
		},
		link: function link(scope, el, attr) {
			d3service.d3().then(function(d3) {

				var margin = { top: 20, right: 120, bottom: 20, left: 120 },
					width = 960 - margin.right - margin.left,
					height = 800 - margin.top - margin.bottom;
				var i = 0,duration = 750,root;
				var treeLayout = d3.layout.tree()
					.size([height, width]);

				var diagonal = d3.svg.diagonal()
					.projection(function (d) { return [d.y, d.x]; });

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

					console.log(tree);
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
						}
						else {
							d.children = d._children;
							d._children = null;
						}
						update(d);
					}

					//console.log(scope);
					//console.log(scope.data);
					 root = tree;
					 console.log(root);
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
						nodes.forEach(function (d) { d.y = d.depth * 180; });

						// Update the nodesâ€¦
						var node = svg.selectAll("g.node")
							.data(nodes, function (d) { return d.id || (d.id = ++i); });

						// Enter any new nodes at the parent's previous position.
						var nodeEnter = node.enter().append("g")
							.attr("class", "node")
							.attr("transform", function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
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
							.style("fill-opacity", 1e-6);

						nodeEnter.append("text")
							.attr("y", 12)
							.attr("x", 6)
							.attr("dx", ".35em")
							.text(function(d) {
								return d.desc;
							});

						//Append schedule status
						var images = nodeEnter.append("svg:image")
							.attr("xlink:href", function(d) {
								console.log(d);
								if (d.schedule == 'S1') {
									return "http://i.imgur.com/k0srehK.png"
								} else if (d.schedule == 'S2') {
									return "http://i.imgur.com/JLwtary.png"
								} else if (d.schedule == 'S3') {
									return "http://i.imgur.com/OMtxjuq.png"
								} else if (d.schedule == 'S4') {
									return "http://i.imgur.com/VTsIXhi.png"
								} else {
									return "http://i.imgur.com/uUyHbKP.png"
								}
							})
							.attr("y", -65)
							.attr("x", 88)
							.attr("height", 150)
							.attr("width", 55);

						nodeEnter.append("svg:image")
							.attr("xlink:href", function(d) {
								if (d.cost == 'C1') {
									return "http://i.imgur.com/W8eIxxE.png"
								} else if (d.cost == 'C2') {
									return "http://i.imgur.com/hSveatT.png"
								} else if (d.cost == 'C3') {
									return "http://i.imgur.com/tNO2RJY.png"
								} else if (d.cost == 'C4') {
									return "http://i.imgur.com/lVFdPzx.png"
								} else {
									return "http://i.imgur.com/uUyHbKP.png"
								}
							})
							.attr("y", -85)
							.attr("x", 88)
							.attr("height", 150)
							.attr("width", 55);

						// Transition nodes to their new position.
						var nodeUpdate = node.transition()
							.duration(duration)
							.attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; });

						var nodeHeight = 40,
							nodeWidth = 150;
						nodeUpdate.select('rect')
							.attr('rx', 6)
							.attr('ry', 6)
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

						nodeUpdate.select("text")
							.style("fill-opacity", 1);

						// Transition exiting nodes to the parent's new position.
						var nodeExit = node.exit().transition()
							.duration(duration)
							.attr("transform", function (d) { return "translate(" + source.y + "," + source.x + ")"; })
							.remove();

						nodeExit.select('rect')
							.attr('width', 1e-6)
							.attr('height', 1e-6);

						nodeExit.select("text")
							.style("fill-opacity", 1e-6);

						// Update the links
						var link = svg.selectAll("path.link")
							.data(links, function (d) { return d.target.id; });

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
						nodes.forEach(function (d) {
							d.x0 = d.x;
							d.y0 = d.y;
						});
					}

					function searchTree(obj, search, path) {
						if (obj.name === search) { //if search is found return, add the object to the path and return it
							path.push(obj);
							return path;
						}
						else if (obj.children || obj._children) { //if children are collapsed d3 object will have them instantiated as _children
							var children = (obj.children) ? obj.children : obj._children;
							for (var i = 0; i < children.length; i++) {
								path.push(obj);// we assume this path is the right one
								var found = searchTree(children[i], search, path);
								if (found) {// we were right, this should return the bubbled-up path from the first if statement
									return found;
								}
								else {//we were wrong, remove this parent from the path and continue iterating
									path.pop();
								}
							}
						}
						else {//not the right object, return false so it will continue to iterate in the loop
							return false;
						}
					}

					/*
					 function extract_select2_data(node, leaves, index) {
					 if (node.children) {
					 for (var i = 0; i < node.children.length; i++) {
					 index = extract_select2_data(node.children[i], leaves, index)[0];
					 }
					 }
					 else {
					 leaves.push({ id: ++index, text: node.name });
					 }
					 return [index, leaves];
					 }
					 */
				}
			});
		}
	}
}]);
