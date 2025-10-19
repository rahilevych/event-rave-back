import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function saveCategoriesToBd() {
  const categories = [
    {
      name: 'Music',
      imageUrl:
        'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470',
    },
    {
      name: 'Tech',
      imageUrl:
        'https://plus.unsplash.com/premium_photo-1682125090365-58de6dbf8143?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470',
    },
    {
      name: 'Art & Culture',
      imageUrl:
        'https://images.unsplash.com/photo-1648960332493-fe99a0626f9b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=711',
    },
    {
      name: 'Education',
      imageUrl:
        'https://plus.unsplash.com/premium_photo-1661486750841-c02a9d22a1a6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470',
    },
    {
      name: 'Sports',
      imageUrl:
        'https://images.unsplash.com/photo-1480180566821-a7d525cdfc5e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
    },
    {
      name: 'Food & Drink',
      imageUrl:
        'https://plus.unsplash.com/premium_photo-1754341357839-a11120163778?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470',
    },
    {
      name: 'Festivals & Parties',
      imageUrl:
        'https://images.unsplash.com/photo-1631901589746-219fcffbdd29?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470',
    },
    {
      name: 'Outdoor & Nature',
      imageUrl:
        'https://plus.unsplash.com/premium_photo-1661322843882-b423227eb4d8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470',
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }
}

saveCategoriesToBd()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
