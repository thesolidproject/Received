# Workflow Widget

## Project Overview

**Date last Modified: 15 May 2017**

--------------------------------------------------------------------------------

### Introduction

Welcome to the Widget Project, Developer Documentation. Within this documentation, we are going to break down all classes and methods and evaluate what is occurring in each step of the application. This document covers the project structure and the documents within the parent directory of the Angular2 Project.

### Included Files

Within the directory **~/docs/code/ang2** you will find a plethora of documents related to allowing the project to function, in addition to some provided documentation from Angular/CLI.

Here is a list of all the documents you should find in the directory, along with a brief description. Since these are provided documentation, these files should require minimal editing as altering these files may cause errors on compilation.

File Name          | Description
------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------
.editorconfig      | Configuration file for editing documents within the project.
.gitignore         | Ignore file for Git Repository suffixes (files to exclude from remote branch)
karma.conf.js      | Angular dependency collector. **Should not be edited**
package.json       | JSON document that manages the dependancies for the project and provides the mapping of which operations do what task. Basic project information is included.
protractor.conf.js | Angular dependency file. **Should not be edited**
README.md          | Provided README by Angular. This readme demonstrates a short guide to basic angular functionality.
tsconfig.json      | TypeScript Configuration File for the project. **Should not be edited**
tslint.json        | TypeScript Editor JSON file. **Should not be edited**

### Included Folders

In addition to he files within the project, there are 3 folders that also require attention:

Folder Name   | Description
------------- | -------------------------------------------------------------------------------------------------------------------------------------------
e2e/          | End To End Testing Documentation. Development documentation for testing may be found [here](https://docs.angularjs.org/guide/e2e-testing#!)
node_modules/ | NPM packages required for the project. Created when running npm install
src/          | Source files for project. Class and Object definitions may be found in the [Source Documentation](Source_Documentation) directory
