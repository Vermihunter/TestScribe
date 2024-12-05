#include <gtest/gtest.h>
#include "../../src/structs.hpp"
class SomeStruct_struct_methodTest : public testing::TestWithParam<std::tuple<>> {
  // To access the test parameter, call GetParam() from class TestWithParam<T>.
public:
    virtual void SetUp() override {
        
    }

    virtual void TearDown() override {
        
    }
};

TEST_P(SomeStruct_struct_methodTest, TestName) {
    auto param = GetParam();
    EXPECT_TRUE(false);
}

INSTANTIATE_TEST_SUITE_P(InstantiationName, SomeStruct_struct_methodTest, testing::Values( /* "meeny", "miny", "moe" */));
