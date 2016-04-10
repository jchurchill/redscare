const eventNamespace = 'game_room';
const events = [
    'player_joined',
    'player_left',
    'game_started',
    'new_round',
    'new_nomination',
    'player_nominated',
    'voting_started',
    'vote_cast',
    'nomination_completed',
    'mission_started',
    'submission_cast',
    'round_completed',
    'assassination_begun',
    'assassin_target_selected',
    'game_completed',
];

export default function listenForStateUpdates(gameClient, dispatchStateUpdated) {
  events.forEach(event => {
    gameClient.bind(`${eventNamespace}.${event}`, dispatchStateUpdated);
  });
}