/**
 * Created by chrislarsen on 3/13/17.
 */

Ext.define('WorkflowWidget.reader.WorkflowReader', {
    extend: 'Ext.data.reader.Json',

    alias: 'reader.workflow',
    requires: [
        'Ext.data.TreeStore'
    ],


    getResponseData: function () {
        var data = this.callParent(arguments);

        //var test = this.addTreeHierarchy(data[0].workflow.states);
        //console.log(test);
        //return this.addTreeHierarchy(data[0].workflow.states);
        return this.addTreeLevel(data);

    },

    addTreeLevel: function (data) {
        //console.log(data);
        var workflow = data[0].workflow;
        //console.log(workflow.states);

        var tree = [],
            currentValue = {'id': 0},
            parentItem,
            childItem;

        var rootId = workflow.states[0].id;
        //console.log(currentValue['id']);
        Ext.Array.each(workflow.states, function (state) {

            if (tree.length === 0) {
                currentValue = state;
                parentItem = state;
                parentItem.children = [];
                parentItem.expanded = true;
                parentItem.root = true;
                parentItem.text = state.id;
                childItem = parentItem;
                tree.push(Ext.apply(parentItem));
            }
            if (state['id'] == (currentValue['id'] + 1)) {
                // console.log(currentValue);
                var previous = childItem;
                childItem = state;
                currentValue = state;
                childItem.children = [];
                childItem.expanded = false;
                // console.log(childItem.parentID);
                previous.children.push(Ext.apply(childItem));
            }
			if (state['id'] == '105') {
            	currentValue = state;
            	var temp = state;
            	temp.children = [];
            	temp.expanded = false;
            	tree[0].children.push(Ext.apply(temp));
			}
        });
        //console.log(tree);
        return tree;
    }
});