import { createClient } from "redis";

export const DEFAULT_EXP = 30; // seconds

const redis = createClient({
  url: process.env.REDIS_URL
});


export async function redisConnection() {
    console.log("connecting redis...");
    await redis.on('err', (err) => console.log('error', err)).connect();
  }

export default redis;