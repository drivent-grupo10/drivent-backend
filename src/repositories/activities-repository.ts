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
    },
  });
}

async function getActivitiesById(id: number) {
  return prisma.activities.findFirst({
    where: {
      id
    },
    include: {
      ActivitiesBook: true
    }
  });
};

async function getActivitiesByDateAndUser(start: Date, end: Date, userId: number) {
  const activity = await prisma.activitiesBook.findFirst({
    where: {
      userId,
      Activities: {
        startAt: {
          lte: end,
        },
        endAt: {
          gte: start,
        }
      },
    },
  });

  if (activity) {
    return activity;
  } else {
    return null;
  }
}


async function bookActivitie(userId: number, actId: number) {
    await prisma.activitiesBook.create({
      data:{
        userId,
        activitieId: actId
      }
    })
}


export const activitiesRepository = {
  getAllActivities,
  getActivitiesByDate,
  getActivitiesById,
  getActivitiesByDateAndUser,
  bookActivitie
};