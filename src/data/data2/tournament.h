#ifndef TOURNAMENT_H
#define TOURNAMENT_H

#include <unordered_map>
#include <vector>

#include "AI_Player.h"
#include "Game.h"
#include "OnlyAIPlayerController.h"
#include "TournamentConfig.h"
#include "TournamentGameInformation.h"
#include "TournamentStatistics.h"
#include "Typedefs.h"


/**
 * @brief A class that lets the users run a tournament with a given
 * configuration
 */
class Tournament
{
  public:
    /**
     * @brief Runs a tournament continuously - used with the CLI
     *
     * @param config Config for the tournament
     * @return TournamentStatistics The result of the tournament
     */
    static TournamentStatistics run(tournament_config_t config);

    /**
     * @brief Helper to run the games one-by-one - used by the GUI
     *
     * @param seed Seed of the tournament
     * @return tournament_game_info_t Information about the result of the game
     */
    tournament_game_info_t launch_game(int seed, size_t gameNumber,
                                       ai_player_config_pc& aiConfigs);

    Tournament(tournament_config_t _config,
               TournamentStatistics& _destStatistics);
    const auto& get_config() { return config; }

  private:
    tournament_config_t config;
    TournamentStatistics& statistics;

    std::vector<tournament_game_info_t> launch_games(
        int seed, size_t gameGroupCount,
        std::vector<ai_player_config_pc>& aiConfigs);

    game_result_t update_statistics(tournament_game_info_t& controller);
    void print_results(tournament_game_info_t& gameInfo,
                       game_result_t& gameResult, int seed);
};

#endif // TOURNAMENT_H