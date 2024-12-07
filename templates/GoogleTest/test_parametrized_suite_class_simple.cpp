
class {{TestSuiteName}}Test : public {{GoogleTestBaseClass}}<std::tuple<{{{TemplateParams}}}>>{{#if HasBaseClass}}, public {{BaseClass}} {{/if}}{};
    