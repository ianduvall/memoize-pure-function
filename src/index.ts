import { AnyKeyWeakMap } from "./any-key-weak-map";

const UNCACHED = 1;
const CACHED = 2;

interface BaseCacheNode<T> {
	cache: AnyKeyWeakMap<any, CacheNode<T>>;
}
interface UncachedNode<T = any> extends BaseCacheNode<T> {
	status: typeof UNCACHED;
	result: void;
}
interface CachedNode<T = any> extends BaseCacheNode<T> {
	status: typeof CACHED;
	result: T;
}
type CacheNode<T = any> = CachedNode<T> | UncachedNode<T>;

type AnyFunction = (...args: any[]) => any;

let globalCache = new WeakMap<AnyFunction, CacheNode>();

export const clearCache = (fn: AnyFunction): boolean => {
	return globalCache.delete(fn);
};

export const clearGlobalCache = (): void => {
	globalCache = new WeakMap();
};

/**
 * https://github.com/tc39/proposal-upsert
 */
const getOrInsert = <TItem>(
	cache: {
		get: (item: TItem) => CacheNode | undefined;
		set: (item: TItem, node: CacheNode) => void;
	},
	item: TItem,
): CacheNode => {
	let cacheNode = cache.get(item);
	if (!cacheNode) {
		cacheNode = {
			status: UNCACHED,
			result: undefined,
			cache: new AnyKeyWeakMap<any, CacheNode>(),
		} as const satisfies UncachedNode;
		cache.set(item, cacheNode);
	}
	return cacheNode;
};

export const memoizePureFunction = <Fn extends AnyFunction>(fn: Fn): Fn => {
	const memoizedPureFunction: AnyFunction = (...args) => {
		let cacheNode = getOrInsert(globalCache, fn);
		for (const arg of args) {
			cacheNode = getOrInsert(cacheNode.cache, arg);
		}

		if (cacheNode.status === UNCACHED) {
			cacheNode.result = fn(...args);
			(cacheNode as unknown as CachedNode).status = CACHED;
		}

		return cacheNode.result;
	};

	return memoizedPureFunction as unknown as Fn;
};
