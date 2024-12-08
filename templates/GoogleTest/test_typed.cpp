
// Define  type-parameterized test - there could be  multiple
TYPED_TEST_P({{TestSuiteName}}Test, {{TestName}}) {
    // Inside a test, refer to TypeParam to get the type parameter.
    // TypeParam n = 0;
    //for (TypeParam value : {{TestSuiteName}}<TypeParam>::params) {
    //    EXPECT_GT(value,0);
    //}

    // You will need to use `this` explicitly to refer to fixture members.
    // this->DoSomethingInteresting()
}

