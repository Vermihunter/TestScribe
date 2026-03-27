#include <gtest/gtest.h>
#include <limits>
#include "LocalcontrollerTest.h"
#include "../../../include/Controller/LocalController.h"

 
class Localcontrolleris_drawTest : public testing::WithParamInterface<std::tuple<bool>>, public LocalcontrollerTest  {};
    
TEST_P(Localcontrolleris_drawTest, is_drawGeneral) {
    auto param = GetParam();
    EXPECT_TRUE(false);
}

INSTANTIATE_TEST_SUITE_P(ReturnTypeTest, Localcontrolleris_drawTest, testing::Values());
