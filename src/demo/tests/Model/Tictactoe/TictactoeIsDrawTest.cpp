#include <gtest/gtest.h>
#include <limits>
#include "TictactoeTest.hpp"
#include "../../../include/Model/TicTacToe.hpp"

 
class Tictactoeis_drawTest : public testing::WithParamInterface<std::tuple<bool>>, public TictactoeTest  {};
    
TEST_P(Tictactoeis_drawTest, is_drawGeneral) {
    auto param = GetParam();
    EXPECT_TRUE(false);
}

INSTANTIATE_TEST_SUITE_P(ReturnTypeTest, Tictactoeis_drawTest, testing::Values());
