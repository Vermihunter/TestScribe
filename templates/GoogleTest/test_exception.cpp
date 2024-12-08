
{{TestType}}({{TestSuiteName}}Test, {{TestNameThrow}}) {
    // auto param = GetParam();
    EXPECT_TRUE(false);
    // EXPECT_THROW(func_call(), {{ExceptionType}});
}

{{TestType}}({{TestSuiteName}}Test, {{TestNameNoThrow}}) {
    // auto param = GetParam();
    EXPECT_TRUE(false);
    // EXPECT_NO_THROW(func_call(), {{ExceptionType}});
}
