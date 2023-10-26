import { AuthenticatedRequest } from "@/middlewares";
import { activitiesService } from "@/services/activities-service";
import { NextFunction, Response } from "express";
import httpStatus from "http-status";


export async function getActivities(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const activities = await activitiesService.getActivities();
    console.log(activities)
    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    next(error);
  }
}

export async function getActivitiesByDate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { date } = req.params;
  try {
    const activities = await activitiesService.getActivitiesByDate(date);
    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    next(error);
  }
}

/* export async function getActivitiesByPlace(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const activities = await activitiesService.getActivitiesByPlace();
    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    next(error);
  }
} */