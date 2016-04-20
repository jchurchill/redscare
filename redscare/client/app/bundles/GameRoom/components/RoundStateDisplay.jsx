import React, { PropTypes } from 'react';
import Round from 'lib/game/roundHelper';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import NominationStateDisplay from './NominationStateDisplay.jsx';

class RoundStateDisplay extends React.Component {
  static propTypes = {
    round: PropTypes.instanceOf(Round).isRequired
  };

  constructor(props, context) {
    super(props, context);
    const { round } = props;
    this.state = { [round.id]: this.defaultSelectedIndex(round) }
  }

  defaultSelectedIndex(round) {
    if (!round) { return undefined; }
    const { currentNomination } = round;
    if (!currentNomination) { return undefined; }
    const { nominationNumber } = currentNomination;
    return nominationNumber - 1;
  }

  onTabSelect(index) {
    const { round } = this.props;
    this.setState({ [round.id]: index });
  }

  render() {
    const { round, round: { id: roundId, nominations } } = this.props;
    var { [roundId]: selectedIndex } = this.state;
    selectedIndex = selectedIndex !== undefined ? selectedIndex : this.defaultSelectedIndex(round);
    return (
      <div>
        <Tabs onSelect={this.onTabSelect.bind(this)} selectedIndex={selectedIndex}>
          <TabList>
            { nominations.map(nom => (
              <Tab key={nom.nominationNumber}>
                Nomination {nom.nominationNumber}
              </Tab>
            )) }
          </TabList>
          { nominations.map(nom => (
            <TabPanel key={nom.nominationNumber}>
              <NominationStateDisplay nomination={nom} />
            </TabPanel>
          )) }
        </Tabs>
      </div>
    );
  }
}

export default RoundStateDisplay;