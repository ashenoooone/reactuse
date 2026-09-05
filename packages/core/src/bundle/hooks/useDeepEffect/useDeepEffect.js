import { deepEqual } from '@/helpers/deepEqual/deepEqual';
import { useCustomCompareEffect } from '../useCustomCompareEffect/useCustomCompareEffect';
/**
 * @name useDeepEffect
 * @description - Hook that executes an effect only when dependencies change deeply
 * @category Lifecycle
 * @usage low
 *
 * @param {EffectCallback} effect The effect callback
 * @param {DependencyList} [deps] The dependencies list for the effect
 *
 * @warning - Use `useCustomCompareEffect` with your own comparator when the comparison rules do not fit
 *
 * @example
 * useDeepEffect(() => console.log("effect"), [user]);
 */
export const useDeepEffect = (effect, deps) => {
  useCustomCompareEffect(effect, deps, deepEqual);
};
