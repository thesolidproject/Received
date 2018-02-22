# Workflow Widget

## Workflow Tree Styling

**Date last Modified: 15 May 2017**

--------------------------------------------------------------------------------

Found in File: code/ang2/src/app/workflowtree/

### Introduction

The styling document can be interchanged to fit the needs of the organization. Please see the below table for the class descriptions.

Class Name     | Description
-------------- | ------------------------------------------------------------------------------------------------------------------------
Node           | The parent node object. Currently, the only item that changes is the cursor when a user hovers over it.
Node Circle    | The highlighting for the current state selected. This may be altered by changing the class of the current selected node.
Node Text      | The name of the node, which uses a fill to draw the text in position.
Node Rect      | The rectangle of the node (the inner body)
Link           | The line that is drawn between each node
Current-State  | The current state, which is highlighted
State-Desc     | The quick description of the node, displayed in a popup
State-Schedule | The color of the schedule identifier, within each state
State-Cost     | The cost of the state, as shown by a dollar sign in the default theme, based on the range of costs.
ToolTip        | The popup window that appears on hover.
ToolTip Hidden | The popup is hidden when the mouse is not over it.
Modal-Header   | The description modal view, which displays all of the attributes within a state.
Modal-Dialog   | The Title of the the modal view, signified by name and ID
Modal-Body     | The table that shows the state attributes. This is a nice table form.

To modify the dialog, or to make it a functional form, modify the modal view in HTML/JS as this modal interacts with the JSON object, when it extracts the data.
