import React from 'react';
import css from './PlayerList.scss'

const PlayerList = (props) => {
  const { players } = props;
  return (
    <div>
      { players.map(p => <div key={p.id} className={css.player} style={{ backgroundColor: p.color }}>{p.name}</div>) }
    </div>
  );
};

export default PlayerList;