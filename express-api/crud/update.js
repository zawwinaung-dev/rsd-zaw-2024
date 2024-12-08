const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.update({
        where: { id: 1 },
        data: { 
            bio: "Updated bio 2",
        }
    });

    console.log(user);
    
}

main();