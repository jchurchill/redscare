import React, { PropTypes } from 'react';
import Action from './action.js'
import css from './ActionForm.scss'

class ActionForm extends React.Component {
  static PropTypes = {
    submit: PropTypes.func.isRequired,
    action: PropTypes.instanceOf(Action).isRequired,
    disabled: PropTypes.bool
  }

  constructor(props) {
    super(props);
    const initialData = props.action.parameters.reduce(
      (data, param) => {
        data[param.name] = { hasValue: false, value: null };
        return data;
      }, {});
    this.state = { data: initialData };
  }

  onChange(param, e) {
    const { name, parser } = param
    const paramData = { hasValue: (e.target.value != null), value: parser(e.target.value) }
    const newData = { ...(this.state.data), [name]: paramData }
    this.setState({ data: newData });
  }

  onSubmit(e) {
    e.preventDefault();
    const submitData = this.props.action.parameters.reduce(
      (data, param) => {
        data[param.name] = this.state.data[param.name].value;
        return data;
      }, {});
    this.props.submit(submitData);
  }

  canSubmit() {
    const { data } = this.state;
    // All params must have a value of _some_ kind
    return !this.props.action.parameters.some(p => !data[p.name].hasValue);
  }

  render() {
    const { action: { actionName, parameters }, disabled } = this.props;
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