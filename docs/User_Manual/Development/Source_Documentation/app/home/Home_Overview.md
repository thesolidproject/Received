# Workflow Widget

## Home Overview

**Date last Modified: 05 May 2017**

--------------------------------------------------------------------------------

Found in Folder: code/ang2/src/app/home/

### Introduction

<center>
  <strong>These files should not be modified</strong>
</center>

The base file for this application can be found in ~/code/ang2/src/app/home, where there are 4 files listed. The table below provides a breakdown of functionality:

File                   | Description
---------------------- | --------------------------------------------------------------------------
home.component.css     | The Cascading Style Sheet for the project.
home.component.html    | Webpage that displays the workflow tree with the passed in data
home.component.spec.ts | Script document that configures that instance
home.component.ts      | Script document that requests the data, which will be used on the workflow

### Operations

The home object has one important job: gather the data from the JSON file so that the Tree can be generated. This class also auto-updates to ensure the data is always updated. The timeout time is located in the method ngOnInit();

### Exceptions

Although none of the above should be modified, there is an exception with the CSS document. The CSS file manages just the title bar, with the navigation controls.
