import React, { PropTypes } from 'react';

export default class GameIndexGame extends React.Component {
  constructor(props) {
    super(props);
    //this.state = ...;
  }

  render() {
    const { id, title, creator, created_at, path } = this.props
    const createdAtString = (new Date(created_at)).toLocaleString();
    return (
      <tr>
        {/* Game column */}
        <td><a href={path}>{title}</a></td>
        {/* Created by column */}
        <td>{creator}</td>
        {/* Created at column */}
        <td>{createdAtString}</td>
      </tr>
    );
  }
}
