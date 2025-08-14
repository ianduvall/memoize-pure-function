# memoize-pure-function [![npm](https://img.shields.io/npm/v/memoize-pure-function.svg)](https://npmjs.com/package/memoize-pure-function)

[![CI](https://github.com/ianduvall/memoize-pure-function/actions/workflows/ci.yml/badge.svg)](https://github.com/ianduvall/memoize-pure-function/actions/workflows/ci.yml)

A TypeScript library for memoizing pure functions with infinite cache size and automatic memory management.

## Install

```bash
pnpm add memoize-pure-function
```

## How It Works

The memoization implementation:

- Uses weak references to prevent memory leaks
- Supports any number of arguments of any type
- Preserves exact function signatures and return types
- Uses argument identity (reference equality) for non-primitive values
- Handles `null`, `undefined`, and other primitive values correctly

## Important Notes

- **Pure Functions Only**: This library is designed for pure functions (functions that always return the same output for the same input and have no side effects)
- **Reference Equality**: Non-primitive values are compared by reference
- **Memory Management**: Uses WeakMap internally to allow garbage collection of unused cache entries

## Usage Examples

### Functions with Object Arguments

```ts
interface User {
	id: number;
	name: string;
}

const getUserData = (user: User) => ({
	...user,
	displayName: user.name.toUpperCase(),
});

const memoizedGetUserData = memoizePureFunction(getUserData);

const user1 = { id: 1, name: "Alice" };
const user2 = { id: 1, name: "Alice" };

memoizedGetUserData(user1); // Calculated
memoizedGetUserData(user1); // Cached (same object reference)
memoizedGetUserData(user2); // Calculated (different object reference)
```

### Functions with Array Arguments

```ts
const sumArray = (numbers: number[]) => numbers.reduce((sum, n) => sum + n, 0);

const memoizedSum = memoizePureFunction(sumArray);

const arr1 = [1, 2, 3];
const arr2 = [1, 2, 3];

memoizedSum(arr1); // Calculated
memoizedSum(arr1); // Cached (same array reference)
memoizedSum(arr2); // Calculated (different array reference)
```

### Functions with Many Arguments

```ts
const calculateScore = (...factors: number[]) =>
	factors.reduce((product, factor) => product * factor, 1);

const memoizedCalculateScore = memoizePureFunction(calculateScore);

memoizedCalculateScore(1, 2, 3, 4, 5); // Calculated
memoizedCalculateScore(1, 2, 3, 4, 5); // Cached
```

### Type Safety

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
