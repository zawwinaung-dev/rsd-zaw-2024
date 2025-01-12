const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");

async function main() {
	console.log("user seeding started...");
    for(let i=0; i<5; i++) {
        const hash = await bcrypt.hash("123456", 10);
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();

        await prisma.user.create({
            data: {
                name: `${firstName} ${lastName}`,
                username: `${firstName}${lastName[0]}`.toLowerCase(),
                bio: faker.person.bio(),
                password: hash,
            }
        });
    }

    console.log("user seeding done.");

    console.log("post seeding started...");
    for (let i = 0; i < 20; i++) {
		await prisma.post.create({
			data: {
                content: faker.lorem.paragraph(),
                userId: faker.number.int({ min: 1, max: 5 }),
            }
		});
	}

    console.log("post seeding done.");

    console.log("comment seeding started...");
    for (let i = 0; i < 40; i++) {
        await prisma.comment.create({
            data: {
                content: faker.lorem.sentence(),
                postId: faker.number.int({ min: 1, max: 20 }),
                userId: faker.number.int({ min: 1, max: 5 }),
            }
        });
    }

    console.log("comment seeding done.");

    console.log("follow seeding started...");
    // Keep track of existing follows to avoid duplicates
    const existingFollows = new Set();
    
    // Each user will follow 2-4 other users
    for (let followerId = 1; followerId <= 5; followerId++) {
        const numToFollow = faker.number.int({ min: 2, max: 4 });
        let followed = 0;
        
        while (followed < numToFollow) {
            const followingId = faker.number.int({ min: 1, max: 5 });
            
            // Skip if user trying to follow themselves or if follow relationship already exists
            if (followerId === followingId || existingFollows.has(`${followerId}-${followingId}`)) {
                continue;
            }
            
            await prisma.follow.create({
                data: {
                    followerId,
                    followingId,
                }
            });
            
            existingFollows.add(`${followerId}-${followingId}`);
            followed++;
        }
    }
    console.log("follow seeding done.");

    // Add likes seeding
    console.log("like seeding started...");
    const users = await prisma.user.findMany();
    const posts = await prisma.post.findMany();
    const usedCombinations = new Set();

    for (let i = 0; i < 30; i++) {
        let userId, postId;
        let combinationKey;
        
        do {
            userId = users[faker.number.int({ min: 0, max: users.length - 1 })].id;
            postId = posts[faker.number.int({ min: 0, max: posts.length - 1 })].id;
            combinationKey = `${userId}-${postId}`;
        } while (usedCombinations.has(combinationKey));
        
        usedCombinations.add(combinationKey);
        
        try {
            await prisma.like.create({
                data: {
                    userId,
                    postId,
                }
            });
        } catch (error) {
            console.log(`Skipping duplicate like for user ${userId} and post ${postId}`);
            continue;
        }
    }

    console.log("like seeding done.");

    // Add notifications seeding
    console.log("notification seeding started...");
    
    // Create sample notifications for likes
    for (let i = 0; i < 3; i++) {
        await prisma.notification.create({
            data: {
                type: "LIKE",
                userId: 5,
                actorId: faker.number.int({ min: 1, max: 4 }),
                postId: faker.number.int({ min: 1, max: 20 }),
                read: false,
                created: faker.date.recent({ days: 7 }),
            }
        });
    }

    // Create sample notifications for comments
    for (let i = 0; i < 2; i++) {
        await prisma.notification.create({
            data: {
                type: "COMMENT",
                userId: 5,
                actorId: faker.number.int({ min: 1, max: 4 }),
                postId: faker.number.int({ min: 1, max: 20 }),
                read: false,
                created: faker.date.recent({ days: 7 }),
            }
        });
    }

    console.log("notification seeding done.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

//npx prisma migrate reset