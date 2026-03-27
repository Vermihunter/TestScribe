#include <gtest/gtest.h>
#include <limits>
#include "TictactoeTest.hpp"
#include "../../../include/Model/TicTacToe.hpp"

 
class Tictactoesend_moveTest : public testing::WithParamInterface<std::tuple<bool, int, int>>, public TictactoeTest  {};
    
TEST_P(Tictactoesend_moveTest, send_moveGeneral) {
    auto param = GetParam();
    EXPECT_TRUE(false);
}

INSTANTIATE_TEST_SUITE_P(BehaviorTest, Tictactoesend_moveTest, 
    testing::Combine(
        testing::Values(std::numeric_limits<bool>::min(), std::numeric_limits<bool>::max(), (bool)(0), (bool)(5)),
        testing::Values(std::numeric_limits<int>::min(), std::numeric_limits<int>::max(), (int)(0), (int)(5), (int)(-113)),
        testing::Values(std::numeric_limits<int>::min(), std::numeric_limits<int>::max(), (int)(0), (int)(5), (int)(-113)))
    );

INSTANTIATE_TEST_SUITE_P(ReturnTypeTest, Tictactoesend_moveTest, testing::Values());
