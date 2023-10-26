import { notFoundError } from "@/errors";
import { badRequestError } from "@/errors/bad-request-error";
import { activitiesRepository } from "@/repositories/activities-repository";
import dayjs from "dayjs";


async function getActivities() {
  const activities = await activitiesRepository.getAllActivities();
  if (!activities) {
    throw notFoundError();
  }
  return activities;
}

async function getActivitiesByDate(date: string) {
  const activities = await activitiesRepository.getAllActivities();
  if (!activities) {
    throw notFoundError();
  }

  function isDateInFormat(dateString: string) {
    const date = dayjs(dateString);
    return date.format('YYYY-MM-DD') === dateString;
  }

  if (!isDateInFormat(date)) throw badRequestError();

  return activitiesRepository.getActivitiesByDate(date);
}

/* async function getActivitiesByPlace() {
  const activities = activitiesRepository.getActivitiesByPlace();
  if (!activities) throw notFoundError();
  console.log(activities)

  return activities;
} */


export const activitiesService = {
  getActivities,
  getActivitiesByDate
}