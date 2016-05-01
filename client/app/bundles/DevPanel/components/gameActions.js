import { GameAction } from './GameActionForm.jsx';

export default [
  new GameAction("player_join")
    .withContextUserId('user_id'),

  new GameAction("player_leave")
    .withContextUserId('user_id'),

  new GameAction("start"),

  new GameAction("new_round"),

  new GameAction("new_nomination"),

  new GameAction("nominate_player")
    .withContextUserId('selecting_user_id')
    .withParam('selected_user_id', 'int'),

  new GameAction("start_voting"),

  new GameAction("cast_vote")
    .withContextUserId('voting_user_id')
    .withParam('upvote', 'bool'),

  new GameAction("complete_nomination"),

  new GameAction("start_mission"),

  new GameAction("mission_submit")
    .withContextUserId('submitting_user_id')
    .withParam('pass', 'bool'),

  new GameAction("complete_round"),

  new GameAction("begin_assassination"),

  new GameAction("select_assassin_target")
    .withContextUserId('selecting_user_id')
    .withParam('target_user_id', 'int'),

  new GameAction("complete_game")
]