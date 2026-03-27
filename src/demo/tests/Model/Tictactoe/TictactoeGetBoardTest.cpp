#include <gtest/gtest.h>
#include <limits>
#include "TictactoeTest.hpp"
#include "../../../include/Model/TicTacToe.hpp"

 
class Tictactoeget_boardTest : public testing::WithParamInterface<std::tuple<std::shared_ptr<std::shared_ptr<board_t>>>>, public TictactoeTest  {};
    
TEST_P(Tictactoeget_boardTest, get_boardGeneral) {
    auto param = GetParam();
    EXPECT_TRUE(false);
}

INSTANTIATE_TEST_SUITE_P(ReturnTypeTest, Tictactoeget_boardTest, testing::Values());
