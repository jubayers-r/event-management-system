import { prisma } from "./lib/prisma";
import app from "./app";
import { initWebSocket } from "./socket";



const PORT = process.env.PORT || 5000;

async function main() {
  try {
    await prisma.$connect();
    const server = app.listen(PORT, () => {
      console.log("running at", PORT);
    });

    server.once("listening", () => {
      initWebSocket(server);
    });
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
