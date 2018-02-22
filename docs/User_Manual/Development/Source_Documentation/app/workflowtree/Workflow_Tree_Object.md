# Workflow Widget

## Workflow Tree Object

**Date last Modified: 05 May 2017**

--------------------------------------------------------------------------------

Found in File: code/ang2/src/app/tree.ts

```
// class to model tree object for rendering by d3
export class Tree {
  id: any;
  rev: any;
  name: string;
  desc: string;
  start: string;
  end: string;
  lastupdate: any;
  iteration: any;
  status: string;
  state: object;
  visibility: string;
  type: string;
  participants: object;
  percentcomplete: number;
  cost: string;
  quality: string;
  schedule: string;
  actualhours: number;
  plannedhours: number;
  required: string;
  entrycondition: Array<object>;
  exitcondition: Array<object>;
  actions: Array<object>;
  form: object;
  children: Array<Tree>;
}
```

Attribute       | Type            | Description
--------------- | --------------- | -----------------------------------------------------------
ID              | ANY             | Unique identifier of the particular tree
Rev             | ANY             | **Definition Unknown**
Name            | STRING          | Name of Tree object
Desc            | STRING          | Description of Tree Object
Start           | STRING          | Start Date, listed in STRING format. Will be parsed.
End             | STRING          | End Date, listed in STRING format. Will be parsed.
LastUpdate      | STRING          | Time Last Updated, listed in STRING format. Will be parsed.
Iteration       | ANY             | **Definition Unknown**
Status          | STRING          | Current status of the Tree
Visibility      | STRING          | Shown to Admin, Users, or other.
Type            | STRING          | **Definition Unknown**
Participants    | OBJECT          | **Definition Unknown**
PercentComplete | NUMBER          | Percentage Tree is complete, in FLOAT
Cost            | STRING          | Cost of project shown in Tree
Quality         | STRING          | Quality signifier of Tree
Schedule        | STRING          | **Definition Unknown**
ActualHours     | NUMBER          | Hours spent on workflow
PannedHours     | NUMBER          | Hours originally planned for workflow
Required        | STRING          | **Definition Unknown**
EntryCondition  | ARRAY < OBJECT> | **Definition Unknown**
ExitCondition   | ARRAY < OBJECT> | **Definition Unknown**
Actions         | ARRAY < OBJECT> | **Definition Unknown**
Form            | OBJECT          | Form connected to the current Workflow Tree
Children        | ARRAY < TREE>   | Child Trees, which branch out when clicked.
