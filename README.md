TestScribe is a tool to automatically generate unit tests for your projects. It supports both project-level generation and
file level test generation. Currently it supports `C++` and the most famous C++ unit testing framework, [GoogleTest](https://github.com/google/googletest).

## Features

First, all the C++ header and source files are parsed according to the configuration path. Each global function and public class function
is processed and the following code is generated for them:
- For every global function, a parametrized test suite class is generated with 

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Extending TestScribe

TestScribe uses [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) as a parser making it extremely easy to add new languages.

The application is divided into two parts:
- Parsing the file into objects
- Generating unit tests for the objects


### Parsing


### Generating unit tests

TestScribe uses the [handlebars](https://handlebarsjs.com/) templating engine to define the different types of tests. Separating this logic from code helps making it easily configurable. To add support for your beloved unit testing framework you have to first define what the tests look like.

