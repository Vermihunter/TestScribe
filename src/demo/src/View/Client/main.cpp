#include <gtkmm.h>
#include <array>
#include <vector>
#include <string>
#include <memory>
#include "LocalController.h"

// TicTacToeWindow class inherits from Gtk::Window
class TicTacToeWindow : public Gtk::Window {
public:
    TicTacToeWindow(std::unique_ptr<IController> _controller);
    virtual ~TicTacToeWindow() = default;

private:
    // Signal handlers
    void on_button_clicked(int row, int col);
    void reset_game();
    std::unique_ptr<IController> controller;
    
    // UI Components
    Gtk::Grid grid;
    Gtk::Label status_label;
    Gtk::Button reset_button;

    // 3x3 grid of buttons
    std::array<std::array<Gtk::Button*, 3>, 3> buttons;

};

TicTacToeWindow::TicTacToeWindow(std::unique_ptr<IController> _controller)
    : controller(std::move(_controller)), reset_button("Reset")
{
    set_title("Tic Tac Toe");
    set_border_width(10);
    set_default_size(300, 350);

    // Setup grid
    grid.set_row_spacing(5);
    grid.set_column_spacing(5);

    // Create 3x3 buttons
    for(int i = 0; i < 3; ++i) {
        for(int j = 0; j < 3; ++j) {
            buttons[i][j] = Gtk::manage(new Gtk::Button(""));
            buttons[i][j]->set_hexpand(true);
            buttons[i][j]->set_vexpand(true);
            buttons[i][j]->set_size_request(80, 80);
            // Capture i and j by value for the lambda
            buttons[i][j]->signal_clicked().connect(
                [this, i, j]() { this->on_button_clicked(i, j); }
            );
            grid.attach(*buttons[i][j], j, i, 1, 1);
        }
    }

    // Setup status label
    status_label.set_text("Player X's turn");
    status_label.set_margin_top(10);
    status_label.set_margin_bottom(10);
    status_label.set_margin_start(5);
    status_label.set_margin_end(5);
    status_label.set_justify(Gtk::JUSTIFY_CENTER);
    status_label.set_halign(Gtk::ALIGN_CENTER);

    // Setup reset button
    reset_button.signal_clicked().connect(sigc::mem_fun(*this, &TicTacToeWindow::reset_game));
    reset_button.set_margin_top(10);
    reset_button.set_margin_bottom(10);
    reset_button.set_halign(Gtk::ALIGN_CENTER);

    // Layout containers
    Gtk::Box *vbox = Gtk::manage(new Gtk::Box(Gtk::ORIENTATION_VERTICAL, 5));
    vbox->pack_start(grid, Gtk::PACK_EXPAND_WIDGET);
    vbox->pack_start(status_label, Gtk::PACK_SHRINK);
    vbox->pack_start(reset_button, Gtk::PACK_SHRINK);

    add(*vbox);
    show_all_children();
}

void TicTacToeWindow::on_button_clicked(int row, int col)
{
    const auto& board = controller->get_board();
    if(board[row][col] != Player::NONE)
        return; // Cell already occupied

    Player current_player = controller->get_curr_player();

    controller->send_move(row, col);

    // Update button label
    buttons[row][col]->set_label(current_player == Player::X ? "X" : "O");
    buttons[row][col]->set_sensitive(false); // Disable the button

    // Check for winner
    if(controller->check_winner(current_player)) {
        status_label.set_text("Player " + std::string(current_player == Player::X ? "X" : "O") + " wins!");
        // Disable all buttons
        for(auto & row_buttons : buttons) {
            for(auto button : row_buttons) {
                button->set_sensitive(false);
            }
        }
        return;
    }

    // Check for draw
    if(controller->is_draw()) {
        status_label.set_text("It's a draw!");
        return;
    }

    // Switch player
    current_player = (current_player == Player::X) ? Player::O : Player::X;
    status_label.set_text("Player " + std::string(current_player == Player::X ? "X" : "O") + "'s turn");
}

void TicTacToeWindow::reset_game()
{
    // Reset buttons
    for(auto & row_buttons : buttons) {
        for(auto button : row_buttons) {
            button->set_label("");
            button->set_sensitive(true);
        }
    }

    controller->reset();
    // Reset current player
    status_label.set_text("Player X's turn");
}

int main(int argc, char *argv[])
{
    auto app = Gtk::Application::create(argc, argv, "com.example.tictactoe", Gio::APPLICATION_NON_UNIQUE);

    TicTacToeWindow window { std::make_unique<LocalController>()};
    
    return app->run(window);
}
