# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.22

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:

#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:

# Disable VCS-based implicit rules.
% : %,v

# Disable VCS-based implicit rules.
% : RCS/%

# Disable VCS-based implicit rules.
% : RCS/%,v

# Disable VCS-based implicit rules.
% : SCCS/s.%

# Disable VCS-based implicit rules.
% : s.%

.SUFFIXES: .hpux_make_needs_suffix_list

# Command-line flag to silence nested $(MAKE).
$(VERBOSE)MAKESILENT = -s

#Suppress display of executed commands.
$(VERBOSE).SILENT:

# A target that is always out of date.
cmake_force:
.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /usr/bin/cmake

# The command to remove a file.
RM = /usr/bin/cmake -E rm -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /home/akos/Desktop/TestScribe/src/test/data/tests

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /home/akos/Desktop/TestScribe/src/test/data/tests/build

# Include any dependencies generated for this target.
include CMakeFiles/run_tests.dir/depend.make
# Include any dependencies generated by the compiler for this target.
include CMakeFiles/run_tests.dir/compiler_depend.make

# Include the progress variables for this target.
include CMakeFiles/run_tests.dir/progress.make

# Include the compile flags for this target's objects.
include CMakeFiles/run_tests.dir/flags.make

CMakeFiles/run_tests.dir/src/nested/double_nested/GameTest.cpp.o: CMakeFiles/run_tests.dir/flags.make
CMakeFiles/run_tests.dir/src/nested/double_nested/GameTest.cpp.o: ../src/nested/double_nested/GameTest.cpp
CMakeFiles/run_tests.dir/src/nested/double_nested/GameTest.cpp.o: CMakeFiles/run_tests.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/akos/Desktop/TestScribe/src/test/data/tests/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object CMakeFiles/run_tests.dir/src/nested/double_nested/GameTest.cpp.o"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT CMakeFiles/run_tests.dir/src/nested/double_nested/GameTest.cpp.o -MF CMakeFiles/run_tests.dir/src/nested/double_nested/GameTest.cpp.o.d -o CMakeFiles/run_tests.dir/src/nested/double_nested/GameTest.cpp.o -c /home/akos/Desktop/TestScribe/src/test/data/tests/src/nested/double_nested/GameTest.cpp

CMakeFiles/run_tests.dir/src/nested/double_nested/GameTest.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/run_tests.dir/src/nested/double_nested/GameTest.cpp.i"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/akos/Desktop/TestScribe/src/test/data/tests/src/nested/double_nested/GameTest.cpp > CMakeFiles/run_tests.dir/src/nested/double_nested/GameTest.cpp.i

CMakeFiles/run_tests.dir/src/nested/double_nested/GameTest.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/run_tests.dir/src/nested/double_nested/GameTest.cpp.s"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/akos/Desktop/TestScribe/src/test/data/tests/src/nested/double_nested/GameTest.cpp -o CMakeFiles/run_tests.dir/src/nested/double_nested/GameTest.cpp.s

CMakeFiles/run_tests.dir/src/nested/PersonTest.cpp.o: CMakeFiles/run_tests.dir/flags.make
CMakeFiles/run_tests.dir/src/nested/PersonTest.cpp.o: ../src/nested/PersonTest.cpp
CMakeFiles/run_tests.dir/src/nested/PersonTest.cpp.o: CMakeFiles/run_tests.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/akos/Desktop/TestScribe/src/test/data/tests/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Building CXX object CMakeFiles/run_tests.dir/src/nested/PersonTest.cpp.o"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT CMakeFiles/run_tests.dir/src/nested/PersonTest.cpp.o -MF CMakeFiles/run_tests.dir/src/nested/PersonTest.cpp.o.d -o CMakeFiles/run_tests.dir/src/nested/PersonTest.cpp.o -c /home/akos/Desktop/TestScribe/src/test/data/tests/src/nested/PersonTest.cpp

CMakeFiles/run_tests.dir/src/nested/PersonTest.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/run_tests.dir/src/nested/PersonTest.cpp.i"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/akos/Desktop/TestScribe/src/test/data/tests/src/nested/PersonTest.cpp > CMakeFiles/run_tests.dir/src/nested/PersonTest.cpp.i

