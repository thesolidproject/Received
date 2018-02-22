/**
 * Created by chrislarsen on 3/21/17.
 */
Ext.define('WorkflowWidget.view.WorkflowFlourish', {
    extend: 'Ext.Container',
    alias: 'widget.flourish',
    xtype: 'flourish',
    controller: 'flourish',

    requires: [
        'Ext.d3.interaction.PanZoom',
        'Ext.d3.svg.Svg',
        'WorkflowWidget.view.NodeViewModel',
        'WorkflowWidget.view.FlourishTree'
    ],

    viewModel: {
        type: 'node',
    },
    itemId: 'flourishView',
    layout: 'fit',
    align: 'stretch',
    shadow: true,
<<<<<<< HEAD
    items: {
        xtype: 'flourishTree',
=======
    items: [{
        xtype: 'd3',
>>>>>>> mikal
        title: 'Flourish View',
        bind: { store: '{store}', },
        rootVisible: true,
        flex: 1,
        interactions: {
            type: 'panzoom',
            zoom: {
                extent: [0.3, 3],
                doubleTap: false
            }
        },
<<<<<<< HEAD
        //listeners: { scenesetup: 'onSceneSetup' }
=======
        listeners: {
            scenesetup: 'onSceneSetup'
        }
    }, {
        xtype: 'titlebar',
        docked: 'top',
        height: 80,
        html: '<center>Northrop Grumman',
        style: 'background: none; color: blue; font-size: 32px',
        styleHtmlContent: true
    }, {
	 xtype: 'titlebar',
	 docked: 'top',
	 height: 40,
	 html: '<center>WorkFlow Name',
	 style: 'background: none; color: black; font-size: 26px; margin-top: 5%; box-shadow: none;',
	 styleHtmlContent: true
>>>>>>> mikal
    }
	]
});
