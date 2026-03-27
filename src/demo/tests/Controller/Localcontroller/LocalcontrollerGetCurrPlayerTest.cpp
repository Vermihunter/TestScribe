#include <gtest/gtest.h>
#include <limits>
#include "LocalcontrollerTest.h"
#include "../../../include/Controller/LocalController.h"

 
class Localcontrollerget_curr_playerTest : public testing::WithParamInterface<std::tuple<std::shared_ptr<std::shared_ptr<Player>>>>, public LocalcontrollerTest  {};
    
TEST_P(Localcontrollerget_curr_playerTest, get_curr_playerGeneral) {
    auto param = GetParam();
    EXPECT_TRUE(false);
}

INSTANTIATE_TEST_SUITE_P(ReturnTypeTest, Localcontrollerget_curr_playerTest, testing::Values());
