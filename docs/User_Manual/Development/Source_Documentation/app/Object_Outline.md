# Workflow Widget

## Object Outline

**Date last Modified: 15 May 2017**

--------------------------------------------------------------------------------

### Introduction

This project contains many objects that signify their critical role in the workflow. Among the workflow and state objects, the project also considers the included metadata and project files that enable the widget to operate smoothly.

### App Components

Our first object is the _App Component_, which is required for the application to run. Notice how in the main.ts class, this module is called. This class set, comprised of the documents shown in the table directly below, make up our app driver, which is derived from main.

You may notice that many of our objects contain the suffix _Component_. This is because Angular's classes are entitled as such. Each component represents a different object.

File Name             | Description
--------------------- | -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.component.css     | The main styling document for the project. While the below HTML file includes the app structure, this file allows the HTML file to be displayed with some good looks. The styling is very minimal as it pertains to just the body of the document and not its children.
app.component.html    | File to display the generated widget. **Should not be edited**
app.component.js      | File to create the parent AppComponent object. **Should not be edited**
app.component.spec.ts | Configuration file to run Angular Component testing **Should not be edited**
app.component.ts      | File to run Angular Component testing **Should not be edited**
app.module.js         | Widget configuration file that handles the imports of D3 and the primary workflow tree component. Also includes the Bootstrap import.
app.module.ts         | File that bridges between JS and TS (JavaScript and TypeScript).

### Backend Request Document

Note that this filename is: _backend.request.ts_

This document is in charge of locating and loading the JSON file. **This is the method to alter when collecting data elsewhere**.

In load(), notice how we are currently using a relative link to obtain the workflow data. If there is an error, we simply catch the error and return a "Server Error".

### State Component

There are two main objects created for this widget: [States](#state-component) and [Trees](#tree-component). Simplistically, Each state can be considered as a Leaf Node as each one has a parent (but the root) and they each may have one-to-many children nodes.

A state object is controlled by two files: state.js and state.ts (JavaScript and TypeScript). The JS file defines the property within the tree and the TS file defines its attributes. See the table below for object definition:

Attribute       | Type            | Description
--------------- | --------------- | -----------------------------------------------------------------------------------------------------
ID              | Any             | ID may be of any type. A unique identifier of the workflow.
Rev             | Any             | Number **Workflow Use Unknown**
Name            | String          | Name of the Workflow. will be displayed at top.
Desc            | String          | Description of workflow. Usually describes the primary function.
Start           | String          | Workflow start date.
End             | String          | Workflow end date.
LastUpdate      | Any             | String, parsed into a date. **Workflow Use Unknown**
Iteration       | Any             | Number **Workflow Use Unknown**
Status          | String          | Current status of workflow.
State           | Object          | The state parent state, which holds additional metadata regarding this workflow.
Visibility      | String          | May be "Hidden" or "Shown" based on current user viewing workflow.
Type            | String          | Type of workflow to be shown. May be used for styling purposes (Part versus state diagrams)
Owner           | Object          | String **Workflow Use Unknown**
Participants    | Array < K>      | Contains the objects ID, Name, Email, Permission, and CurrentUser to manage the Admin and User Views.
PercentComplete | Number          | Float or integer representing the percentage complete of the current state.
Cost            | String          | Parsable string that contains the dollar value for the current state.
Quality         | String          | Quality Enum to represent the current quality of the part in the state.
Schedule        | String          | On a rank of 1-4, displays how completed a state is (shown as dots in the default theme)
ActualHours     | Number          | Amount of hours spent on state
PlannedHours    | Number          | Amount of hours planned for state
Required        | String          | Determines if state is required
EntryCondition  | Array < object> | **Workflow Use Unknown**
ExitCondition   | Array < object> | **Workflow Use Unknown**
Actions         | Array < object> | **Workflow Use Unknown**
Form            | Object          | Current form that the state controls.

### Tree Component

The tree component is ab object inherited from D3, so no JS class is required. However, the object must be defined. In simple terms, the Tree component is just like a state component - with the exception of having children.

A tree is composed of several states. When these states connect, they form their own, independent trees. As such, each state is a tree with the exception of the final children.

Attribute | Type          | Description
--------- | ------------- | -----------------------------------
...       | ...           | Same as State
Children  | Array < Tree> | Children Nodes, each a tree object.

### Workflow Component

In order to encapsulate all of the tree information, highest object created is the Workflow Component. This component is to ensure that the entire diagram flows smoothly and can integrate some meta-data, that cannot be held within individual states. This meta data can include similar attributes as a state, but is set as a unique object to maintain consistency through the application.

Similar to the [App Component](#app-compoenent), the Workflow Component is comprised of several classes to ensure the object is completely understood. These classes are seperated as such:

File Name                | Description
------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
workflow-meta.js         | Returns the Workflow Meta object (attributes shown in the TS file), broken down in the table directly below.
workflow-meta.ts         | A list of all the attributes in the workflow-meta object. Used to describe the encompassing workflow object.
workflow.service.js      | This script extracts the metadata from the workflow JSON file and places it with the local workflow object.
workflow.service.spec.ts | Workflow object testing script
workflow.service.ts      | TypeScript document that handles as the primary workflow object class. This class allows a developer to get the workflow meta data object, get the states in the, get the current states in a tree and more. This file is broken down in [WorkFlow Service](WorkFlow_Service.md).

The unique breakdown of the workflow meta object is below:

Attribute  | Type           | Description
---------- | -------------- | -------------------------------------------------------------------------------------------
ID         | Any            | ID may be of any type. A unique identifier of the workflow.
Rev        | Number         | **Workflow Use Unknown**
Name       | String         | Name of the Workflow. will be displayed at top.
Desc       | String         | Description of workflow. Usually describes the primary function.
Start      | String         | Workflow start date.
End        | String         | Workflow end date.
LastUpdate | String         | String, parsed into a date. **Workflow Use Unknown**
Iteration  | Number         | **Workflow Use Unknown**
Status     | String         | Current status of workflow.
State      | Object         | Contains solely the ID and number of a single state.
Visibility | String         | May be "Hidden" or "Shown" based on current user viewing workflow.
Type       | String         | Type of workflow to be shown. May be used for styling purposes (Part versus state diagrams)
Owner      | Array < K>     | Contains the ID, Name and Email of the workflow owner.
States     | Array < State> | Array of all states in the workflow.
