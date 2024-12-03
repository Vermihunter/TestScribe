# CMakeLists.txt in the 'tests' subdirectory

# Minimum CMake version
cmake_minimum_required(VERSION 3.14)

# Define the project name for tests
project(UnitTests)

include(FetchContent)

FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/release-1.12.1.zip
)

FetchContent_MakeAvailable(googletest)

# Enable testing support in CMake
enable_testing()


# Add test source files (adjust the list as needed)
set(TEST_SOURCES
    {{TestFiles}}
)

add_executable(run_tests ${TEST_SOURCES})
target_link_libraries(run_tests gtest gtest_main)

include(GoogleTest)
gtest_discover_tests(run_tests)