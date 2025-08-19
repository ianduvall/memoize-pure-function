# memoize-pure-function [![npm](https://img.shields.io/npm/v/memoize-pure-function.svg)](https://npmjs.com/package/memoize-pure-function)

[![CI](https://github.com/ianduvall/memoize-pure-function/actions/workflows/ci.yml/badge.svg)](https://github.com/ianduvall/memoize-pure-function/actions/workflows/ci.yml)

A TypeScript library for memoizing pure functions with infinite cache size and automatic memory management.

## Install

```bash
pnpm add memoize-pure-function
```

## Important Notes

- **Pure Functions Only**: This library is designed for pure functions (i.e. functions that always return the same output given the same input and have no side effects)
- **Reference Equality**: Non-primitive values are compared by reference
- **Memory Management**: Uses WeakMap internally to allow garbage collection of unused cache entries

## Usage Examples

### React Hooks

Alternative to React's `useMemo` hook, `memoizePureFunction` can be used to share memoization across usages of a hook. This is useful for hooks that need to do some expensive computation but need to be called in many places.

```ts
const calculateSomethingExpensive = memoizePureFunction(
	function expensiveComputation(user) {},
);
const useExpensiveUserProperty = () => {
	const user = useUser();

	return calculateSomethingExpensive(user);
};
```

This can be more ergonomic than alternative solutions to this problem, like hoisting into a context provider, because it maintains the lazy, pull-based sematics of `useMemo`.

## Type Safety

The memoized function preserves the exact type signature of the original function:

```ts
const stringFunction = (x: number): string => x.toString();
const numberFunction = (x: string): number => Number.parseInt(x, 10);
const booleanFunction = (x: number): boolean => x > 0;

const memoizedString = memoizePureFunction(stringFunction);
const memoizedNumber = memoizePureFunction(numberFunction);
const memoizedBoolean = memoizePureFunction(booleanFunction);

// TypeScript will enforce correct types
const str: string = memoizedString(42); // ✅
const num: number = memoizedNumber("123"); // ✅
const bool: boolean = memoizedBoolean(5); // ✅
```

## License

[MIT](./LICENSE) License © 2025 [Ian Duvall](https://github.com/ianduvall)
