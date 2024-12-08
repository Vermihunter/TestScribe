export const cppPrimitiveTypes = new Map<string, { signed: boolean }>([
    // Integer Types
    ["signed char", { signed: true }],
    ["unsigned char", { signed: false }],
    ["short", { signed: true }],
    ["unsigned short", { signed: false }],
    ["int", { signed: true }],
    ["unsigned int", { signed: false }],
    ["long", { signed: true }],
    ["unsigned long", { signed: false }],
    ["long long", { signed: true }],
    ["unsigned long long", { signed: false }],
    ["size_t", { signed: false }],

    // Floating-Point Types (Always Signed)
    ["float", { signed: true }],
    ["double", { signed: true }],
    ["long double", { signed: true }],

    // Character Types
    ["char", { signed: true }], // Platform-dependent, usually signed
    ["signed char", { signed: true }],
    ["unsigned char", { signed: false }],

    // Boolean Type (Neither Signed Nor Unsigned)
    ["bool", { signed: false }],

    // Wide Character Types
    ["wchar_t", { signed: false }], // Implementation-defined
    ["char16_t", { signed: false }], // Implementation-defined
    ["char32_t", { signed: false }], // Implementation-defined

    // Fixed-Width Integer Types
    ["int8_t", { signed: true }],
    ["uint8_t", { signed: false }],
    ["int16_t", { signed: true }],
    ["uint16_t", { signed: false }],
    ["int32_t", { signed: true }],
    ["uint32_t", { signed: false }],
    ["int64_t", { signed: true }],
    ["uint64_t", { signed: false }],
    ["intmax_t", { signed: true }],
    ["uintmax_t", { signed: false }],
    ["intptr_t", { signed: true }],
    ["uintptr_t", { signed: false }]
]);
