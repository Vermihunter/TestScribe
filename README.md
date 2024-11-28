# testscribe README

TestScribe is a tool to automatically generate unit tests for your projects. It supports both project-level generation and
file/class level test generation. Currently it supports `C++` and the most famous C++ unit testing framework, [GoogleTest](https://github.com/google/googletest).

The project describes some best practices i.e. some scenarios that are most likely one of the best solutions for a problem. These techniques
are mappings for code-to-unit test type. On the other hand, TestScribe gives the users the freedom to generate any type of test type for
a given piece of code.

Although TestScribe currently implements a single programming language with a single unit testing framework implementation, it defines
an interface that allows developers to extend this framework for their favorite programming language and unit testing framework. More about 
this feature in the [Extending TestScribe](#extending-testscribe) section.

## Features

- Generate unit tests for a directory
- Generate unit tests for a file
- Generate unit tests for the selected code 

The unit test generation for the selected code option comes with two different customization levels:
- The user decides what type of test should be generated for the given class/method
- Automatic generation specificed by TestScribe


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

