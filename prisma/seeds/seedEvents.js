import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedEvents() {
  const cities = [
    'Berlin',
    'Munich',
    'Hamburg',
    'Cologne',
    'Dresden',
    'Leipzig',
    'Frankfurt',
    'Stuttgart',
  ];
  const venues = [
    'Arena',
    'Conference Hall',
    'Art Gallery',
    'City Park',
    'Music Club',
    'Expo Center',
    'Auditorium',
    'Stadium',
  ];

  const organizers = [
    'NextGen Events',
    'ArtVision Team',
    'LiveFest Co',
    'Foodies United',
    'Startup Hub',
    'Community Connect',
    'Culture Pulse',
    'Outdoor Adventures',
    'Wellness Group',
    'Festival Makers',
  ];

  const categoryData = {
    Music: {
      titles: [
        'Jazz Night Live',
        'Summer Beats Festival',
        'Rock & Roll Evening',
        'Acoustic Sessions',
        'Electronic Vibes',
        'Symphony Under Stars',
        'Indie Music Jam',
        'Pop Legends Concert',
        'Classical Harmony Night',
        'Retro Vinyl Party',
        'Urban Groove Session',
        'Chillout Lounge Evening',
        'Live Band Showcase',
        'Festival of Sound',
        'Night of Jazz & Blues',
      ],
      images: [
        'https://i.pinimg.com/1200x/0b/c4/12/0bc412c5af40c081f283c80fc0048918.jpg',
        'https://i.pinimg.com/736x/40/f1/d6/40f1d6550cf080b226b01b38cfa7af15.jpg',
        'https://i.pinimg.com/1200x/b0/4a/3d/b04a3dfd7b388c9b298adf8ce512dba8.jpg',
        'https://i.pinimg.com/736x/10/76/e3/1076e3f2d40c35afb835079897655653.jpg',
        'https://i.pinimg.com/736x/cd/2c/bf/cd2cbfe88254378f16db2f63920f33d5.jpg',
      ],
    },
    Tech: {
      titles: [
        'AI Innovations 2025',
        'Web3 Meetup',
        'Tech Future Summit',
        'Startup Pitch Night',
        'Cybersecurity Workshop',
        'Cloud Computing Forum',
        'Robotics Expo',
        'IoT & Smart Devices',
        'Programming Hackathon',
        'Mobile Tech Trends',
        'Blockchain Masterclass',
        'Data Science Conference',
        'Virtual Reality Expo',
        'Emerging Tech Talks',
        'Coding Bootcamp Intensive',
      ],
      images: [
        'https://i.pinimg.com/736x/91/67/68/916768d7ef1a26f4666e3ec81e28d807.jpgf475',
        'https://i.pinimg.com/736x/4a/16/37/4a163712d2e5a03d6c750c82a42a778d.jpg',
        'https://i.pinimg.com/1200x/fc/70/62/fc70624d9923a7fcff67fcd0e7298c0f.jpg',
        'https://i.pinimg.com/736x/2c/fe/c9/2cfec9d06c673db171f73095207b8f8d.jpg',
        'https://i.pinimg.com/736x/33/0d/e6/330de6e84674a0650780d54876197b9b.jpg',
      ],
    },
    'Art & Culture': {
      titles: [
        'Modern Art Exhibition',
        'Culture Vibes',
        'Photography Workshop',
        'Sculpture Showcase',
        'Theatre Night',
        'Street Art Tour',
        'Creative Writing Meetup',
        'Film Screening Evening',
        'Cultural Exchange Festival',
        'Classical Art Gala',
        'Contemporary Dance Show',
        'Museum After Dark',
        'Visual Arts Workshop',
        'Art Collector Night',
        'Poetry & Music Evening',
      ],
      images: [
        'https://i.pinimg.com/736x/0a/12/de/0a12de392f4dce90c46a02e64985b2ab.jpg',
        'https://i.pinimg.com/1200x/50/c4/48/50c44836db0d351ec9097936897f5a0d.jpg',
        'https://i.pinimg.com/1200x/39/37/2a/39372a76ef53395ccc7800c524d08619.jpg',
        'https://i.pinimg.com/736x/b0/e3/72/b0e372ba4f0ca36250eb8130951c7659.jpg',
        'https://i.pinimg.com/736x/29/9a/48/299a48260328c73bf94f671c29e05b94.jpg',
      ],
    },
    Education: {
      titles: [
        'Coding Bootcamp',
        'Language Learning Workshop',
        'History Lecture',
        'Science Expo',
        'Math Challenge',
        'Creative Writing Class',
        'Career Development Seminar',
        'Environmental Awareness Talk',
        'Public Speaking Workshop',
        'Study Abroad Fair',
        'Robotics for Kids',
        'University Open Day',
        'Learning Tech Expo',
        'Educational Games Night',
        'Research Symposium',
      ],
      images: [
        'https://i.pinimg.com/1200x/83/df/1d/83df1d516c0fba80261c19350c2e5a5a.jpg',
        'https://i.pinimg.com/736x/72/1b/93/721b933842f9dfce93caa3fe30f1f784.jpg',
        'https://i.pinimg.com/736x/48/29/a7/4829a72d9aa4970910bcdff0513ab626.jpg',
        'https://i.pinimg.com/1200x/18/84/03/188403addb1f7f343fab8d949388706c.jpg',
        'https://i.pinimg.com/1200x/7b/65/b2/7b65b2f2524a8abb7af815a94b7ef1e8.jpg',
      ],
    },
    Sports: {
      titles: [
        'Marathon Challenge',
        'City Football Cup',
        'Yoga in the Park',
        'Basketball Tournament',
        'Cycling Tour',
        'Swimming Championship',
        'Volleyball League',
        'Tennis Open',
        'Fitness Bootcamp',
        'Rock Climbing Adventure',
        'Skateboarding Jam',
        'Winter Sports Festival',
        'Orienteering Race',
        'Martial Arts Showcase',
        'Ultimate Frisbee Game',
      ],
      images: [
        'https://i.pinimg.com/736x/fd/9f/97/fd9f97835846c922d76cec46fa851145.jpg',
        'https://i.pinimg.com/736x/96/1f/e6/961fe6b284e2fc92db9a600497a7e126.jpg',
        'https://i.pinimg.com/1200x/2e/59/a3/2e59a35704e75d6bdf6d1d05a15ff4da.jpg',
        'https://i.pinimg.com/736x/d0/3f/d9/d03fd9c1251d79dc6aabe340cae9bedd.jpg',
        'https://i.pinimg.com/1200x/dc/ee/67/dcee672f0dcf5bc1073866082548528c.jpg',
      ],
    },
    'Food & Drink': {
      titles: [
        'Gourmet Tasting',
        'Street Food Festival',
        'Wine & Cheese Night',
        'Brewery Tour',
        'Cooking Masterclass',
        'Vegan Fair',
        'Chocolate Lovers Meetup',
        'Cocktail Evening',
        'Farmers Market Day',
        'International Food Expo',
        'Cheese & Wine Pairing',
        'BBQ Competition',
        'Dessert Festival',
        'Coffee Tasting Event',
        'Culinary Workshop',
      ],
      images: [
        'https://i.pinimg.com/736x/8c/1d/10/8c1d105eef374e55231c24cab9447ce6.jpg',
        'https://i.pinimg.com/736x/03/c7/fb/03c7fb508754f8097aef0b044140c9d5.jpg',
        'https://i.pinimg.com/736x/52/2f/3e/522f3e5553e0c81d71298d00faf7718d.jpg',
        'https://i.pinimg.com/736x/e2/56/d7/e256d7d3fd3d8ababbc5755fbcebb9a1.jpg',
        'https://i.pinimg.com/736x/15/b0/31/15b031571f64e1c9e31800ba2a1029dc.jpg',
      ],
    },

    'Festivals & Parties': {
      titles: [
        'Summer Music Festival',
        'Halloween Bash',
        'New Year Gala',
        'Carnival Parade',
        'Open Air Party',
        'Spring Celebration',
        'Oktoberfest Gathering',
        'Beach Party Night',
        'Winter Wonderland Festival',
        'Costume Ball',
        'Street Festival',
        'Fireworks Night',
        'DJ Night Extravaganza',
        'Retro Party',
        'Cultural Carnival',
      ],
      images: [
        'https://i.pinimg.com/736x/55/1f/82/551f826369663a15c048292ea3023fc0.jpg',
        'https://i.pinimg.com/736x/d3/45/3f/d3453fc33bdeaa5894470525fdf00643.jpg',
        'https://i.pinimg.com/736x/34/09/47/3409473854b71f3fd72e519e704534bb.jpg',
        'https://i.pinimg.com/736x/aa/b1/1c/aab11c7768abca8d07573f7bddf6fb87.jpg',
        'https://i.pinimg.com/736x/94/1c/c6/941cc6f27b50320cb321ca218795c713.jpg',
      ],
    },
    'Outdoor & Nature': {
      titles: [
        'Hiking Adventure',
        'Beach Cleanup',
        'Bird Watching Tour',
        'Forest Retreat',
        'Camping Weekend',
        'Mountain Trekking',
        'Kayaking Expedition',
        'Nature Photography Walk',
        'Eco Awareness Day',
        'Star Gazing Night',
        'River Rafting Adventure',
        'Wildlife Exploration',
        'Garden Workshop',
        'Eco Festival',
        'Outdoor Yoga Retreat',
      ],
      images: [
        'https://i.pinimg.com/736x/4e/a8/d2/4ea8d2affa32a140fa830bb4abb2de68.jpg',
        'https://i.pinimg.com/736x/2f/b0/f4/2fb0f443a76e2d3f0ec7c414e2f16ca2.jpg',
        'https://i.pinimg.com/736x/7b/83/d8/7b83d8f99464a022a16e04aa8b533cbb.jpg',
        'https://i.pinimg.com/1200x/90/c5/05/90c5051f7c9f41039368b99fa2111628.jpg',
        'https://i.pinimg.com/1200x/59/00/23/5900231f6c0aaca61bba9a174d4f494a.jpg',
      ],
    },
  };
  const categories = await prisma.category.findMany();

  for (const category of categories) {
    const { titles, images } = categoryData[category.name];

    for (let i = 0; i < 15; i++) {
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomVenue = venues[Math.floor(Math.random() * venues.length)];
      const randomOrganizer =
        organizers[Math.floor(Math.random() * organizers.length)];

      const startMonth = 11;
      const randomMonthOffset = Math.floor(Math.random() * 12);
      const eventDate = new Date(
        2025,
        startMonth + randomMonthOffset,
        Math.floor(Math.random() * 28) + 1,
        18,
        0,
        0,
      );

      const title = titles[i];
      const imageUrl = images[Math.floor(Math.random() * images.length)];

      await prisma.event.create({
        data: {
          title,
          description: `This is a ${category.name.toLowerCase()} event called "${title}".`,
          date: eventDate,
          city: randomCity,
          venue: randomVenue,
          imageUrl,
          organizer: randomOrganizer,
          categories: { connect: [{ id: category.id }] },
        },
      });
    }
  }
}

seedEvents()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
