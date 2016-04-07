
// Supported parameter types
const typeParsers = {
  int: x => parseInt(x, 10),
  string: x => x,
  bool: x => {
    switch(x.toLowerCase()) { case "false": case "no": case "0": case "": return false; default: return true; }
  }
};

export default class Action {
  constructor(actionName) {
    this._actionName = actionName;
    this._parameters = [];
  }
  
  get actionName() {
    return this._actionName;
  }

  get parameters() {
    // Only return a copy
    return this._parameters.slice();
  }

  withParam(name, type) {
    const parser = typeParsers[type];
    if (!parser) { throw { message: `GameAction: unsupported type '${type}'.` }; }
    this._parameters.push({ name, parser });
    return this;
  }
}