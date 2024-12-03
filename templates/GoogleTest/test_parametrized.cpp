class {{TestSuiteName}}Test : public testing::TestWithParam<std::tuple<{{{TemplateParams}}}>> {
  // To access the test parameter, call GetParam() from class TestWithParam<T>.
public:
    virtual void SetUp() override {
        
    }

    virtual void TearDown() override {
        
    }
};

TEST_P({{TestSuiteName}}Test, TestName) {
    auto param = GetParam();
    EXPECT_TRUE(false);
}

INSTANTIATE_TEST_SUITE_P(InstantiationName, {{TestSuiteName}}Test, testing::Values( /* "meeny", "miny", "moe" */));
