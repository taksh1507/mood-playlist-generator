import redis from 'redis';

let redisClient = null;
let useInMemoryCache = false;
let inMemoryCache = new Map();
let redisErrorLogged = false;

export const initializeCache = async () => {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    redisClient = redis.createClient({ 
      url: redisUrl,
      socket: { reconnectStrategy: false }
    });

    redisClient.on('error', (err) => {
      if (!redisErrorLogged) {
        console.warn('⚠ Redis unavailable, using in-memory cache (60s TTL)');
        redisErrorLogged = true;
      }
      useInMemoryCache = true;
      redisClient = null;
    });

    const connectPromise = redisClient.connect();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Redis connection timeout')), 3000)
    );

    await Promise.race([connectPromise, timeoutPromise]);
  } catch (err) {
    console.warn('⚠ Redis unavailable, using in-memory cache (60s TTL)');
    useInMemoryCache = true;
    redisClient = null;
  }
};

export const getFromCache = async (key) => {
  try {
    if (redisClient) {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } else if (useInMemoryCache) {
      const cached = inMemoryCache.get(key);
      if (cached && cached.expireAt > Date.now()) {
        return cached.value;
      } else if (cached) {
        inMemoryCache.delete(key);
      }
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const setInCache = async (key, value, ttlSeconds = 60) => {
  try {
    if (redisClient) {
      await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
    } else if (useInMemoryCache) {
      inMemoryCache.set(key, {
        value,
        expireAt: Date.now() + ttlSeconds * 1000,
      });
    }
  } catch (error) {
    return;
  }
};

export const clearCache = async (key) => {
  try {
    if (redisClient) {
      await redisClient.del(key);
    } else if (useInMemoryCache) {
      inMemoryCache.delete(key);
    }
  } catch (error) {
    return;
  }
};

export const closeCache = async () => {
  if (redisClient) {
    await redisClient.quit();
  }
};
