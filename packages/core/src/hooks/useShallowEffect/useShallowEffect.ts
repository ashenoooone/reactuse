import type { DependencyList, EffectCallback } from 'react';

import { shallowEqual } from '@/helpers/shallowEqual/shallowEqual';

import { useCustomCompareEffect } from '../useCustomCompareEffect/useCustomCompareEffect';

const shallowEqualDeps = (deps: DependencyList, prevDeps: DependencyList) =>
  deps.length === prevDeps.length && deps.every((dep, index) => shallowEqual(dep, prevDeps[index]));

/**
 * @name useShallowEffect
 * @description - Hook that executes an effect only when dependencies change shallowly
 * @category Lifecycle
 * @usage low
 *
 * @param {EffectCallback} effect The effect callback
 * @param {DependencyList} [deps] The dependencies list for the effect
 *
 * @warning - Use `useCustomCompareEffect` with your own comparator when the comparison rules do not fit
 *
 * @example
 * useShallowEffect(() => console.log("effect"), [user]);
 */
export const useShallowEffect = (effect: EffectCallback, deps?: DependencyList) => {
  useCustomCompareEffect(effect, deps, shallowEqualDeps);
};
