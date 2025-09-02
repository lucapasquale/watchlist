import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  public async useCachedCall<T>(
    cacheKey: string,
    fetchResource: () => Promise<T | null>,
    ttl = 3_600,
  ): Promise<T | null> {
    const cached = await this.cacheManager.get<T>(cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    const result = await fetchResource();
    await this.cacheManager.set(cacheKey, result, ttl);

    return result;
  }
}
