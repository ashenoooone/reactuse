import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useThrottleEffect } from './useThrottleEffect';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it('Should use throttle effect', () => {
  const effect = vi.fn();
  renderHook(() => useThrottleEffect(effect, 100, []));

  expect(effect).not.toHaveBeenCalled();
});

it('Should use throttle effect on server side', () => {
  const effect = vi.fn();
  renderHookServer(() => useThrottleEffect(effect, 100, []));

  expect(effect).not.toHaveBeenCalled();
});

it('Should throttle effect execution', () => {
  const effect = vi.fn();

  const { rerender } = renderHook((value) => useThrottleEffect(effect, 100, [value]), {
    initialProps: 'initial value'
  });

  expect(effect).not.toHaveBeenCalled();

  rerender('new value');
  expect(effect).toHaveBeenCalledOnce();

  act(() => vi.advanceTimersByTime(200));

  expect(effect).toHaveBeenCalledTimes(2);
});

it('Should skip effect when deps change within the throttle window', () => {
  const effect = vi.fn();

  const { rerender } = renderHook((value) => useThrottleEffect(effect, 100, [value]), {
    initialProps: 'initial value'
  });

  expect(effect).not.toHaveBeenCalled();

  rerender('second value');
  expect(effect).toHaveBeenCalledOnce();

  rerender('third value');
  expect(effect).toHaveBeenCalledOnce();

  act(() => vi.advanceTimersByTime(100));
  expect(effect).toHaveBeenCalledOnce();

  act(() => vi.advanceTimersByTime(100));
  expect(effect).toHaveBeenCalledTimes(2);
});

it('Should run the effect again after the throttle window on a later change', () => {
  const effect = vi.fn();

  const { rerender } = renderHook((value) => useThrottleEffect(effect, 100, [value]), {
    initialProps: 'initial value'
  });

  rerender('second value');
  expect(effect).toHaveBeenCalledOnce();

  act(() => vi.advanceTimersByTime(100));

  rerender('third value');
  expect(effect).toHaveBeenCalledTimes(2);
});

it('Should cancel the pending trailing effect on unmount', () => {
  const effect = vi.fn();

  const { rerender, unmount } = renderHook((value) => useThrottleEffect(effect, 100, [value]), {
    initialProps: 'initial value'
  });

  rerender('second value');
  expect(effect).toHaveBeenCalledOnce();

  act(() => vi.advanceTimersByTime(100));

  unmount();

  act(() => vi.advanceTimersByTime(100));
  expect(effect).toHaveBeenCalledOnce();
});

it('Should cleanup on unmount', () => {
  const cleanup = vi.fn();
  const effect = vi.fn(() => cleanup);

  const { unmount, rerender } = renderHook((value) => useThrottleEffect(effect, 100, [value]), {
    initialProps: 'initial value'
  });

  expect(effect).not.toHaveBeenCalled();

  rerender('new value');

  unmount();

  expect(cleanup).toHaveBeenCalledOnce();
});
