import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@travelbuddy.com' },
    update: {},
    create: {
      email: 'admin@travelbuddy.com',
      password: adminPassword,
      role: 'ADMIN',
      isVerified: true,
      profile: {
        create: {
          fullName: 'Travel Buddy Admin',
          bio: 'System administrator for Travel Buddy platform',
          currentLocation: 'Global',
          travelInterests: ['admin', 'management'],
          visitedCountries: ['Global'],
        },
      },
    },
  });

  // Create sample user
  const userPassword = await bcrypt.hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      role: 'USER',
      isVerified: true,
      profile: {
        create: {
          fullName: 'John Traveler',
          bio: 'Passionate traveler exploring the world one country at a time',
          currentLocation: 'New York, USA',
          travelInterests: ['hiking', 'food', 'photography', 'culture'],
          visitedCountries: ['USA', 'Canada', 'Mexico', 'France', 'Japan'],
        },
      },
    },
  });

  // Create sample travel plans
  const travelPlan1 = await prisma.travelPlan.create({
    data: {
      destination: 'Tokyo, Japan',
      startDate: new Date('2024-03-15'),
      endDate: new Date('2024-03-25'),
      budget: '$1500-2000',
      travelType: 'SOLO',
      description: 'Looking to explore Tokyo\'s food scene and cultural sites. Interested in meeting fellow travelers for meals and sightseeing.',
      userId: user.id,
    },
  });

  const travelPlan2 = await prisma.travelPlan.create({
    data: {
      destination: 'Bali, Indonesia',
      startDate: new Date('2024-04-10'),
      endDate: new Date('2024-04-20'),
      budget: '$1000-1500',
      travelType: 'FRIENDS',
      description: 'Beach vacation with focus on surfing, yoga, and island hopping. Open to meeting new people for activities.',
      userId: user.id,
    },
  });

  console.log('✅ Database seeded successfully');
  console.log(`👤 Admin user: admin@travelbuddy.com / admin123`);
  console.log(`👤 Sample user: user@example.com / user123`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });