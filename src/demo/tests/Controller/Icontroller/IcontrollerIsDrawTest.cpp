#include <gtest/gtest.h>
#include <limits>
#include "IcontrollerTest.h"
#include "../../../include/Controller/IController.h"

 
class Icontrolleris_drawTest : public testing::WithParamInterface<std::tuple<bool>>, public IcontrollerTest  {};
    
TEST_P(Icontrolleris_drawTest, is_drawGeneral) {
    auto param = GetParam();
    EXPECT_TRUE(false);
}

INSTANTIATE_TEST_SUITE_P(ReturnTypeTest, Icontrolleris_drawTest, testing::Values());
