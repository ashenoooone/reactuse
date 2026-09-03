import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useBoolean } from './useBoolean';

it('Should use boolean', () => {
  const { result } = renderHook(useBoolean);
  const [value, toggle] = result.current;

  expect(value).toBeFalsy();
  expect(toggle).toBeTypeOf('function');
});

it('Should use boolean on server side', () => {
  const { result } = renderHookServer(useBoolean);
  const [value, toggle] = result.current;

  expect(value).toBeFalsy();
  expect(toggle).toBeTypeOf('function');
});

it('Should set initial value', () => {
  const { result } = renderHook(() => useBoolean(true));

  expect(result.current[0]).toBeTruthy();
});

it('Should toggle boolean', () => {
  const { result } = renderHook(useBoolean);
  const [, toggle] = result.current;

  act(toggle);
  expect(result.current[0]).toBeTruthy();

  act(toggle);
  expect(result.current[0]).toBeFalsy();
});

it('Should set boolean value', () => {
  const { result } = renderHook(useBoolean);
  const [, toggle] = result.current;

  act(() => toggle(true));
  expect(result.current[0]).toBeTruthy();

  act(() => toggle(false));
  expect(result.current[0]).toBeFalsy();
});
