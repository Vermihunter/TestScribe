# Collect local files
file(GLOB LOCAL_FILES "${CMAKE_CURRENT_SOURCE_DIR}/*.cpp" "${CMAKE_CURRENT_SOURCE_DIR}/*.hpp" "${CMAKE_CURRENT_SOURCE_DIR}/*.h")

add_subdirectory(Tictactoe)

# Add to global variable in parent scope
set(TEST_SOURCES ${TEST_SOURCES} ${LOCAL_FILES} PARENT_SCOPE)