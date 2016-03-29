import React from 'react';
import css from './PlayerList.scss'

const PlayerList = (props) => {
  const { players, getAdditionalPlayerStyle } = props;
  const getStyle = userId => getAdditionalPlayerStyle ? getAdditionalPlayerStyle(userId) : {}
  return (
    <div>
      { players.map(p => <div key={p.id} className={css.player} style={getStyle(p.id)}>{p.name}</div>) }
    </div>
  );
};

export default PlayerList;