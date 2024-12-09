import { endianness } from "os";

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
const templateParameters = ["T", "F"];

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


const processedParams = processAllTemplated(variableName, templateParameters); // , 0, variableName.length
console.log(processedParams);
//const result = addTypenamePrefix(variableName, templateParameters);
//console.log(`< ${variableName.indexOf("<")} --- > ${variableName.lastIndexOf(">")}`); 
    // Expected: Foo<std::shared_ptr<typename T::F>, K, typename T::T*>