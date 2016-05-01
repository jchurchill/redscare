// Simple utility for adding calculate-once properties to a class
// e.g.:
// class MyClass {
//   get expensiveValueToCalculate() {
//     return memo("expensiveValueToCalculate", this, () => { console.log("expensive work!"); });
//   }
// }
//
// Note: this throws a _memoStore property on the object to hold memoized results

export default (propertyName, object, factory) => {
  if (typeof(object._memoStore) === 'undefined') { object._memoStore = {}; }
  if (object._memoStore.hasOwnProperty(propertyName)) { return object._memoStore[propertyName]; }
  return object._memoStore[name] = factory.call(object);
};