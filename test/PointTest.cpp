class Point_distanceTest : public testing::TestWithParam<Point *,Point &> {
  // To access the test parameter, call GetParam() from class TestWithParam<T>.
public:
    virtual void SetUp() override {
        
    }

    virtual void TearDown() override {
        
    }
};



TEST_P(Point_distanceTest, TestName) {
    auto param = GetParam();
    EXPECT_TRUE(false);
}

INSTANTIATE_TEST_SUITE_P(InstantiationName, Point_distanceTest, testing::Values( /* "meeny", "miny", "moe" */))