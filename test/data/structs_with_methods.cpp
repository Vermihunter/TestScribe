#include <string>

class Person {
public:
    std::string name;
    int age;

    static void greet();
    virtual void walk();
};



struct Point {
protected:
    static double x;
    double y;
    static double distance(const Point * a, const Point& b);

    struct A{
        int k;
        int c;
    };
};
