import mongoose from "mongoose";

const DatabaseCofig = async () => {
  mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error:", err);
  });

  try {
    mongoose.set("debug", true);

    await mongoose.connect(process.env.db);

    await mongoose.connect(process.env.db);

    console.log("Database connected successfully");
  } catch (error) {
    console.log("Unable to set the database :=>", error);
  }
};

export default DatabaseCofig;
