#include <string>
#include <vector>

using namespace std;

struct BoardIndex{
    std::string k;
    int l;
    using index_t = int;

    int row;
    int col;
};

template <>
struct std::hash<BoardIndex>
{
    std::size_t operator()(const BoardIndex& ind) const
    {
        std::size_t h1 = std::hash<BoardIndex::index_t> {}(ind.row);
        std::size_t h2 = std::hash<BoardIndex::index_t> {}(ind.col);

        return h1 ^ h2;
    }
    unsigned int l;
    const unsigned int& load(const unsigned int * k, const std::string& name, string& name2, std::string a, const std::string kalapacs, std::string& name3, const string nam4) {
        return l;
    }

    const std::string& get_name() {
        return name;
    }
    std::string name;

    const std::vector<BoardIndex>& get_games() {
        return games;
    }
    std::vector<BoardIndex> games;
};
