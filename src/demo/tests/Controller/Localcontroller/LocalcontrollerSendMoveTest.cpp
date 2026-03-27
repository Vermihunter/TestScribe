#include <gtest/gtest.h>
#include <limits>
#include "LocalcontrollerTest.h"
#include "../../../include/Controller/LocalController.h"

 
class Localcontrollersend_moveTest : public testing::WithParamInterface<std::tuple<bool, int, int>>, public LocalcontrollerTest  {};
    
TEST_P(Localcontrollersend_moveTest, send_moveGeneral) {
    auto param = GetParam();
    EXPECT_TRUE(false);
}

TEST_P(Localcontrollersend_moveTest, ThrowStdInvalidArgument) {
    // auto param = GetParam();
    EXPECT_TRUE(false);
    // EXPECT_THROW(func_call(), std::invalid_argument);
}

TEST_P(Localcontrollersend_moveTest, NoThrowStdInvalidArgument) {
    // auto param = GetParam();
    EXPECT_TRUE(false);
    // EXPECT_NO_THROW(func_call(), std::invalid_argument);
}

INSTANTIATE_TEST_SUITE_P(BehaviorTest, Localcontrollersend_moveTest, 
    testing::Combine(
        testing::Values(std::numeric_limits<bool>::min(), std::numeric_limits<bool>::max(), (bool)(0), (bool)(5)),
        testing::Values(std::numeric_limits<int>::min(), std::numeric_limits<int>::max(), (int)(0), (int)(5), (int)(-113)),
        testing::Values(std::numeric_limits<int>::min(), std::numeric_limits<int>::max(), (int)(0), (int)(5), (int)(-113)))
    );

INSTANTIATE_TEST_SUITE_P(ReturnTypeTest, Localcontrollersend_moveTest, testing::Values());
