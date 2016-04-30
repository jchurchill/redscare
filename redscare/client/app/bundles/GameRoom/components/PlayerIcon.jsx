import React from 'react';
import css from './PlayerIcon.scss'

const PlayerIcon = (props) => {
  const { player, style, imgWidth } = props;
  return (
    <div className={css.player} style={style}>
      <div style={{ display: 'inline-block' }}>
        <div className={css.iconWrapper} style={{ backgroundColor: player.color }}>
          <img src="/assets/player-avatar-default.png" className={css.icon} style={{ width: imgWidth }} />
        </div>
        <div className={css.name}>{player.name}</div>
      </div>
    </div>
  );
};

export default PlayerIcon;