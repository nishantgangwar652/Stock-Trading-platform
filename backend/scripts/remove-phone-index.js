const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

async function removePhoneIndex() {
  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL is required");
  }

  await mongoose.connect(process.env.MONGO_URL);
  try {
    await mongoose.connection.collection("users").dropIndex("phone_1");
    console.log("Removed the legacy phone index.");
  } catch (error) {
    if (error.codeName === "IndexNotFound" || error.code === 27) {
      console.log("The legacy phone index does not exist.");
    } else {
      throw error;
    }
  } finally {
    await mongoose.disconnect();
  }
}

removePhoneIndex().catch((error) => {
  console.error("Unable to remove the legacy phone index:", error.message);
  process.exitCode = 1;
});
