import { prisma } from "@/config";

async function getAllActivities() {
    return prisma.activities.findMany({
        include: {
            Auditory: true,
        },
    });
}


async function getActivitiesByDate(date: string) {
    return await prisma.activities.findMany({
      where: {
        startAt: {
          gte: new Date(date),
          lt: new Date(new Date(date).getTime() + 86400000),
        },
      },
      include: {
        Auditory: true,
      },
    });
  }

  export const activitiesRepository = {
    getAllActivities,
    getActivitiesByDate
  };