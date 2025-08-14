import { describe, expect, test, vi } from "vitest";
import { memoizePureFunction } from "../src/memoize-pure-function";

describe("memoizePureFunction", () => {
	test("should memoize function calls with same arguments", () => {
		const mockFn = vi.fn((x: number, y: number) => x + y);
		const memoized = memoizePureFunction(mockFn);

		const result1 = memoized(1, 2);
		const result2 = memoized(1, 2);

		expect(result1).toBe(3);
		expect(result2).toBe(3);
		expect(mockFn).toHaveBeenCalledTimes(1);
	});

	test("should call function multiple times for different arguments", () => {
		const mockFn = vi.fn((x: number, y: number) => x + y);
		const memoized = memoizePureFunction(mockFn);

		const result1 = memoized(1, 2);
		const result2 = memoized(3, 4);
		const result3 = memoized(1, 2);

		expect(result1).toBe(3);
		expect(result2).toBe(7);
		expect(result3).toBe(3);
		expect(mockFn).toHaveBeenCalledTimes(2);
	});

	test("should handle functions with no arguments", () => {
		const mockFn = vi.fn(() => Math.random());
		const memoized = memoizePureFunction(mockFn);

		const result1 = memoized();
		const result2 = memoized();

		expect(result1).toBe(result2);
		expect(mockFn).toHaveBeenCalledTimes(1);
	});

	test("should handle functions with single argument", () => {
		const mockFn = vi.fn((x: number) => x * 2);
		const memoized = memoizePureFunction(mockFn);

		const result1 = memoized(5);
		const result2 = memoized(5);
		const result3 = memoized(10);

		expect(result1).toBe(10);
		expect(result2).toBe(10);
		expect(result3).toBe(20);
		expect(mockFn).toHaveBeenCalledTimes(2);
	});

	test("should handle different types of arguments", () => {
		const mockFn = vi.fn(
			(str: string, num: number, bool: boolean) => `${str}-${num}-${bool}`,
		);
		const memoized = memoizePureFunction(mockFn);

		const result1 = memoized("test", 42, true);
		const result2 = memoized("test", 42, true);
		const result3 = memoized("test", 42, false);

		expect(result1).toBe("test-42-true");
		expect(result2).toBe("test-42-true");
		expect(result3).toBe("test-42-false");
		expect(mockFn).toHaveBeenCalledTimes(2);
	});

	test("should handle object arguments", () => {
		const obj1 = { a: 1 };
		const obj2 = { a: 1 };
		const mockFn = vi.fn((obj: { a: number }) => obj.a * 2);
		const memoized = memoizePureFunction(mockFn);

		const result1 = memoized(obj1);
		const result2 = memoized(obj1);
		const result3 = memoized(obj2);

		expect(result1).toBe(2);
		expect(result2).toBe(2);
		expect(result3).toBe(2);
		expect(mockFn).toHaveBeenCalledTimes(2);
	});

	test("should handle array arguments", () => {
		const arr1 = [1, 2, 3];
		const arr2 = [1, 2, 3];
		const mockFn = vi.fn((arr: number[]) => arr.reduce((sum, n) => sum + n, 0));
		const memoized = memoizePureFunction(mockFn);

		const result1 = memoized(arr1);
		const result2 = memoized(arr1);
		const result3 = memoized(arr2);

		expect(result1).toBe(6);
		expect(result2).toBe(6);
		expect(result3).toBe(6);
		expect(mockFn).toHaveBeenCalledTimes(2);
	});

	test("should handle null and undefined arguments", () => {
		const mockFn = vi.fn((a: any, b: any) => `${a}-${b}`);
		const memoized = memoizePureFunction(mockFn);

		const result1 = memoized(null, undefined);
		const result2 = memoized(null, undefined);
		const result3 = memoized(undefined, null);

		expect(result1).toBe("null-undefined");
		expect(result2).toBe("null-undefined");
		expect(result3).toBe("undefined-null");
		expect(mockFn).toHaveBeenCalledTimes(2);
	});

	test("should preserve function return types", () => {
		const stringFn = (x: number) => x.toString();
		const numberFn = (x: string) => Number.parseInt(x, 10);
		const booleanFn = (x: number) => x > 0;

		const memoizedString = memoizePureFunction(stringFn);
		const memoizedNumber = memoizePureFunction(numberFn);
		const memoizedBoolean = memoizePureFunction(booleanFn);

		const stringResult: string = memoizedString(42);
		const numberResult: number = memoizedNumber("123");
		const booleanResult: boolean = memoizedBoolean(5);

		expect(stringResult).toBe("42");
		expect(numberResult).toBe(123);
		expect(booleanResult).toBe(true);
	});

	test("should handle functions that throw errors", () => {
		const mockFn = vi.fn((shouldThrow: boolean) => {
			if (shouldThrow) throw new Error("Test error");
			return "success";
		});
		const memoized = memoizePureFunction(mockFn);

		expect(() => memoized(true)).toThrow("Test error");
		expect(() => memoized(true)).toThrow("Test error");
		expect(memoized(false)).toBe("success");
		expect(memoized(false)).toBe("success");
		expect(mockFn).toHaveBeenCalledTimes(3);
	});

	test("should work with functions that return undefined", () => {
		const mockFn = vi.fn(() => undefined);
		const memoized = memoizePureFunction(mockFn);

		const result1 = memoized();
		const result2 = memoized();

		expect(result1).toBeUndefined();
		expect(result2).toBeUndefined();
		expect(mockFn).toHaveBeenCalledTimes(1);
	});

	test("should work with functions that return null", () => {
		const mockFn = vi.fn(() => null);
		const memoized = memoizePureFunction(mockFn);

		const result1 = memoized();
		const result2 = memoized();

		expect(result1).toBeNull();
		expect(result2).toBeNull();
		expect(mockFn).toHaveBeenCalledTimes(1);
	});

	test("should handle many arguments", () => {
		const mockFn = vi.fn((...args: number[]) =>
			args.reduce((sum, n) => sum + n, 0),
		);
		const memoized = memoizePureFunction(mockFn);

		const result1 = memoized(1, 2, 3, 4, 5);
		const result2 = memoized(1, 2, 3, 4, 5);
		const result3 = memoized(1, 2, 3, 4, 6);

		expect(result1).toBe(15);
		expect(result2).toBe(15);
		expect(result3).toBe(16);
		expect(mockFn).toHaveBeenCalledTimes(2);
	});

	test("should handle argument order sensitivity", () => {
		const mockFn = vi.fn((a: number, b: number) => a - b);
		const memoized = memoizePureFunction(mockFn);

		const result1 = memoized(5, 3);
		const result2 = memoized(3, 5);
		const result3 = memoized(5, 3);

		expect(result1).toBe(2);
		expect(result2).toBe(-2);
		expect(result3).toBe(2);
		expect(mockFn).toHaveBeenCalledTimes(2);
	});
});
