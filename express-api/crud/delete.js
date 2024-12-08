const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    await prisma.post.deleteMany({
        where: { userId: 1 },
    });

    const user = await prisma.user.delete({
            where: { id: 1 },
    });

    console.log(user);
}

main();

// npm i @faker-js/faker -D
// npm i bcrypt