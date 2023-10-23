import { Event } from '@prisma/client';
import dayjs from 'dayjs';
import { notFoundError } from '@/errors';
import { DEFAULT_EXP } from '@/config';
import redis from '@/config/redis';
import { eventRepository } from '@/repositories';
import { exclude } from '@/utils/prisma-utils';

async function getFirstEvent(): Promise<GetFirstEventResult> {
 // const event = await eventRepository.findFirst();
 // if (!event) throw notFoundError();

 // return exclude(event, 'createdAt', 'updatedAt');
 const cacheKey = 'event';
 const cachedEvent = await redis.get(cacheKey);
 if (cachedEvent) {
   return JSON.parse(cachedEvent);
 } else {
   const event = await eventRepository.findFirst();
   if (!event) throw notFoundError();
   const eventFirst = exclude(event, 'createdAt', 'updatedAt');
   redis.setEx(cacheKey, DEFAULT_EXP, JSON.stringify(eventFirst));
   return eventFirst;
 }

}


export type GetFirstEventResult = Omit<Event, 'createdAt' | 'updatedAt'>;



async function isCurrentEventActive(): Promise<boolean> {
  //const event = await eventRepository.findFirst();
  //if (!event) return false;
  const cacheKey = 'event';
  const cachedEvent = await redis.get(cacheKey);

  if (cachedEvent) {
    const event = JSON.parse(cachedEvent);
    return startAndEndDate(event);
  } else {
    const event = await eventRepository.findFirst();
    if (!event) return false;

    const eventActive = exclude(event, 'createdAt', 'updatedAt');
    redis.setEx(cacheKey, DEFAULT_EXP, JSON.stringify(eventActive));
    return startAndEndDate(event);
  }
}

function startAndEndDate(event: Event) {
  const now = dayjs();
  const eventStartsAt = dayjs(event.startsAt);
  const eventEndsAt = dayjs(event.endsAt);
  return now.isAfter(eventStartsAt) && now.isBefore(eventEndsAt);
}

export const eventsService = {
  getFirstEvent,
  isCurrentEventActive,
};
