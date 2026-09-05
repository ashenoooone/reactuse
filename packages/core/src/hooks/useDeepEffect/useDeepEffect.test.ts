import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useDeepEffect } from './useDeepEffect';

it('Should use deep effect', () => {
  const effect = vi.fn();

  renderHook(() => useDeepEffect(effect, []));

  expect(effect).toHaveBeenCalledOnce();
});

it('Should use deep effect on server side', () => {
  const effect = vi.fn();

  renderHookServer(() => useDeepEffect(effect, []));

  expect(effect).not.toHaveBeenCalled();
});

it('Should not run effect when deps are deep equal', () => {
  const effect = vi.fn();
  let object = { a: 'a', b: { c: 'c' } };

  const { rerender } = renderHook(() => useDeepEffect(effect, [object]));

  expect(effect).toHaveBeenCalledOnce();

  act(() => {
    object = { a: 'a', b: { c: 'c' } };
    rerender();
  });

  expect(effect).toHaveBeenCalledOnce();
});

it('Should run effect when nested deps change', () => {
  const effect = vi.fn();
  let object = { a: 'a', b: { c: 'c' } };

  const { rerender } = renderHook(() => useDeepEffect(effect, [object]));

  expect(effect).toHaveBeenCalledOnce();

  act(() => {
    object = { a: 'a', b: { c: 'd' } };
    rerender();
  });

  expect(effect).toBeCalledTimes(2);
});
