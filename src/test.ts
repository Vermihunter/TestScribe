function getRealType(cppType: string): string {
    // Remove const/volatile/other qualifiers
    cppType = cppType.replace(/\b(const|volatile|mutable|restrict)\b/g, '');

    // Remove pointer (*) and reference (&) modifiers
    cppType = cppType.replace(/[*&]+/g, '');

    // Remove extra whitespace
    cppType = cppType.trim().replace(/\s+/g, ' ');

    return cppType;
}

// Example usage:
const type1 = "const int  &";
const type2 = "volatile char*";
const type3 = "mutable const long double* const   *  const*";

console.log(`"${getRealType(type1)}"`); // Output: "int"
console.log(`"${getRealType(type2)}"`); // Output: "char"
console.log(`"${getRealType(type3)}"`); // Output: "long double"
