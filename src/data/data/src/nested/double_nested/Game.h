#ifndef GAME_H
#define GAME_H

#include <string>
#include <iostream>

using namespace std;

inline void greet() {
    cout << "Hello!" << endl;
}

class Game {

    int players;

public:
    /**
     * @throws std::exception if in a bad mood :/
     */
    void play();
    bool undo();
    virtual int add_player(int playerId, std::string playerName);
};

#endif //GAME_H