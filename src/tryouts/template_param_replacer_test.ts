import { endianness } from "os";
import { Parameter } from "@/cpp_objects";

function addTypenamePrefix(variableName: string, templateParameters: string[]): string {
    const regex = new RegExp(
        `\\b(${templateParameters.map(param => param.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, // Match raw template parameters
        'g'
    );

    let stack: string[] = [];
    let result = "";
    let i = 0;

    while (i < variableName.length) {
        const char = variableName[i];

        if (char === '<') {
            stack.push('<');
            result += char;
            i++;
            continue;
        }

        if (char === '>') {
            stack.pop();
            result += char;
            i++;
            continue;
        }

        if (stack.length > 0) {
            // Check if we're at an unmodified template parameter
            let match = variableName.slice(i).match(regex);

            if (match && !variableName.slice(i).startsWith("typename T::")) {
                const param = match[0];
                result += `typename T::${param}`;
                i += param.length;
                continue;
            }
        }

        result += char;
        i++;
    }

    return result;
}


function getRealType(cppType: string): string {
    // Remove const/volatile/other qualifiers
    cppType = cppType.replace(/\b(const|volatile|mutable|restrict)\b/g, '');

    // Remove pointer (*) and reference (&) modifiers
    cppType = cppType.replace(/[*&]+/g, '');

    // Remove extra whitespace
    cppType = cppType.trim().replace(/\s+/g, ' ');

    return cppType;
}

// Example Usage
//const variableName = "Foo<std::shared_ptr<  const F const  &  const * const*>, K, T*>";
//const variableName = "Foo<std::shared_ptr<F>, K, std::shared_ptr<T*>>";
const variableName = "std::shared_ptr<Foo<K,T>>";
//const templateParameters = ["T", "F"];

const variableNames: string[] = [
    "std::shared_ptr<Foo<K,T>, Bar<  F, A, D, T, F, C>, Coliembar, PapaDoc<88, AFA,F, faPE>>", // 
    "T",
    "std::shared_ptr<    F >",
    "int"
];
const templateParameters: Parameter[] = [{name:"T", type: ""}, {name: "F", type:""}];

function processAllTemplated(s: string, allTemplateParams: string[]): string {
    console.log(`Processing: "${s}"`);
    const nextOpeningOccurence = s.indexOf("<");
    const nextClosingOccurence = s.lastIndexOf(">");

    if(nextClosingOccurence === -1 || nextOpeningOccurence === -1) {
        return s;
    }

    const variables: string[] = s
        .slice(nextOpeningOccurence + 1, nextClosingOccurence)
        .split(",")
        .map(x => {
            const innerType: string = getRealType(x.trim());
            return allTemplateParams.some(x => x === innerType)
                ? `typename T::${innerType}`
                : processAllTemplated(innerType, allTemplateParams);
        });
    
    return s.slice(0, nextOpeningOccurence + 1) + variables.join(", ") + s.slice(nextClosingOccurence, s.length);
}

function addTemplatedConstructs(s: string, templates: Parameter[]): [string, number] {

    let currParam: string = "";
    const allParams: string[] = [];

    function pushParam() {
        const trimmedParam: string = currParam.trim();
        if(trimmedParam.length > 0) {
            allParams.push(trimmedParam);
        }
        currParam = "";
    }

    function mapParams(): string {
        pushParam();
        return allParams.map(p => {
            return templates.some(t => t.name === p)
                ? `typename T::${p}`
                : p;

        }).join(", ");
    }

    for(let i = 0; i < s.length; i += 1) {
        switch(s[i]) {
            case "<":
                const [nextLevelString, charsChecked] = addTemplatedConstructs(s.slice(i + 1), templates);
                currParam += "<" + nextLevelString + ">";
                i += charsChecked + 1;
                pushParam();
                break;

            case ">":
                return [mapParams(), i];

            case ",":
            case ' ':
            case '\t':
            case '\n':
            case '\r':
            case '\f':
                pushParam();
                break;

            default:
                currParam = currParam + s[i];
        }
    }

    return [mapParams(), s.length];
}

//const processedParams = processAllTemplated(variableName, templateParameters); // , 0, variableName.length
variableNames.forEach(variableName => {
    const [processedParams, _] = addTemplatedConstructs(variableName, templateParameters);
    console.log(`${variableName} -> ${processedParams}`);
});
//const result = addTypenamePrefix(variableName, templateParameters);
//console.log(`< ${variableName.indexOf("<")} --- > ${variableName.lastIndexOf(">")}`); 
    // Expected: Foo<std::shared_ptr<typename T::F>, K, typename T::T*>