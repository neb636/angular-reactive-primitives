import { computed, inject, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

export const useQueryParameters = <T extends { [key: string]: undefined | string }>() => {
  const route = inject(ActivatedRoute);
  const paramMapSignal = toSignal(route.queryParamMap, { initialValue: route.snapshot.queryParamMap });

  return computed(() => paramMapSignal().keys.reduce((params, key) => ({ ...params, [key]: paramMapSignal().get(key) }), {} as T));
};

export const useQueryParameter = <T extends undefined | string>(paramName: string) => {
  const queryParameters = useQueryParameters();

  return computed(() => queryParameters()[paramName] as T);
};