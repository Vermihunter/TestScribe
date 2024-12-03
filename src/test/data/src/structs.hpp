#include <string>

class OtherClass {
public:
    std::string name;
    int age;

    static void static_class_method();
    virtual void virtual_class_method();
};

struct SomeStruct {
    double x;
    double y;

    void struct_method();
};
