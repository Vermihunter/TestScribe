#include <gtest/gtest.h>
#include <limits>
#include "LocalcontrollerTest.h"
#include "../../../include/Controller/LocalController.h"

 
class Localcontrollerget_boardTest : public testing::WithParamInterface<std::tuple<std::shared_ptr<std::shared_ptr<board_t>>>>, public LocalcontrollerTest  {};
    
TEST_P(Localcontrollerget_boardTest, get_boardGeneral) {
    auto param = GetParam();
    EXPECT_TRUE(false);
}

TEST_P(Localcontrollerget_boardTest, ThrowStdInvalidArgument) {
    // auto param = GetParam();
    EXPECT_TRUE(false);
    // EXPECT_THROW(func_call(), std::invalid_argument);
}

TEST_P(Localcontrollerget_boardTest, NoThrowStdInvalidArgument) {
    // auto param = GetParam();
    EXPECT_TRUE(false);
    // EXPECT_NO_THROW(func_call(), std::invalid_argument);
}

INSTANTIATE_TEST_SUITE_P(ReturnTypeTest, Localcontrollerget_boardTest, testing::Values());
