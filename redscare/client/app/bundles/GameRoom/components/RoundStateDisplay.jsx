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
  }

  render() {
    const { round: { state, nominations, currentNomination } } = this.props;
    const selectedIndex = currentNomination && (currentNomination.nominationNumber - 1);
    return (
      <div>
        <div>Current status: {state}</div>
        <Tabs selectedIndex={selectedIndex}>
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