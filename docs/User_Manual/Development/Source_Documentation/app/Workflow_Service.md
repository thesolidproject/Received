# Workflow Widget

## Workflow Service

**Date last Modified: 15 May 2017**

--------------------------------------------------------------------------------

### Introduction

The WorkflowService class acts as an accessor for the workflow object. With this accessor, we can gather most of the workflow information all from a single library.

### Method Breakdowns

Most methods, within this class, are accessors with a single mutator (change). Below is a table of all accessors and a brief description of what they return.

#### Accessors

Method                  | Return Value | Return Object Description
----------------------- | ------------ | --------------------------------------------------------------------------------------------------------
getWorkflowMeta()       | WorkflowMeta | The workflowMeta object, shown in workflow-meta.ts and their current values.
getStates()             | State[]      | Array of all states within the current workflow object
getTree()               | Tree         | The parent tree object, within the workflow.
_private_ extractMeta() | Tree         | The current metadata from the JSON workflow object
_private_ handleError() | EventEmitter | When the error is handled, it emits an error token into the project so the project closes, if necessary.
getEmittedValue()       | EventEmitter | Get the current emitter value. This may an error, or could be null.

#### Mutators

Notice that while there is a _Change()_ method within this class, it currently does not do anything more than emit what was input into the console. This method may be used to alter JSON data and manage the change (logging, etc).
