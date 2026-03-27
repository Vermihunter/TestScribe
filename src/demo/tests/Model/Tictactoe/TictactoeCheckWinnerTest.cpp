#include <gtest/gtest.h>
#include <limits>
#include "TictactoeTest.hpp"
#include "../../../include/Model/TicTacToe.hpp"

 
class Tictactoecheck_winnerTest : public testing::WithParamInterface<std::tuple<bool, std::shared_ptr<std::shared_ptr<Player>>>>, public TictactoeTest  {};
    
TEST_P(Tictactoecheck_winnerTest, check_winnerGeneral) {
    auto param = GetParam();
    EXPECT_TRUE(false);
}

INSTANTIATE_TEST_SUITE_P(BehaviorTest, Tictactoecheck_winnerTest, 
    testing::Combine(
        testing::Values(std::numeric_limits<bool>::min(), std::numeric_limits<bool>::max(), (bool)(0), (bool)(5)),
        testing::Values())
    );

INSTANTIATE_TEST_SUITE_P(ReturnTypeTest, Tictactoecheck_winnerTest, testing::Values());
