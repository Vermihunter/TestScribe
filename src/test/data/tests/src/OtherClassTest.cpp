#include <gtest/gtest.h>
#include "../../src/structs.hpp"
class OtherClass_static_class_methodTest : public testing::TestWithParam<std::tuple<>> {
  // To access the test parameter, call GetParam() from class TestWithParam<T>.
public:
    virtual void SetUp() override {
        
    }

    virtual void TearDown() override {
        
    }
};

TEST_P(OtherClass_static_class_methodTest, TestName) {
    auto param = GetParam();
    EXPECT_TRUE(false);
}

INSTANTIATE_TEST_SUITE_P(InstantiationName, OtherClass_static_class_methodTest, testing::Values( /* "meeny", "miny", "moe" */));

class OtherClass_virtual_class_methodTest : public testing::TestWithParam<std::tuple<>> {
  // To access the test parameter, call GetParam() from class TestWithParam<T>.
public:
    virtual void SetUp() override {
        
    }

    virtual void TearDown() override {
        
    }
};

TEST_P(OtherClass_virtual_class_methodTest, TestName) {
    auto param = GetParam();
    EXPECT_TRUE(false);
}

INSTANTIATE_TEST_SUITE_P(InstantiationName, OtherClass_virtual_class_methodTest, testing::Values( /* "meeny", "miny", "moe" */));
