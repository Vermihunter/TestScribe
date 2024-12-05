#include <gtest/gtest.h>
#include "../../../../src/nested/double_nested/game.cpp"
class Game_playTest : public testing::TestWithParam<std::tuple<>> {
  // To access the test parameter, call GetParam() from class TestWithParam<T>.
public:
    virtual void SetUp() override {
        
    }

    virtual void TearDown() override {
        
    }
};

TEST_P(Game_playTest, TestName) {
    auto param = GetParam();
    EXPECT_TRUE(false);
}

INSTANTIATE_TEST_SUITE_P(InstantiationName, Game_playTest, testing::Values( /* "meeny", "miny", "moe" */));

class Game_undoTest : public testing::TestWithParam<std::tuple<>> {
  // To access the test parameter, call GetParam() from class TestWithParam<T>.
public:
    virtual void SetUp() override {
        
    }

    virtual void TearDown() override {
        
    }
};

TEST_P(Game_undoTest, TestName) {
    auto param = GetParam();
    EXPECT_TRUE(false);
}

INSTANTIATE_TEST_SUITE_P(InstantiationName, Game_undoTest, testing::Values( /* "meeny", "miny", "moe" */));

class Game_add_playerTest : public testing::TestWithParam<std::tuple<int,std::string>> {
  // To access the test parameter, call GetParam() from class TestWithParam<T>.
public:
    virtual void SetUp() override {
        
    }

    virtual void TearDown() override {
        
    }
};

TEST_P(Game_add_playerTest, TestName) {
    auto param = GetParam();
    EXPECT_TRUE(false);
}

INSTANTIATE_TEST_SUITE_P(InstantiationName, Game_add_playerTest, testing::Values( /* "meeny", "miny", "moe" */));
