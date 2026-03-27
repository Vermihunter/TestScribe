#include <gtest/gtest.h>
#include <limits>
#include "IcontrollerTest.h"
#include "../../../include/Controller/IController.h"

 
class Icontrollercheck_winnerTest : public testing::WithParamInterface<std::tuple<bool, std::shared_ptr<std::shared_ptr<Player>>>>, public IcontrollerTest  {};
    
TEST_P(Icontrollercheck_winnerTest, check_winnerGeneral) {
    auto param = GetParam();
    EXPECT_TRUE(false);
}

INSTANTIATE_TEST_SUITE_P(BehaviorTest, Icontrollercheck_winnerTest, 
    testing::Combine(
        testing::Values(std::numeric_limits<bool>::min(), std::numeric_limits<bool>::max(), (bool)(0), (bool)(5)),
        testing::Values())
    );

INSTANTIATE_TEST_SUITE_P(ReturnTypeTest, Icontrollercheck_winnerTest, testing::Values());
