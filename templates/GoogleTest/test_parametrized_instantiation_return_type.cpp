
INSTANTIATE_TEST_SUITE_P(ReturnTypeTest, {{TestSuiteName}}Test, testing::Values({{#each TestingParameters}}{{{this}}}{{#unless @last}},{{/unless}}{{/each}}));
