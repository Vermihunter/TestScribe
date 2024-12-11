

// Register test functions
REGISTER_TYPED_TEST_SUITE_P({{TestSuiteName}}Test, {{#each TestSuites}}{{this}}{{#unless @last}}, {{/unless}}{{/each}} /*, Test2, Test3, ...*/);

// Instantiate with the wanted types - First argument is a prefix thatwill be added to the test suite name
// using MyTypes = ::testing::Types<TypeDefinitions<{{ClassTemplateParams}}> /**, ... */>;
// INSTANTIATE_TYPED_TEST_SUITE_P(InstantiationName, {{TestSuiteName}}Test, MyTypes);

// Add values for concrete template parameters
// template<> 
// std::vector<std::tuple<bool, std::shared_ptr<Foo<int, 6>>>>
   // {{TestSuiteName}}Test<TypeDefinitions<{{ClassTemplateParams}}>>::params = {
        // {false, nullptr}
   // };
