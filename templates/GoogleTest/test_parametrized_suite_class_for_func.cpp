
{{#if HasTemplates}}template<{{ClassTemplateParams}}>{{/if}} 
class {{{TestSuiteName}}}Test : public {{{GoogleTestBaseClass}}}<std::tuple<{{{FuncTemplateParams}}}>>{{#if HasBaseClass}}, public {{{BaseClass}}}{{#if HasTemplates}}{{ClassTemplateParamNames}}>{{/if}} {{/if}} {};
    