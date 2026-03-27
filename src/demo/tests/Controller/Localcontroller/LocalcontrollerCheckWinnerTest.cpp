#include <gtest/gtest.h>
#include <limits>
#include "LocalcontrollerTest.h"
#include "../../../include/Controller/LocalController.h"

 
class Localcontrollercheck_winnerTest : public testing::WithParamInterface<std::tuple<bool, std::shared_ptr<std::shared_ptr<Player>>>>, public LocalcontrollerTest  {};
    
TEST_P(Localcontrollercheck_winnerTest, check_winnerGeneral) {
    auto param = GetParam();
    EXPECT_TRUE(false);
}

INSTANTIATE_TEST_SUITE_P(BehaviorTest, Localcontrollercheck_winnerTest, 
    testing::Combine(
        testing::Values(std::numeric_limits<bool>::min(), std::numeric_limits<bool>::max(), (bool)(0), (bool)(5)),
        testing::Values())
    );

INSTANTIATE_TEST_SUITE_P(ReturnTypeTest, Localcontrollercheck_winnerTest, testing::Values());
