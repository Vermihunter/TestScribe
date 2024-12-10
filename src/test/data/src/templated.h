
void lala();

template<typename K>
inline bool lala_impl() {

}

struct D {
    void D_a();
};

template<typename T, int K>
inline void fill_impl(const T& source) {
    throw "xd";
}

template<typename T, int K>
void fill_decl(const T& source);


template<typename T, int K>
class Foo {
public:

    template<typename V>
    void func(double s, std::ofstream& of) {

    }

    void haha() {
        
    }

    bool operator==(const Foo<T,K>& other) const {
        return true;
        //return (x == other.x) && (y == other.y);
    }

    bool operator<(const Foo<T,K>& other) const {
        // Compare by age, then by name if ages are equal
        // if (age != other.age) {
        //     return age < other.age;
        // }
        // return name < other.name;
    }

    friend std::ostream& operator<<(std::ostream& os, const Foo<T,K>& person){ return os;}
};