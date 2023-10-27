import { bookActivitie, getActivities, getActivitiesByDate } from "@/controllers/activities-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const activitiesRouter = Router();

activitiesRouter
    .all('/*', authenticateToken)
    .get('/', getActivities)
    .post('/:actId', bookActivitie)
    .get('/:date', getActivitiesByDate);


export { activitiesRouter };
