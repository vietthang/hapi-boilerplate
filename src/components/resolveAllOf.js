import { isObjectLike, isArray, mergeWith, union, omit, mapValues, map } from 'lodash/fp'

function customizer(objValue, srcValue) {
  if (isArray(objValue)) {
    return union(objValue, srcValue)
  } else {
    return undefined
  }
}

export default function resolveAllOf(inputSpec) {
  if (isObjectLike(inputSpec)) {
    const { allOf } = inputSpec

    if (isArray(allOf)) {
      return allOf.reduce(
        (prevValue, value) => mergeWith(customizer, prevValue, resolveAllOf(value)),
        omit('allOf', inputSpec),
      )
    } else if (isArray(inputSpec)) {
      return map(value => resolveAllOf(value), inputSpec)
    } else {
      return mapValues(value => resolveAllOf(value), inputSpec)
    }
  } else {
    return inputSpec
  }
}
