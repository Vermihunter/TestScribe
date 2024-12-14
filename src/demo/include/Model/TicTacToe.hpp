#ifndef TIC_TAC_TOE_HPP
#define TIC_TAC_TOE_HPP

#include <array>

// Enum to represent players and empty cells
enum class Player { NONE, X, O };

using board_t = std::array<std::array<Player, 3>, 3>;

class TicTacToe {
public:
    TicTacToe(const board_t& _board, Player _currPlayer) : board(_board), current_player(_currPlayer){}


    TicTacToe(Player _player) : current_player(_player) {
        // Initialize board to NONE
        for(auto & row : board) {
            row.fill(Player::NONE);
        }
    }

    TicTacToe() : TicTacToe(Player::X) {}

    // Helper functions
    bool check_winner(Player player);
    bool is_draw();

    Player get_curr_player() const { 
        return current_player;
    }

    bool send_move(int row, int col) {
        if(board[row][col] != Player::NONE) {
            return false;
        }

        board[row][col] = current_player;

        current_player = current_player == Player::X ? Player::O : Player::X; 
        return true;
    }

    const board_t& get_board() const { return board;}
private:
    // Game state
    board_t board;
    Player current_player;
};

#endif // TIC_TAC_TOE_HPP