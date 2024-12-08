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


file(GLOB TEST_SOURCES "${CMAKE_CURRENT_SOURCE_DIR}/*.cpp" "${CMAKE_CURRENT_SOURCE_DIR}/*.hpp" "${CMAKE_CURRENT_SOURCE_DIR}/*.h")

{{#each Subdirectories}}
add_subdirectory({{this}})
{{/each}}

add_executable(run_tests ${TEST_SOURCES})
target_link_libraries(run_tests gtest gtest_main)

# Define the root directory
set(ROOT_INCLUDE_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../include")

# Create an empty list to store all directories
set(ALL_INCLUDE_DIRS "")

# Function to collect directories recursively
function(collect_directories base_dir output_variable)
    file(GLOB children RELATIVE "${base_dir}" "${base_dir}/*")
    foreach(child IN LISTS children)
        if(IS_DIRECTORY "${base_dir}/${child}")
            # Add the directory to the output list
            list(APPEND ${output_variable} "${base_dir}/${child}")
            # Recurse into the directory
            collect_directories("${base_dir}/${child}" ${output_variable})
        endif()
    endforeach()
    set(${output_variable} "${${output_variable}}" PARENT_SCOPE)
endfunction()

# Call the function to populate ALL_INCLUDE_DIRS
collect_directories("${ROOT_INCLUDE_DIR}" ALL_INCLUDE_DIRS)

# Print all collected directories
message(STATUS "Collected include directories:")
foreach(dir IN LISTS ALL_INCLUDE_DIRS)
    message(STATUS "  ${dir}")
endforeach()

# Add these directories to the target
foreach(dir IN LISTS ALL_INCLUDE_DIRS)
    target_include_directories(run_tests PRIVATE "${dir}")
endforeach()

include(GoogleTest)
gtest_discover_tests(run_tests)