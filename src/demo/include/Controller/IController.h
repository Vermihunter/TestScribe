#ifndef I_CONTROLLER_H
#define I_CONTROLLER_H

#include "TicTacToe.hpp"
#include <memory>

struct IController {
    virtual bool is_draw() = 0;
    virtual bool check_winner(Player player) = 0 ;
    virtual bool send_move(int row, int col) = 0;
    virtual void reset() = 0;
    virtual Player get_curr_player() = 0;
    virtual const board_t& get_board() = 0;

protected:
    std::unique_ptr<TicTacToe> game;
};  


#endif // I_CONTROLLER_H