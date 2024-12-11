
void lala();


template<typename K>
inline bool lala_impl() {
    return false;
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


template<int K>
inline int get_K() {
    return K;
}


template<typename T, T K>
inline T get_TK() {
    return K;
}

template<typename T>
inline T get_T(int a) {
    return 0;
}

template<typename T>
inline int get_INT_T(int a) {
    return 0;
}



template<typename T, int K>
class Foo {
public:

    template<typename V>
    void func(double s, std::ofstream& of) {

    }

    T get() {
        return T(0);
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
        return true;
    }

    friend std::ostream& operator<<(std::ostream& os, const Foo<T,K>& person){ return os;}
};