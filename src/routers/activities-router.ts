import { getActivities, getActivitiesByDate } from "@/controllers/activities-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const activitiesRouter = Router();

activitiesRouter
    .all('/*', authenticateToken)
    .get('/', getActivities)
    .get('/:date', getActivitiesByDate);

export { activitiesRouter };
