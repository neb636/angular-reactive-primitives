import { computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

export const useParameters = <T extends { [key: string]: undefined | string }>() => {
  const route = inject(ActivatedRoute);
  const paramMapSignal = toSignal(route.paramMap, { initialValue: route.snapshot.paramMap });

  return computed(() =>
    paramMapSignal().keys.reduce(
      (params, key) => ({ ...params, [key]: paramMapSignal().get(key) }),
      {} as T,
    ),
  );
};

export const useParameter = <T extends undefined | string>(paramName: string) => {
  const parameters = useParameters();

  return computed(() => parameters()[paramName] as T);
};
