#include <gtest/gtest.h>
#include <limits>
#include "IcontrollerTest.h"
#include "../../../include/Controller/IController.h"

 
class Icontrollerget_curr_playerTest : public testing::WithParamInterface<std::tuple<std::shared_ptr<std::shared_ptr<Player>>>>, public IcontrollerTest  {};
    
TEST_P(Icontrollerget_curr_playerTest, get_curr_playerGeneral) {
    auto param = GetParam();
    EXPECT_TRUE(false);
}

INSTANTIATE_TEST_SUITE_P(ReturnTypeTest, Icontrollerget_curr_playerTest, testing::Values());