CMakeFiles/run_tests.dir/src/nested/PersonTest.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/run_tests.dir/src/nested/PersonTest.cpp.s"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/akos/Desktop/TestScribe/src/test/data/tests/src/nested/PersonTest.cpp -o CMakeFiles/run_tests.dir/src/nested/PersonTest.cpp.s

CMakeFiles/run_tests.dir/src/nested/PointTest.cpp.o: CMakeFiles/run_tests.dir/flags.make
CMakeFiles/run_tests.dir/src/nested/PointTest.cpp.o: ../src/nested/PointTest.cpp
CMakeFiles/run_tests.dir/src/nested/PointTest.cpp.o: CMakeFiles/run_tests.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/akos/Desktop/TestScribe/src/test/data/tests/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_3) "Building CXX object CMakeFiles/run_tests.dir/src/nested/PointTest.cpp.o"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT CMakeFiles/run_tests.dir/src/nested/PointTest.cpp.o -MF CMakeFiles/run_tests.dir/src/nested/PointTest.cpp.o.d -o CMakeFiles/run_tests.dir/src/nested/PointTest.cpp.o -c /home/akos/Desktop/TestScribe/src/test/data/tests/src/nested/PointTest.cpp

CMakeFiles/run_tests.dir/src/nested/PointTest.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/run_tests.dir/src/nested/PointTest.cpp.i"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/akos/Desktop/TestScribe/src/test/data/tests/src/nested/PointTest.cpp > CMakeFiles/run_tests.dir/src/nested/PointTest.cpp.i

CMakeFiles/run_tests.dir/src/nested/PointTest.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/run_tests.dir/src/nested/PointTest.cpp.s"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/akos/Desktop/TestScribe/src/test/data/tests/src/nested/PointTest.cpp -o CMakeFiles/run_tests.dir/src/nested/PointTest.cpp.s

CMakeFiles/run_tests.dir/src/OtherClassTest.cpp.o: CMakeFiles/run_tests.dir/flags.make
CMakeFiles/run_tests.dir/src/OtherClassTest.cpp.o: ../src/OtherClassTest.cpp
CMakeFiles/run_tests.dir/src/OtherClassTest.cpp.o: CMakeFiles/run_tests.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/akos/Desktop/TestScribe/src/test/data/tests/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_4) "Building CXX object CMakeFiles/run_tests.dir/src/OtherClassTest.cpp.o"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT CMakeFiles/run_tests.dir/src/OtherClassTest.cpp.o -MF CMakeFiles/run_tests.dir/src/OtherClassTest.cpp.o.d -o CMakeFiles/run_tests.dir/src/OtherClassTest.cpp.o -c /home/akos/Desktop/TestScribe/src/test/data/tests/src/OtherClassTest.cpp

CMakeFiles/run_tests.dir/src/OtherClassTest.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/run_tests.dir/src/OtherClassTest.cpp.i"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/akos/Desktop/TestScribe/src/test/data/tests/src/OtherClassTest.cpp > CMakeFiles/run_tests.dir/src/OtherClassTest.cpp.i

CMakeFiles/run_tests.dir/src/OtherClassTest.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/run_tests.dir/src/OtherClassTest.cpp.s"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/akos/Desktop/TestScribe/src/test/data/tests/src/OtherClassTest.cpp -o CMakeFiles/run_tests.dir/src/OtherClassTest.cpp.s

CMakeFiles/run_tests.dir/src/SomeStructTest.cpp.o: CMakeFiles/run_tests.dir/flags.make
CMakeFiles/run_tests.dir/src/SomeStructTest.cpp.o: ../src/SomeStructTest.cpp
CMakeFiles/run_tests.dir/src/SomeStructTest.cpp.o: CMakeFiles/run_tests.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/akos/Desktop/TestScribe/src/test/data/tests/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_5) "Building CXX object CMakeFiles/run_tests.dir/src/SomeStructTest.cpp.o"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT CMakeFiles/run_tests.dir/src/SomeStructTest.cpp.o -MF CMakeFiles/run_tests.dir/src/SomeStructTest.cpp.o.d -o CMakeFiles/run_tests.dir/src/SomeStructTest.cpp.o -c /home/akos/Desktop/TestScribe/src/test/data/tests/src/SomeStructTest.cpp

