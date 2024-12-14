#include "TicTacToe.hpp"

bool TicTacToe::check_winner(Player player)
{
    // Check rows
    for(int i = 0; i < 3; ++i) {
        if(board[i][0] == player && board[i][1] == player && board[i][2] == player)
            return true;
    }

    // Check columns
    for(int j = 0; j < 3; ++j) {
        if(board[0][j] == player && board[1][j] == player && board[2][j] == player)
            return true;
    }

    // Check diagonals
    if(board[0][0] == player && board[1][1] == player && board[2][2] == player)
        return true;
    if(board[0][2] == player && board[1][1] == player && board[2][0] == player)
        return true;

    return false;
}

bool TicTacToe::is_draw()
{
    for(auto & row : board) {
        for(auto cell : row) {
            if(cell == Player::NONE)
                return false;
        }
    }
    return true;
}
