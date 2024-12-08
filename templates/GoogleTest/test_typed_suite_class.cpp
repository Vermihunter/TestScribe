
template <{{ClassTemplateParams}}>
struct TypeDefinitions
{
    //using MyA = A;
    //static constexpr int MyB = B;
};

template <class T>
class {{TestSuiteName}}Test : {{#each BaseClasses}}public {{{this}}}{{/each}} {
    static std::vector<std::tuple<{{{FuncTemplateParams}}}>> params;
};

// Declare type-parameterized test suite
TYPED_TEST_SUITE_P({{TestSuiteName}}Test);
