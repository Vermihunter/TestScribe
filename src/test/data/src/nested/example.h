#include <iostream>
using namespace std;

struct K {

};

/**
 * @throws std::exception if a an b are equal
 */
inline int add(int a, int b, K alpha) {
	return a + b;
}

