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
        <RoundMissionInfo round={round} />
        <Tabs onSelect={this.onTabSelect.bind(this)} selectedIndex={selectedIndex}>
          <TabList>
            { nominations.map(nom => (
              <Tab key={nom.nominationNumber}>
                <span>{nom.nominationNumber}</span>
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

const RoundMissionInfo = props => {
  const { round: { outcome, failCount, missionInfo: { operativeCount, requiredFailCount } } } = props;
  const requiredPassCount = operativeCount - requiredFailCount + 1;
  const requiredPasses = Array.apply(null, { length: operativeCount });
  const actualPasses = Array.apply(null, { length: operativeCount });
  for (var i = 0; i < operativeCount; i++) {
    requiredPasses[i] = i < requiredPassCount ? true : false;
    if (outcome != null) {
      actualPasses[i] = i < (operativeCount - failCount) ? true : false;
    }
  }
  return (
    <table style={{ margin: '10px auto' }}>
      <tbody>
        <tr>
          <td style={{ fontStyle: 'italic' }}>
            <span style={{ marginRight: 10 }}>To pass</span>
          </td>
          {
            requiredPasses.map((req, i) => {
              const backgroundColor = req ? 'lightcyan' : 'lightgray';
              return (<td key={i} style={{ width: 50, border: '1px solid black', backgroundColor }}></td>)
            })
          }
        </tr>
        <tr>
          <td style={{ fontStyle: 'italic' }}>
            <span style={{ marginRight: 10 }}>Result</span>
          </td>
          {
            actualPasses.map((pass, i) => {
              const backgroundColor = pass == null ? 'lightgray' : pass ? 'lightcyan' : 'lightpink';
              return (<td key={i} style={{ width: 50, border: '1px solid black', backgroundColor }}></td>)
            })
          }
        </tr>
      </tbody>
    </table>
  );
}

export default RoundStateDisplay;