CMakeFiles/run_tests.dir/src/SomeStructTest.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/run_tests.dir/src/SomeStructTest.cpp.i"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/akos/Desktop/TestScribe/src/test/data/tests/src/SomeStructTest.cpp > CMakeFiles/run_tests.dir/src/SomeStructTest.cpp.i

CMakeFiles/run_tests.dir/src/SomeStructTest.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/run_tests.dir/src/SomeStructTest.cpp.s"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/akos/Desktop/TestScribe/src/test/data/tests/src/SomeStructTest.cpp -o CMakeFiles/run_tests.dir/src/SomeStructTest.cpp.s

# Object files for target run_tests
run_tests_OBJECTS = \
"CMakeFiles/run_tests.dir/src/nested/double_nested/GameTest.cpp.o" \
"CMakeFiles/run_tests.dir/src/nested/PersonTest.cpp.o" \
"CMakeFiles/run_tests.dir/src/nested/PointTest.cpp.o" \
"CMakeFiles/run_tests.dir/src/OtherClassTest.cpp.o" \
"CMakeFiles/run_tests.dir/src/SomeStructTest.cpp.o"

# External object files for target run_tests
run_tests_EXTERNAL_OBJECTS =

run_tests: CMakeFiles/run_tests.dir/src/nested/double_nested/GameTest.cpp.o
run_tests: CMakeFiles/run_tests.dir/src/nested/PersonTest.cpp.o
run_tests: CMakeFiles/run_tests.dir/src/nested/PointTest.cpp.o
run_tests: CMakeFiles/run_tests.dir/src/OtherClassTest.cpp.o
run_tests: CMakeFiles/run_tests.dir/src/SomeStructTest.cpp.o
run_tests: CMakeFiles/run_tests.dir/build.make
run_tests: lib/libgtest.a
run_tests: lib/libgtest_main.a
run_tests: lib/libgtest.a
run_tests: CMakeFiles/run_tests.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --bold --progress-dir=/home/akos/Desktop/TestScribe/src/test/data/tests/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_6) "Linking CXX executable run_tests"
	$(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/run_tests.dir/link.txt --verbose=$(VERBOSE)
	/usr/bin/cmake -D TEST_TARGET=run_tests -D TEST_EXECUTABLE=/home/akos/Desktop/TestScribe/src/test/data/tests/build/run_tests -D TEST_EXECUTOR= -D TEST_WORKING_DIR=/home/akos/Desktop/TestScribe/src/test/data/tests/build -D TEST_EXTRA_ARGS= -D TEST_PROPERTIES= -D TEST_PREFIX= -D TEST_SUFFIX= -D TEST_FILTER= -D NO_PRETTY_TYPES=FALSE -D NO_PRETTY_VALUES=FALSE -D TEST_LIST=run_tests_TESTS -D CTEST_FILE=/home/akos/Desktop/TestScribe/src/test/data/tests/build/run_tests[1]_tests.cmake -D TEST_DISCOVERY_TIMEOUT=5 -D TEST_XML_OUTPUT_DIR= -P /usr/share/cmake-3.22/Modules/GoogleTestAddTests.cmake

# Rule to build all files generated by this target.
CMakeFiles/run_tests.dir/build: run_tests
.PHONY : CMakeFiles/run_tests.dir/build

CMakeFiles/run_tests.dir/clean:
	$(CMAKE_COMMAND) -P CMakeFiles/run_tests.dir/cmake_clean.cmake
.PHONY : CMakeFiles/run_tests.dir/clean

CMakeFiles/run_tests.dir/depend:
	cd /home/akos/Desktop/TestScribe/src/test/data/tests/build && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /home/akos/Desktop/TestScribe/src/test/data/tests /home/akos/Desktop/TestScribe/src/test/data/tests /home/akos/Desktop/TestScribe/src/test/data/tests/build /home/akos/Desktop/TestScribe/src/test/data/tests/build /home/akos/Desktop/TestScribe/src/test/data/tests/build/CMakeFiles/run_tests.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : CMakeFiles/run_tests.dir/depend

