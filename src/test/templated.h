
void lala();

void lala_impl() {

}

class D {
    void D_a();
};

template<typename T, int K>
void fill_impl(const T& source) {

}

template<typename T, int K>
void fill_decl(const T& source);


template<typename F, int Keys>
class Foo {
public:

    template<typename V>
    void func(double s, std::ofstream& of) {

    }

    bool operator==(const Foo<T,K>& other) const {
        return (x == other.x) && (y == other.y);
    }

    bool operator<(const Foo<T,K>& other) const {
        // Compare by age, then by name if ages are equal
        if (age != other.age) {
            return age < other.age;
        }
        return name < other.name;
    }

    friend std::ostream& operator<<(std::ostream& os, const Foo<T,K>& person);
};