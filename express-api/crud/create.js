const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.create({
        data: {
            name: "Alice",
            username: "alice",
            posts: {
                create: [
                    { content: 'First post from Alice'},
                    { content: 'Second post from Alice'},
                ]
            }
        }
    });

    console.log(user);
}

main();