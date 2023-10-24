import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driven.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  }


  let auditorysTest = await prisma.auditory.findFirst();
  if (!auditorysTest) {
    await prisma.auditory.createMany({
      data: [
        {
          name: 'Auditório Principal',
        },
        {
          name: 'Auditório Lateral',
        },
        {
          name: 'Sala de Workshop',
        }
      ],
    });
  }

  let activitiesTest = await prisma.activities.findFirst();
  if (!activitiesTest) {
    await prisma.activities.createMany({
      data: [
        {
          name: 'Minecraft: montando o PC ideal',
          capacity: 27,
          startAt: dayjs().year(2023).month(10).day(25).hour(9).toDate(),
          endAt: dayjs().year(2023).month(10).day(25).hour(10).toDate(),
          auditoryId: 1,
        },
        {
          name: 'Minecraft: montando o PC ideal',
          capacity: 20,
          startAt: dayjs().year(2023).month(10).day(26).hour(9).toDate(),
          endAt: dayjs().year(2023).month(10).day(26).hour(10).toDate(),
          auditoryId: 2,
        },
        {
          name: 'Minecraft: montando o PC ideal',
          capacity: 15,
          startAt: dayjs().year(2023).month(10).day(27).hour(9).toDate(),
          endAt: dayjs().year(2023).month(10).day(27).hour(10).toDate(),
          auditoryId: 3,
        },

        {
          name: 'Minecraft: montando o PC ideal',
          capacity: 10,
          startAt: dayjs().year(2023).month(10).day(28).hour(9).toDate(),
          endAt: dayjs().year(2023).month(10).day(28).hour(10).toDate(),
          auditoryId: 1,
        }
      ],
    });
  }

  console.log({ event });

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
