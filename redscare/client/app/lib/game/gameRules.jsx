export function getEvilRoleCount(playerCount) {
  return { 5: 2, 6: 2, 7: 3, 8: 3, 9: 4, 10: 4 }[playerCount];
}