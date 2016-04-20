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
    this.state = { selectedIndex: this.defaultSelectedIndex() }
  }

  defaultSelectedIndex() {
    const { round: { currentNomination } } = this.props;
    return currentNomination && (currentNomination.nominationNumber - 1);
  }

  onTabSelect(index) {
    this.setState({ selectedIndex: index });
  }

  render() {
    const { round: { nominations } } = this.props;
    const { selectedIndex } = this.state;
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