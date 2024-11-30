# CMakeLists.txt in the 'tests' subdirectory

# Minimum CMake version
cmake_minimum_required(VERSION 3.14)

# Define the project name for tests
project(UnitTests)

# Enable testing support in CMake
enable_testing()

# Include GoogleTest - Ensure it's either downloaded or available in your project
# Adjust the path if GoogleTest is in a different location
find_package(GTest REQUIRED)

# Add test source files (adjust the list as needed)
set(TEST_SOURCES
    {{TestFiles}}
)

# Add an executable for the tests
add_executable(UnitTestRunner ${TEST_SOURCES})

# Link GoogleTest libraries to the test executable
target_link_libraries(UnitTestRunner PRIVATE GTest::GTest GTest::Main)

# Optionally include the source directory if the tests include headers from there
# adjust this to match your project's structure
target_include_directories(UnitTestRunner PRIVATE ${PROJECT_SOURCE_DIR}/../src)

# Add the executable to the test suite
add_test(NAME AllTests COMMAND UnitTestRunner)

# Enable additional compiler warnings for the tests (optional but recommended)
if (CMAKE_CXX_COMPILER_ID STREQUAL "GNU" OR CMAKE_CXX_COMPILER_ID MATCHES "Clang")
    target_compile_options(UnitTestRunner PRIVATE -Wall -Wextra -Wpedantic)
endif()
