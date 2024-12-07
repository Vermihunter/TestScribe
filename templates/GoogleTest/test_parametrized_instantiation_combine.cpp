
INSTANTIATE_TEST_SUITE_P(BehaviorTest, {{TestSuiteName}}Test, 
    testing::Combine({{#each TestingParameters}}
        testing::Values({{{this}}}){{#unless @last}},{{/unless}}{{/each}})
    );
