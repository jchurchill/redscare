import React, { PropTypes } from 'react';

// CSS
import cx from 'classnames';
import css from './RoundStateDisplay.scss'

// Libraries / helpers
import Round from 'lib/game/roundHelper';

// Components
import Collapse from 'react-collapse';

class RoundStateDisplay extends React.Component {
  static propTypes = {
    round: PropTypes.instanceOf(Round).isRequired
  };

  constructor(props) {
    super(props);
    this.state = { expanded: false };
  }

  getRoundCompletionType(round) {
    switch(round.outcome) {
      case Round.outcomes.SUCCESS:
        return "success";
      case Round.outcomes.FAILURE:
      case Round.outcomes.OUT_OF_NOMINATIONS:
        return "fail";
      default:
        return "incomplete";
    }
  }

  roundDisplayClicked() {
    // toggle expanded
    const { expanded } = this.state;
    this.setState({ expanded: !expanded });
  }

  render() {
    const { round } = this.props;
    const { expanded } = this.state;
    const completionType = this.getRoundCompletionType(round); 
    return (
      <div className={cx(css.round, css[completionType])}>
        <div onClick={() => this.roundDisplayClicked()}>
          <div className={cx(css.roundNumber, css.inline)}>{round.roundNumber}</div>
        </div>
        <Collapse isOpened={expanded} keepCollapsedContent={true}>
          <div>extra content!</div>
        </Collapse>
      </div>
    );
  }
}

export default RoundStateDisplay;