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

    /**
     * @throws std::bad_alloc if in bad mood
     */
    void struct_method();
};
