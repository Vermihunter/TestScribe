#include <string>

class Game {
    int players;

    void play();
    bool undo();
    virtual int add_player(int playerId, std::string playerName);
};