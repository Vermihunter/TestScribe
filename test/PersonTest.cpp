class Person_greetTest : public testing::TestWithParam<> {
  // To access the test parameter, call GetParam() from class TestWithParam<T>.
public:
    virtual void SetUp() override {
        
    }

    virtual void TearDown() override {
        
    }
};



TEST_P(Person_greetTest, TestName) {
    auto param = GetParam();
    EXPECT_TRUE(false);
}

INSTANTIATE_TEST_SUITE_P(InstantiationName, Person_greetTest, testing::Values( /* "meeny", "miny", "moe" */))

class Person_walkTest : public testing::TestWithParam<> {
  // To access the test parameter, call GetParam() from class TestWithParam<T>.
public:
    virtual void SetUp() override {
        
    }

    virtual void TearDown() override {
        
    }
};



TEST_P(Person_walkTest, TestName) {
    auto param = GetParam();
    EXPECT_TRUE(false);
}

INSTANTIATE_TEST_SUITE_P(InstantiationName, Person_walkTest, testing::Values( /* "meeny", "miny", "moe" */))
