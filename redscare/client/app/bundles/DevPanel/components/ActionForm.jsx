import React, { PropTypes } from 'react';
import css from './ActionForm.scss'

class ActionForm extends React.Component {
  static PropTypes = {
    submit: PropTypes.string.isRequired,
    actionName: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    parameters: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      parse: PropTypes.func
    })).isRequired
  }

  constructor(props) {
    super(props);
    const initialData =
      props.parameters.reduce((data, param) => { data[param.name] = null; return data; }, {});
    this.state = { data: initialData };
  }

  onChange(param, e) {
    const { name, parse } = param
    const parser = parse || (x => x);
    const newData = { ...(this.state.data), [name]: parser(e.target.value) }
    this.setState({ data: newData });
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.submit(this.state.data);
  }

  canSubmit() {
    const { data } = this.state;
    // All params must have a value of _some_ kind
    return !this.props.parameters.some(p => !data[p.name]);
  }

  render() {
    const { actionName, parameters, disabled } = this.props;
    return (
      <form className={css.actionForm} onSubmit={this.onSubmit.bind(this)}>
        <input type="submit" disabled={disabled || !this.canSubmit()} value={actionName} />
        {parameters.map(param =>
          <input key={param.name} type="number" disabled={disabled} placeholder={param.name} onChange={this.onChange.bind(this, param)} />
        )}
      </form>
    )
  }
}

export default ActionForm