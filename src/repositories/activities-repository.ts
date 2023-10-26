import { prisma } from "@/config";

async function getAllActivities() {
  return prisma.$queryRaw`
    SELECT DATE_TRUNC('day', "startAt") AS date_trunc 
    FROM "Activities" 
    GROUP BY date_trunc 
    ORDER BY date_trunc`;
}


async function getActivitiesByDate(date: string) {
  return prisma.auditory.findMany({
    include: {
      Activities: {
        where: {
          startAt: {
            gte: new Date(date),
            lt: new Date(new Date(date).getTime() + 86400000)
          }
        }
      }
    }
  });
}

export const activitiesRepository = {
  getAllActivities,
  getActivitiesByDate
};