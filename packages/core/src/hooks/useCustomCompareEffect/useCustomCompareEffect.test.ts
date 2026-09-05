import type { DependencyList } from 'react';

import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useCustomCompareEffect } from './useCustomCompareEffect';

const equal = (deps: DependencyList, prevDeps: DependencyList) =>
  deps.length === prevDeps.length && deps.every((dep, index) => Object.is(dep, prevDeps[index]));

it('Should use custom compare effect', () => {
  const effect = vi.fn();

  renderHook(() => useCustomCompareEffect(effect, [{ id: 1 }], equal));

  expect(effect).toHaveBeenCalledOnce();
});

it('Should use custom compare effect on server side', () => {
  const effect = vi.fn();

  renderHookServer(() => useCustomCompareEffect(effect, [{ id: 1 }], equal));

  expect(effect).not.toHaveBeenCalled();
});

it('Should not run effect when comparator returns true', () => {
  const effect = vi.fn();

  const { rerender } = renderHook(() => useCustomCompareEffect(effect, [{ id: 1 }], () => true));

  expect(effect).toHaveBeenCalledOnce();

  act(rerender);

  expect(effect).toHaveBeenCalledOnce();
});

it('Should cleanup and rerun effect when comparator returns false', () => {
  const cleanup = vi.fn();
  const effect = vi.fn(() => cleanup);

  const { rerender } = renderHook(() => useCustomCompareEffect(effect, [{ id: 1 }], () => false));

  expect(effect).toHaveBeenCalledOnce();
  expect(cleanup).not.toHaveBeenCalled();

  act(rerender);

  expect(cleanup).toHaveBeenCalledOnce();
  expect(effect).toHaveBeenCalledTimes(2);
});

it('Should pass deps and prev deps to comparator in order', () => {
  const comparator = vi.fn(() => true);
  const first = { id: 1 };
  const second = { id: 2 };
  let deps = [first];

  const { rerender } = renderHook(() => useCustomCompareEffect(vi.fn(), deps, comparator));

  expect(comparator).not.toHaveBeenCalled();

  act(() => {
    deps = [second];
    rerender();
  });

  expect(comparator).toHaveBeenCalledExactlyOnceWith([second], [first]);
});

it('Should allow deps length to change between renders', () => {
  const effect = vi.fn();
  let deps: unknown[] = [{ id: 1 }];

  const { rerender } = renderHook(() => useCustomCompareEffect(effect, deps, equal));

  act(() => {
    deps = [{ id: 1 }, { id: 2 }];
    rerender();
  });

  expect(effect).toHaveBeenCalledTimes(2);
});

it('Should run cleanup on unmount', () => {
  const cleanup = vi.fn();

  const { unmount } = renderHook(() => useCustomCompareEffect(() => cleanup, [{ id: 1 }], equal));

  expect(cleanup).not.toHaveBeenCalled();

  unmount();

  expect(cleanup).toHaveBeenCalledOnce();
});

it('Should run effect on every render when deps are not passed', () => {
  const effect = vi.fn();

  const { rerender } = renderHook(() => useCustomCompareEffect(effect, undefined, equal));

  expect(effect).toHaveBeenCalledOnce();

  act(rerender);

  expect(effect).toHaveBeenCalledTimes(2);
});
