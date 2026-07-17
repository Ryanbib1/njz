const { PrismaClient } = require('../prisma-generated/client');

const prisma = new PrismaClient();
const MODEL_NAMES = ["member", "restaurant", "restaurantphoto", "restaurantreview", "restauranthour"];
const modelIdMap = {
  "member": new Map(),
  "restaurant": new Map(),
  "restaurantphoto": new Map(),
  "restaurantreview": new Map(),
  "restauranthour": new Map()
};

// === Seed Functions Start ===
async function seedmember(prisma: any, modelIdMap: any): Promise<void> {
  const baseDate = new Date();
  const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);

  const memberData = [
    {
      account: "john_smith",
      password: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
      email: "john.smith@example.com",
      role: "GUEST",
      createdAnchor: -45,
      updatedAnchor: -10
    },
    {
      account: "emily_davis",
      password: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
      email: "emily.davis@example.com",
      role: "GUEST",
      createdAnchor: -60,
      updatedAnchor: -40
    },
    {
      account: "michael.brown",
      password: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
      email: "michael.brown@testmail.com",
      role: "GUEST",
      createdAnchor: -15,
      updatedAnchor: -5
    },
    {
      account: "sarah_connor",
      password: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
      email: "s.connor@domain.net",
      role: "GUEST",
      createdAnchor: -20,
      updatedAnchor: -18
    },
    {
      account: "jason_bourne",
      password: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
      email: "jbourne@tavola.com",
      role: "ADMIN",
      createdAnchor: -100,
      updatedAnchor: -2
    }
  ];

  modelIdMap["member"] = new Map<number, string>();

  for (let i = 0; i < memberData.length; i++) {
    const data = memberData[i];
    const createdAt = addDays(baseDate, data.createdAnchor);
    const updatedAt = addDays(baseDate, data.updatedAnchor);

    const record = await prisma.member.create({
      data: {
        account: data.account,
        password: data.password,
        email: data.email,
        role: data.role as any,
        createdAt: createdAt,
        updatedAt: updatedAt
      }
    });

    modelIdMap["member"].set(i, record.id);
  }
}
async function seedrestaurant(prisma: any, modelIdMap: any): Promise<void> {
  const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);
  const now = new Date();

  // Step 1: Define static data array
  const restaurantData = [
    {
      name: "Tavola Italian Dining",
      address: "China, Bei Jing Shi, Chao Yang Qu, Dong Fang Dong Lu, 19号亮马桥外交公寓B区会所2层 邮政编码: 100028",
      phone: "010 8532 5068",
      website: "https://ditu.amap.com/search?query=Tavola+Italian+Dining+亮马桥",
      rating: 4.6,
      reviewCount: 59,
      brandStory: "A refined destination for authentic Italian cuisine in Beijing. Experience our sunlit dining room, outstanding wood-fired pizza, affordable prefix lunch menus, and beautifully curated courses crafted with classic rustic passion.",
      highlights: [
        "Wood-Fired Pizza", 
        "Affordable Prefix Lunch", 
        "Premium Wine Pairing", 
        "Authentic Italian Cuisine"
      ],
      timeAnchor: -120
    }
  ];

  // Step 2: Initialize modelIdMap for this model
  modelIdMap["restaurant"] = new Map<number, string>();

  // Step 3: Iterate and create records
  for (let i = 0; i < restaurantData.length; i++) {
    const data = restaurantData[i];
    const anchor = addDays(now, data.timeAnchor);
    const updatedAnchor = addDays(now, -15); // Last 30 days

    const record = await prisma.restaurant.create({
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        website: data.website,
        rating: data.rating,
        reviewCount: data.reviewCount,
        brandStory: data.brandStory,
        highlights: data.highlights,
        createdAt: anchor,
        updatedAt: updatedAnchor
      }
    });

    // Save actual ID to modelIdMap for potential child tables
    modelIdMap["restaurant"].set(i, record.id);
  }
}
async function seedrestaurantphoto(prisma: any, modelIdMap: any): Promise<void> {
  const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);
  const now = new Date();

  // Step 1: Define static data array
  const restaurantphotoData = [
    {
      photoKey: "img-01",
      sortOrder: 1,
      alt: "Shelves lined with genuine Italian imports overlooking lively tables",
      description: "Ambiance",
      imageUrl: "https://lh3.googleusercontent.com/place-photos/AG9NLjCxrZAxgMRhWpFCtLWVnYeySHkHDhMqQ9BjKsTG5QUTjRZnGOVH4Y63b2GXD1MR12IsUgsm3YbYdDoVVz52REe-0lxp5_TzfS3bQRIE0Q0zmPqAlBfMcbwvgWtL1ROOsBFKIAHJSaIBOpxmdg=s4800-w1200",
      parentIndex: 0,
      timeAnchor: -300
    },
    {
      photoKey: "img-02",
      sortOrder: 2,
      alt: "Delicately plated appetizer of fresh, vibrant heirloom vegetables",
      description: "Plated",
      imageUrl: "https://lh3.googleusercontent.com/place-photos/AG9NLjDI-klgjpWDjIUPgOD9vfUdYJgIJbZYraztXkLaWEhuXLV0yu34mFnzASNbXHC2bUFKajFvXS-zlWlj7IjXXDd0YJlGQWgoGzpdFf2p9qjfT4X2l8WM1hFbZ_HkyMPIWb-fruy_aeEQ2BRW-8DPVSys=s4800-w1200",
      parentIndex: 0,
      timeAnchor: -280
    },
    {
      photoKey: "img-03",
      sortOrder: 3,
      alt: "Neapolitan-style pizza blistered to perfection with rich toppings",
      description: "Signature",
      imageUrl: "https://lh3.googleusercontent.com/place-photos/AG9NLjDxGoYvPxmlnwfXlJjbj7DLQJ-oE_mpzBfDsTVLlsLwon2MOcbzNn0wCCpSuOUy8UbHH-KUxaJhHDwD7wRarpMrpd-WqdKhxs4iE7puZwdDnxyr7l7_QenGWE9xLqAFhAORHURfXKH1PY3-H6nT69cFEw=s4800-w1200",
      parentIndex: 0,
      timeAnchor: -260
    },
    {
      photoKey: "img-04",
      sortOrder: 4,
      alt: "Artisanal red candles melted into sculptural wax forms at our wooden bar",
      description: "Detail",
      imageUrl: "https://lh3.googleusercontent.com/place-photos/AG9NLjD--K4TP4ekNIF8n8VvwKY1Wcg8tpiMi_5ZZCumM5MitZWGLjMUf0m6VPDR59wc11oNtQRZ6XvaHRdKgBh92QXkKt3EAZz_hEvmP2ibrMY-odZLnqk3CJlgrdLCFgS9nxSygYILn6NxpHWn_bkQxf4l=s4800-w1200",
      parentIndex: 0,
      timeAnchor: -240
    },
    {
      photoKey: "img-05",
      sortOrder: 5,
      alt: "Decadent layered chocolate and strawberry dessert styled meticulously",
      description: "Plated",
      imageUrl: "https://lh3.googleusercontent.com/place-photos/AG9NLjCrPM3APOmGVFjMTVCICocp0yOLJS0q1u0PmtN1zuxvOD13McEAopO42v3smayZxxudt7UNPGyoxYAbe6TZN-s6zIgGUlqJFh6kxuL-cp44X-SG072lyDQiyskHccdWw2dyUQIxH0i379-lMVGow4Ly6w=s4800-w1200",
      parentIndex: 0,
      timeAnchor: -220
    },
    {
      photoKey: "img-06",
      sortOrder: 6,
      alt: "Artfully drizzled beef carpaccio with micro-greens and signature purées",
      description: "Plated",
      imageUrl: "https://lh3.googleusercontent.com/place-photos/AG9NLjBsQXrr_2ibwjCByIgEZniIV2dpirE_G9okvzVckTccPQYXyPIuBeRYcON9O8-PpwnEiZJIofynTQDU5H-uElPUAlSsk1rUD5wdM9IKHNR4OBcTr8vKEYxYbLgDN4WxtSRyO4yu9XcWfEZg3A=s4800-w1200",
      parentIndex: 0,
      timeAnchor: -200
    },
    {
      photoKey: "img-07",
      sortOrder: 7,
      alt: "Prime pan-roasted medallions served with crisp seasonal broccolini",
      description: "Signature",
      imageUrl: "https://lh3.googleusercontent.com/place-photos/AG9NLjCo8Ulsm5rTM7Y_s0T7VIdtq1bHSP2elBRTWqKOLiYVCHf1Hjqs-gBouM6e0LoE5pggXm747qlOfRGp4nMUxhRp4BiE8TlzUrmPHTeeqoU6CJj6tVqWrl8bPar3fi-GYKJml2erk-dUYguFRg=s4800-w1200",
      parentIndex: 0,
      timeAnchor: -180
    },
    {
      photoKey: "img-08",
      sortOrder: 8,
      alt: "Sunlit dining pavilion framed in warm walnut tones and autumnal flora",
      description: "Ambiance",
      imageUrl: "https://lh3.googleusercontent.com/place-photos/AG9NLjDVEyeuSfZ31zI012CF0pBfw7awf8USHJIIX01d4gBUBYVmlSAGdbtA6bD--MsCfWMQYtroHhlloe5zATTXotF0kF696NSPrc9C1bQ_PvDzfT23AVKV6DixVeM3JeMF_JKfc9hlhwjp2nj2RQ=s4800-w1200",
      parentIndex: 0,
      timeAnchor: -160
    },
    {
      photoKey: "img-09",
      sortOrder: 9,
      alt: "Linen tablecloths set elegant stages beneath romantic, warm candlelight",
      description: "Ambiance",
      imageUrl: "https://lh3.googleusercontent.com/place-photos/AG9NLjB1sO0efGOAOY2l2KPuu3Wxt8PUlNLbkp-uQFVnI9iidiz6RtV-vFNH0C-lCds0qZRmazRM9Dfn1dPlSMMJsx2rgyk1RclNCYg5THhqzLQWM7Pgf4KBuyNfV68rSdBFVPJuWT86aCOcZlELERk=s4800-w1200",
      parentIndex: 0,
      timeAnchor: -140
    },
    {
      photoKey: "img-10",
      sortOrder: 10,
      alt: "Seared sliced ribeye served on hot stone with roasted garden garlic",
      description: "Signature",
      imageUrl: "https://lh3.googleusercontent.com/place-photos/AG9NLjB8zLMayaytBoDRhonrWGKP3TUr177b4OaR7Z079eN-GjgnLMralg-noF4WutM_l25YPJI4Ob8RYSthNhbWTwA1WqSYVDvSt2lEZdRS50CfdUiRvTntRv4sPAKFw4HbjVZv4N-ITtRz4h3nLg=s4800-w1200",
      parentIndex: 0,
      timeAnchor: -120
    }
  ];

  // Step 2: Initialize modelIdMap
  modelIdMap["restaurantphoto"] = new Map<number, string>();

  // Step 3: Iterate and create records
  for (let i = 0; i < restaurantphotoData.length; i++) {
    const data = restaurantphotoData[i];
    const parentId = modelIdMap["restaurant"].get(data.parentIndex);
    
    if (!parentId) continue;

    const anchor = addDays(now, data.timeAnchor);
    const updatedAnchor = addDays(now, -15); // Fixed updatedAt based on blueprint strategy

    const record = await prisma.restaurantphoto.create({
      data: {
        restaurantId: parentId,
        photoKey: data.photoKey,
        sortOrder: data.sortOrder,
        alt: data.alt,
        description: data.description,
        imageUrl: data.imageUrl,
        createdAt: anchor,
        updatedAt: updatedAnchor
      }
    });

    modelIdMap["restaurantphoto"].set(i, record.id);
  }
}
async function seedrestaurantreview(prisma: any, modelIdMap: any): Promise<void> {
  const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);
  const now = new Date();

  // Step 1: Define static data array
  // Data reflects authentic reviews for an Italian restaurant, matching blueprint exact records
  const reviewData = [
    {
      parentIndex: 0,
      reviewSlot: 1,
      authorName: "Kae Anchalee",
      rating: 5,
      relativeTime: "Recent",
      content: "On this trip to Beijing, I changed from Chinese food to Western food. This is probably the best Italian restaurant in Beijing. I highly recommend it.",
      timeAnchor: -2
    },
    {
      parentIndex: 0,
      reviewSlot: 2,
      authorName: "Neville Panter",
      rating: 5,
      relativeTime: "Recent",
      content: "Im from north America and everything was really good.  If you want a change of pace from chinese food this place is really classy!",
      timeAnchor: -5
    },
    {
      parentIndex: 0,
      reviewSlot: 3,
      authorName: "SAM DC",
      rating: 5,
      relativeTime: "Recent",
      content: "a great place to have lunch!! they a prefix lunch menu that’s very affordable. you can choose just two courses or go with three course. and u can choose appetizer and main course or appetizer main course and dessert! the courses are just the right size but i would say two courses is plenty of food.   they also have a sparkling juice that is very nice!",
      timeAnchor: -12
    },
    {
      parentIndex: 0,
      reviewSlot: 4,
      authorName: "Lydia ZHU",
      rating: 5,
      relativeTime: "Recent",
      content: "Favorite Italian restaurant in town with the best pizza of Beijing!! Perfect for a date night or a family dinner!",
      timeAnchor: -20
    },
    {
      parentIndex: 0,
      reviewSlot: 5,
      authorName: "Robert Baertschi",
      rating: 5,
      relativeTime: "Recent",
      content: "Absolutely amazing food, service and presentation of the food. Cozzy place.",
      timeAnchor: -25
    }
  ];

  // Step 2: Initialize modelIdMap for this model
  modelIdMap["restaurantreview"] = new Map<number, string>();

  // Step 3: Iterate and create records
  for (let i = 0; i < reviewData.length; i++) {
    const data = reviewData[i];
    const parentId = modelIdMap["restaurant"].get(data.parentIndex);
    
    if (!parentId) continue;

    const anchor = addDays(now, data.timeAnchor);
    const updatedAnchor = addDays(anchor, 1);

    const record = await prisma.restaurantreview.create({
      data: {
        restaurantId: parentId,
        reviewSlot: data.reviewSlot,
        authorName: data.authorName,
        rating: data.rating,
        relativeTime: data.relativeTime,
        content: data.content,
        createdAt: anchor,
        updatedAt: updatedAnchor
      }
    });

    modelIdMap["restaurantreview"].set(i, record.id);
  }
}
async function seedrestauranthour(prisma: any, modelIdMap: any): Promise<void> {
  const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);
  const now = new Date();

  // Step 1: Define static data array
  const restauranthourData = [
    {
      weekday: "MONDAY",
      sortOrder: 1,
      fullLine: "Monday – Sunday: 10:00 AM – 10:30 PM",
      parentIndex: 0,
      timeAnchor: -120
    },
    {
      weekday: "TUESDAY",
      sortOrder: 2,
      fullLine: "Monday – Sunday: 10:00 AM – 10:30 PM",
      parentIndex: 0,
      timeAnchor: -120
    },
    {
      weekday: "WEDNESDAY",
      sortOrder: 3,
      fullLine: "Monday – Sunday: 10:00 AM – 10:30 PM",
      parentIndex: 0,
      timeAnchor: -120
    },
    {
      weekday: "THURSDAY",
      sortOrder: 4,
      fullLine: "Monday – Sunday: 10:00 AM – 10:30 PM",
      parentIndex: 0,
      timeAnchor: -120
    },
    {
      weekday: "FRIDAY",
      sortOrder: 5,
      fullLine: "Monday – Sunday: 10:00 AM – 10:30 PM",
      parentIndex: 0,
      timeAnchor: -120
    },
    {
      weekday: "SATURDAY",
      sortOrder: 6,
      fullLine: "Monday – Sunday: 10:00 AM – 10:30 PM",
      parentIndex: 0,
      timeAnchor: -120
    },
    {
      weekday: "SUNDAY",
      sortOrder: 7,
      fullLine: "Monday – Sunday: 10:00 AM – 10:30 PM",
      parentIndex: 0,
      timeAnchor: -120
    }
  ];

  // Step 2: Initialize modelIdMap for this model
  modelIdMap["restauranthour"] = new Map<number, string>();

  // Step 3: Iterate and create records
  for (let i = 0; i < restauranthourData.length; i++) {
    const data = restauranthourData[i];
    const restaurantId = modelIdMap["restaurant"].get(data.parentIndex);
    
    if (!restaurantId) continue;

    const anchor = addDays(now, data.timeAnchor);
    const updatedAnchor = addDays(now, -15); // Last 30 days

    const record = await prisma.restauranthour.create({
      data: {
        restaurantId: restaurantId,
        weekday: data.weekday as any,
        sortOrder: data.sortOrder,
        fullLine: data.fullLine,
        createdAt: anchor,
        updatedAt: updatedAnchor
      }
    });

    // Save actual ID to modelIdMap for potential child tables
    modelIdMap["restauranthour"].set(i, record.id);
  }
}
// === Seed Functions End ===

async function runSeedStep(stepName, fn) {
  try {
    await fn();
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error(`[SEED_STEP_FAILED] ${stepName}`);
    throw err;
  }
}

async function main() {
  // Delete all data once in reverse topology order before inserts.
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0');
  try {
    await prisma.restaurantphoto.deleteMany();
    await prisma.restaurantreview.deleteMany();
    await prisma.restauranthour.deleteMany();
    await prisma.member.deleteMany();
    await prisma.restaurant.deleteMany();
  } finally {
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1');
  }

  await runSeedStep('seedmember', () => seedmember(prisma, modelIdMap));
  await runSeedStep('seedrestaurant', () => seedrestaurant(prisma, modelIdMap));
  await runSeedStep('seedrestaurantphoto', () => seedrestaurantphoto(prisma, modelIdMap));
  await runSeedStep('seedrestaurantreview', () => seedrestaurantreview(prisma, modelIdMap));
  await runSeedStep('seedrestauranthour', () => seedrestauranthour(prisma, modelIdMap));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });