import Ember from "ember";

// Every rule constraint has a target and either `keys` or
// `predicate`. key-based constraints are cheaper because we can check
// them with O(1) lookups, whereas predicates must be searched O(n).
export default class Constraint {
  constructor(target, matcher) {
    // targets are the properties of a transition that we can
    // constrain
    this.target = target;
    if (matcher instanceof RegExp) {
      this.predicate = function(value) { return matcher.test(value); };
    } else if (typeof matcher === 'function') {
      this.predicate = matcher;
    } else if (typeof matcher === 'boolean') {
      this.predicate = function(value) { return matcher ? value : !value; };
    } else {
      this.keys = constraintKeys(matcher);
    }
  }
}

export var EMPTY = {};

export function constraintKeys(matcher) {
  if (typeof matcher === 'undefined') {
    matcher = [ EMPTY ];
  } else if (!Ember.isArray(matcher)) {
    matcher = [matcher];
  }
  return Ember.A(matcher).map((elt) => {
    if (typeof elt === 'string') {
      return elt;
    } else {
      return Ember.guidFor(elt);
    }
  });
}