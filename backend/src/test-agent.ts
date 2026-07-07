import "dotenv/config";
import { connectDB } from "./config/database";
import { askProjectAgent } from "./ai/agents/projectAgent";
import "./models";

const run = async () => {

  await connectDB();

  const result =
    await askProjectAgent(
      "6a4629a5edd6b1f3d906f799"
    );

  console.log(result);

  process.exit(0);

};

run();