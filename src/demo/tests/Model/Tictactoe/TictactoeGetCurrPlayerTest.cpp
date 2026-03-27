#include <gtest/gtest.h>
#include <limits>
#include "TictactoeTest.hpp"
#include "../../../include/Model/TicTacToe.hpp"

 
class Tictactoeget_curr_playerTest : public testing::WithParamInterface<std::tuple<std::shared_ptr<std::shared_ptr<Player>>>>, public TictactoeTest  {};
    
TEST_P(Tictactoeget_curr_playerTest, get_curr_playerGeneral) {
    auto param = GetParam();
    EXPECT_TRUE(false);
}

INSTANTIATE_TEST_SUITE_P(ReturnTypeTest, Tictactoeget_curr_playerTest, testing::Values());
