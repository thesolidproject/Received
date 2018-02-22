/**
 * Created by chrislarsen on 3/21/17.
 */
Ext.define('WorkflowWidget.view.WorkflowFlourishViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.flourish',

    /**
     * Called when the view is created
     */

    config: {
        stores: [
            'workStore'
        ]
    },
    requires: [
        'WorkflowWidget.model.NodeModel',
        'WorkflowWidget.reader.WorkflowReader',
        'WorkflowWidget.view.WorkflowFlourishViewModel',
        'WorkflowWidget.store.WorkflowStore'
    ],
    init: function() {

    },

<<<<<<< HEAD
    onSceneSetup: function (component, scene) {

        var margin = {top: 20, right: 120, bottom: 20, left: 120},
=======
    onSceneSetup: function(component, scene) {
        var margin = {
                top: 20,
                right: 120,
                bottom: 20,
                left: 120
            },
>>>>>>> mikal
            width = 1200 - margin.right - margin.left,
            height = 1200 - margin.top - margin.bottom;

        var i = 0,
            duration = 750,
            root;

        var tree = d3.layout.tree().size([height, width]);


        var diagonal = d3.svg.diagonal()
            .projection(function(d) {
                return [d.y, d.x];
            });

        var svg = scene
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.json("/data/flare.json", function(error, flare) {
            if (error) throw error;

            root = flare;
            root.x0 = height / 2;
            root.y0 = 0;
            //console.log(svg);
            //console.log(root);
            //console.log(flare);

            root.children.forEach(collapse);
            update(root);
        });

        d3.select(self.frameElement).style("height", "800px");

        function collapse(d) {
            if (d.children) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
            }
        }

        function update(source) {

            // Compute the new tree layout.
            var nodes = tree.nodes(root).reverse(),
                links = tree.links(nodes);
            //console.log(nodes);

            // Normalize for fixed-depth.
            nodes.forEach(function(d) {
                d.y = d.depth * 180;
            });

            // Update the nodes…
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
                //.style('fill', function(d) { return d._children ? 'lightsteelblue' : '#fff'; });

            /* state name location */
            nodeEnter.append("text")
                .attr("x", 6)
                .attr("y", -12)
                .attr("dy", ".35em")
                .text(function(d) {
                    return d.name;
                })
                .style("fill-opacity", 1e-6);

            /* state description location */
            nodeEnter.append("text")
                .attr("y", 12)
                .attr("x", 0)
                .attr("dx", ".35em")
                .text(function(d) {
                    return d.desc;
                })
            //.style("fill-opacity", 1e-6);

            /* Append schedule status */
            var images = nodeEnter.append("svg:image")
                .attr("xlink:href", function(d) {
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
                .attr("y", -70)
                .attr("x", 120)
                .attr("height", 150)
                .attr("width", 55);
            /*
                .attr("y", -32)
                .attr("x", 10)
                .attr("height", 150)
                .attr("width", 55);
				*/

            /* cost value */
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
                .attr("x", 120)
                .attr("height", 150)
                .attr("width", 55);

            console.log(nodeEnter);

            // Transition nodes to their new position.
            var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function(d) {
                    return "translate(" + d.y + "," + d.x + ")";
                });

            /* node sizing */

            //let nodeHeight = 40,
            //    nodeWidth = 150;

            let nodeHeight = 70,
                nodeWidth = 180;
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


            //.style('fill', function(d) { return d._children ? 'lightsteelblue' : '#fff'; });

            nodeUpdate.select("text")
                .style("fill-opacity", 1);

            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function(d) {
                    return "translate(" + source.y + "," + source.x + ")";
                })
                .remove();

            // nodeExit.select("circle")
            //     .attr("r", 1e-6);
            nodeExit.select('rect')
                .attr('width', 1e-6)
                .attr('height', 1e-6);

            nodeExit.select("text")
                .style("fill-opacity", 1e-6);

            // Update the links…
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
    }
});
