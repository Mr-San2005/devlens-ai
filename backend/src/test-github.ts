import "dotenv/config";

import "./models";

import { connectDB } from "./config/database";

import { generateDeveloperBrief } from "./ai/agents/projectAgent";

const run = async () => {

  await connectDB();

  const result =
    await generateDeveloperBrief(

      "6a4629a5edd6b1f3d906f799",

      "Mr-San2005",

      "devlens-ai"

    );

  console.log(result);

  process.exit(0);

};

run();