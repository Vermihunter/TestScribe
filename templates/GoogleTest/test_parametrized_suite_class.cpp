
class {{TestSuiteName}}Test : public testing::TestWithParam<std::tuple<{{{TemplateParams}}}>> {
// To access the test parameter, call GetParam() from class TestWithParam<T>.
public:
    virtual void SetUp() override {
        
    }

    virtual void TearDown() override {
        
    }
};
