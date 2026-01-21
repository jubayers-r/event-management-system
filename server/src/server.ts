// import { prisma } from "./lib/prisma";
import app from "./app";

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    // await prisma.$connect();
    app.listen(PORT, () => {
      console.log("running at", PORT);
    });
  } catch (error) {
    console.error(error);
    // await prisma.$disconnect();
    process.exit(1);
  }
}

main();
