# Minimum CMake version required
cmake_minimum_required(VERSION 3.10)

# Project name and supported languages
project(GTKmm3App LANGUAGES CXX)

# Set the C++ standard to C++11 (you can change this if needed)
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Enable automatic handling of RPATH for shared libraries
set(CMAKE_SKIP_BUILD_RPATH FALSE)
set(CMAKE_BUILD_WITH_INSTALL_RPATH FALSE)
set(CMAKE_INSTALL_RPATH_USE_LINK_PATH TRUE)

# Find the pkg-config package
find_package(PkgConfig REQUIRED)

# Find GTKmm 3 using pkg-config
pkg_check_modules(GTKMM REQUIRED gtkmm-3.0)

# Include GTKmm headers
include_directories(${GTKMM_INCLUDE_DIRS})

include_directories(include/Model)
include_directories(include/Controller)

# Add any extra compiler flags provided by GTKmm
add_definitions(${GTKMM_CFLAGS_OTHER})

# Add the executable target
add_executable(tic_tac_toe_client src/View/Client/main.cpp src/Model/TicTacToe.cpp)

# Link GTKmm libraries to the executable
target_link_libraries(tic_tac_toe_client ${GTKMM_LIBRARIES})

add_subdirectory(tests)