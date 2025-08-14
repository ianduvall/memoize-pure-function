import { AnyKeyWeakMap } from "./any-key-weak-map";

const UNCACHED = 0;
const CACHED = 1;

interface BaseCacheNode<T> {
	map: AnyKeyWeakMap<any, CacheNode<T>>;
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

export const memoizePureFunction = <Fn extends (...args: any[]) => any>(
	fn: Fn,
): Fn => {
	const rootCacheNode = {
		status: UNCACHED,
		result: undefined,
		map: new AnyKeyWeakMap<any, CacheNode>(),
	} as const satisfies UncachedNode;
	const memoizedPureFunction = (...args: any[]): any => {
		let cacheNode: CacheNode = rootCacheNode;

		for (const arg of args) {
			let nextCacheNode: CacheNode | undefined = cacheNode.map.get(arg);
			if (!nextCacheNode) {
				nextCacheNode = {
					status: UNCACHED,
					result: undefined,
					map: new AnyKeyWeakMap<any, CacheNode>(),
				} satisfies UncachedNode;
				cacheNode.map.set(arg, nextCacheNode);
			}
			cacheNode = nextCacheNode;
		}

		if (cacheNode.status === CACHED) {
			return cacheNode.result;
		}

		cacheNode.result = fn(...args);
		(cacheNode as unknown as CachedNode).status = CACHED;

		return cacheNode.result;
	};

	return memoizedPureFunction as unknown as Fn;
};
