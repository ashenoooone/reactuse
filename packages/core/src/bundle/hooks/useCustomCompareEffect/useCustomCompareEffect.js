import { useEffect, useRef } from 'react';
/**
 * @name useCustomCompareEffect
 * @description - Hook that triggers the effect callback when the comparator reports the dependencies as changed
 * @category Lifecycle
 * @usage low
 *
 * @param {EffectCallback} effect The effect callback
 * @param {DependencyList} deps The dependencies list for the effect
 * @param {(deps: DependencyList, prevDeps: DependencyList) => boolean} comparator The function that returns `true` when the dependencies are equal
 *
 * @example
 * useCustomCompareEffect(() => console.log("effect"), [user], ([user], [prevUser]) => user.id === prevUser.id);
 */
export const useCustomCompareEffect = (effect, deps, comparator) => {
  const depsRef = useRef(undefined);
  const signalRef = useRef(0);
  if (!deps || !depsRef.current || !comparator(deps, depsRef.current)) signalRef.current += 1;
  depsRef.current = deps;
  useEffect(effect, [signalRef.current]);
};
