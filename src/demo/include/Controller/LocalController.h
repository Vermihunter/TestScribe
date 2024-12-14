#include "IController.h"


struct LocalController : public IController {
    LocalController() {
        game = std::make_unique<TicTacToe>();
    }

    virtual bool is_draw() override {
        return game->is_draw();
    }

    virtual bool check_winner(Player player) override {
        return game->check_winner(player);
    }

    virtual Player get_curr_player() override {
        return game->get_curr_player();
    }

    virtual bool send_move(int row, int col) override {
        return game->send_move(row, col);
    }

    virtual void reset() override {
        game = std::make_unique<TicTacToe>();
    }

    virtual const board_t& get_board() override {
        return game->get_board();
    }
};