#ifndef GAME_H
#define GAME_H

#include <iostream>
#include <numeric>

// #include "Board.h"
// #include "Constants.h"
// #include "Die.h"
// #include "EvalState.h"
// #include "GameContext.h"
// #include "GameHistory.h"
// #include "GameInfo.h"
// #include "GameState.h"
// #include "Move.h"
// #include "Typedefs.h"

class GameFlowController;
class EvalState;
class GamePlayingPage;

/**
 * @brief The main part of the Sagrada back-end
 *
 * Defines the minimum interface to interact with the back-end.
 *
 * All the information about the game is stored inside the
 * currState and the ctx objects.
 */
class Game
{
  public:
    enum single_move_choice_strategy_t
    {
        SINGLE_MOVE_STRATEGY_FIRST,
        SINGLE_MOVE_STRATEGY_RANDOM
    };

    ~Game() = default;

    /**
     * @brief Cloning a game
     *
     * @param g Cloned object
     * @param rnd RandomGenerator object to use in the new game
     */
    Game(const Game& g, rnd_t rnd);

    Game(const Game& g);

    /**
     * @brief Makes a copy of the current game
     */
    game_t clone() const
    {
        return std::make_unique<Game>(*this, ctx->rnd->clone());
    }

    game_t clone_identical() const { return std::make_unique<Game>(*this); }

    /**
     * @brief Makes a copy of the current game and hides the future
     * non-deterministic information
     */
    game_t clone_with_pseudo_random_future(ID_t focusedPlayerID, int seed);

    /**
     * @brief Uses a concrete seed for the RandomGenerator so the original one
     * was not cloned
     */
    game_t clone_with_seed(int seed)
    {
        return std::make_unique<Game>(
            *this, RandomGenerator::initialize_with_seed(seed));
    }

    /**
     * @brief Construct a new Game object with a context
     *
     * It is not possible to construct a Game object without a context because
     * the context defines some rules and the state that this object will
     * manipulate for different user interractions.
     * @param ctx
     */
    Game(game_context_t ctx, game_state_t gameState);

    /**
     * @brief Returns pair of iterators for the first and last
     * element that define a given player's WPC choices.
     *
     * @param playerId ID of the player
     * @return auto pair of iterators
     */
    auto get_player_window_pattern_card_options(ID_t playerId)
    {
        const player_t& player = GameInfo::get_player_with_id(*this, playerId);

        size_t playerInd = player->ID;

        auto bIt = ctx->selectableWPC.begin();
        auto eIt = ctx->selectableWPC.begin();

        std::advance(bIt, playerInd * ctx->playerWpcChoiceCount);
        std::advance(eIt, (playerInd + 1) * ctx->playerWpcChoiceCount);

        return std::pair {bIt, eIt};
    }

    /**
     * @brief Sets the board of a player after choosing a WPC
     *
     * Cannot do this before the game is fully initialized since passing
     * the WPC choices to players is the responsibility of the game.
     */
    void set_board(ID_t playerId, board_t board);

    /**
     * @brief Returns list of all moves a player can make in the current state
     * Includes passing. This function returns moves for the current moving
     * player.
     *
     * @return move_c list of the possible moves
     */
    move_c possible_moves();

    /**
     * Some AI agents choose their moves randomly or without using any domain
     * knowledge or computing and this function helps them to be as fast as
     * possible because instead of generating all the possible moves which are
     * ignored totally anyways, the single move is generated.
     */
    move_t get_single_move(single_move_choice_strategy_t strategy);

    /**
     * @brief Request to make a move
     * Defines the rules that a move has to fulfill.
     * If the move is correct according to the rules, it will be taken
     *
     * @param m the move that is requested
     * @throws BadMoveRequest if the move is invalid
     */
    void move_request(move_t m, bool allowDieToFieldMove = false);

    /**
     * @brief Undo operation for the last move made
     * It is not possible to undo previous moves because it may not make
     * the game state equal to any previous one.
     *
     * This functionality is currently not implemented and not used
     */
    void undo_last_move();

    /**
     * @brief It is part of the public API because some of the tool cards use
     * them. These are the ones that consist of manipulating state of a die and
     * then placing it calls this to undo the placing part of the move
     *
     * This functionality is currently not implemented and not used
     */
    void undo_dtfm(die_to_field_move_t m, bool putDieBackToCurrRoundsDice,
                   bool shiftRoundsBack);

    /**
     * @brief Evaluates the current standing of the game
     *
     * This function uses full information about all players' private objective
     * cards
     */
    eval_state_c evaluate();

    /**
     * @brief Getters for GameContext and GameState objects
     */
    const auto& get_ctx() const { return fastctx; }
    const auto& get_curr_state() const { return currState; }

    /**
     * @throws MyCustomException aa
     * @throws lalalom aa
     */
    const int * const * get_ctx() { 
        throw std::exception{};
        throw std::exc::runtime_exc{"aa",bb};
        throw 55;
        throw 98.6;
        throw "hello";
        throw 'a';
        throw nullptr;
        throw false;

        throw MyCustomException{};

        throw new HeapException();

        try {
            int* arr = new int[100000000000]; // May throw std::bad_alloc
            throw std::bad_alloc{};
        } catch (const std::bad_alloc& e) {
            std::cerr << "Memory allocation failed: " << e.what() << std::endl;
        } catch(const std::exception& e) {

        } catch(...) {

        }
        return ctx; 
    }
    auto& get_curr_state() { return currState; }

  private:
    game_context_t ctx;
    /**
     * @brief This raw pointer points to the same object as the ctx smart
     * pointer The reason to separate it into a raw pointer is connected to
     * performance
     */
    GameContext* fastctx;
    game_state_t currState;
    GameHistory history;

    /**
     * @brief Helper functions handling different types of move requests
     */
    void basic_move_request(die_to_field_move_t m, bool allowDieToFieldMove);
    void tool_card_move_request(move_t m);

    /**
     * @brief Functions that are connected to Game state operation after given
     * events These events include undo operation, last move of the round or
     * initialization
     */
    void remove_die_from_currents(Die* d, bool throwOnNotFound);
    void plan_next_player_on_move();
    void put_remaining_dice_to_round_track();
    void plan_next_round();
    void plan_player_order();
    void shift_order_backwards();

    void undo_tool_card_move(MoveInfo& m);

    move_t get_first_possible_move();
    move_t get_random_possible_move();
};

#endif // GAME_H