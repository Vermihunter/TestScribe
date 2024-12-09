TestScribe is a tool to automatically generate unit tests for your projects. It supports both project-level generation and
file level test generation. Currently it supports `C++` and the most famous C++ unit testing framework, [GoogleTest](https://github.com/google/googletest).

TestScribe does not provide deep code analysis to generate unit tests but offers an easy way to create a skeleton for your tests on directory and file level
that compiles without any further compilation/modification action.

To use this tool, open your C++ project's root directory. 

## Features

### Classes and functions

The following list shows what is generated for given C++ constructs:
- Global functions
  - If the function is templated, a GoogleTest typed test suite is generated combining the return type (if non-void) and the function arguments (if any) as template types
  - Otherwise, if the function has no return type (void) and has no parameters, a simple GoogleTest test method is generated having a test name of the functions name with a "General" prefix
  - Otherwise, a parametrized GoogleTest suite class is generated. The parameters are the combination of return type (if non-void) and function parameters deeply described in section [Type conversion](#type-conversion)
- Classes - for every class, there is a base suite class created that is inherited from GoogleTest's class interface. Every other classes that test methods of the class are derived from this base class
  - If the class is templated, all the derived classes that test given functions are templated i.e. a GoogleTest typed test suite is generated for them
  - If the class is non-templated, for each method the same constructs are generated as in case of global functions with the difference of there is a base class that defined the SetUp and TearDown methods
  - Tests are generated only for public methods since that is the main goal of unit tests - to test the classes as interfaces

### File hierarchy

Suppose that the file that is located at `root/include/foo/bar/some.h`:
- Tests for a global function named `add` of this file will be located at `root/tests/foo/bar/some_addTest.cpp`
- Tests for a class named `Point` of this file will be located at `root/tests/foo/bar/Point/PointTest.h` and a public member function `distance` of this class at `root/tests/foo/bar/Point/PointDistanceTest.cpp`

### Generated tests

- For every method (both global and class methods), a general test case is generated
- If a method throws some exceptions, a `Throw${EXCEPTION_NAME}` and a `NoThrow${EXCEPTION_NAME}` test case is generated for every type that is thrown. Please notice that in C++, any type could go after the throw keyword i.e. `throw "exception"` is a valid expression. TestScribe parses both `doxygen` comments - collects all exceptions defined as `@throws` - and parses the code of the functions i.e. it collects all the types after the `throw` keyword

### Instantiation

Instantiation for different types of tests is done differently:
- If a function has a non-void return type, a `ReturnTypeTest` test suite is generated that contains a `testing:Values()` statement where the user should fill in the return type tests
- For every parametrized suite test class, a `BehaviorTest` test suite is generated. In this case, a `testing::Combine()` statement (that calls the test cases using a Carthesian product of its parameters) is combined with parameters using `testing::Values()`. For C++ primitive types like `int`, a couple of corner case params are by default filled in like `std::numeric_limits<int>::min()` or `0`.

### Building

- TestScribe currently supports only the [CMake](https://cmake.org/) build system. The construct of the files may be not the nicest but it is designed against fault tolerance i.e. a user adding manually new tests and ensuring that they are compiled into the tests.
- A hierarchical CMake build system is defined that collects all C++ files on their current directory and add subdirectories.
- The test files contain include statements to the tested class. To ensure compilation is correct, all the subdirectories inside the `include` directory of the root path are collected

### Type conversion 

TestScribe does not want to play the role of a complete C++ compiler and for that reason it provides the following abstraction:
- auto parameters are converted to std::string instances
- any parameters that are not C++ primitive types or std::string instances are wrapped with std::shared_ptr. The reason for this is that GoogleTest's parameterized tests are template parameters and they don't allow any types that are not copy-constructible. Since we are not providing full project parsing and other parameters could be defined in other files, it is a safety reason to use this method.
- any parameter that contains a reference, is wrapped in a std::shared_ptr instance for the same reason as the point above
- any const modifier is removed (cannot pass to GoogleTest)


## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Problems with nested template types for example `Foo<T, K>` should be converted to `Foo<typename T::T, T::K>`  in case of testing templated classes/functions using GoogleTest's typed test cases.

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

