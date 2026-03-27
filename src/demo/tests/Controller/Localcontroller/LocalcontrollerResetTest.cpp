#include <gtest/gtest.h>
#include <limits>
#include "LocalcontrollerTest.h"
#include "../../../include/Controller/LocalController.h"

 
class LocalcontrollerresetTest : public testing::WithParamInterface<std::tuple<>>, public LocalcontrollerTest  {};
    
TEST(LocalcontrollerresetTest, resetGeneral) {
    // TODO - Add test implementation
    EXPECT_TRUE(false);
}

TEST_P(LocalcontrollerresetTest, ThrowStdInvalidArgument) {
    // auto param = GetParam();
    EXPECT_TRUE(false);
    // EXPECT_THROW(func_call(), std::invalid_argument);
}

TEST_P(LocalcontrollerresetTest, NoThrowStdInvalidArgument) {
    // auto param = GetParam();
    EXPECT_TRUE(false);
    // EXPECT_NO_THROW(func_call(), std::invalid_argument);
}
