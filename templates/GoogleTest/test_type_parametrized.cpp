template <typename T>
class {{TestSuiteName}} : public testing::Test {
    
};

// Declare type-parameterized test suite
TYPED_TEST_SUITE_P({{TestSuiteName}});


// Define  type-parameterized test - there could be  multiple
TYPED_TEST_P({{TestSuiteName}}, Test1) {
    // Inside a test, refer to TypeParam to get the type parameter.
    TypeParam n = 0;

}


// Register 
REGISTER_TYPED_TEST_SUITE_P(FooTest, Test1 /*, Test2, Test3, ...*/);

// Instantiate with the wanted types - First argument is a prefix thatwill be added to the test suite name
using MyTypes = ::testing::Types<char, int, unsigned int>;
INSTANTIATE_TYPED_TEST_SUITE_P(MyTypes, {{TestSuiteName}}, MyTypes);
INSTANTIATE_TYPED_TEST_SUITE_P(MyInt, {{TestSuiteName}}, Int);
