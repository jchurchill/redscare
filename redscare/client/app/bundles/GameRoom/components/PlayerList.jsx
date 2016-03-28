import React from 'react';

const defaultStyle = {
  display: "inline-block",
  margin: '5px',
  padding: '5px',
  border: '1px solid black',
  backgroundColor: 'white'
};

const PlayerList = (props) => {
  const { players, getAdditionalPlayerStyle } = props;
  const getStyle = getAdditionalPlayerStyle
    ? userId => {
      const additionalStyle = getAdditionalPlayerStyle(userId)
      return { ...defaultStyle, ...additionalStyle };
    }
    : userId => defaultStyle
  return (
    <div>
      { players.map(p => <div key={p.id} style={getStyle(p.id)}>{p.name}</div>) }
    </div>
  );
};

export default PlayerList;