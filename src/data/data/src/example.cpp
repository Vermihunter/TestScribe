#include <string>

template<typename T>
class MyTemplateClass {
public:
    T data;

    template<typename U>
    void myFunction(U value);
};

class Outer {
public:
    template<typename V, int N>
    class Inner {
    public:
        V array[N];
    };
};
