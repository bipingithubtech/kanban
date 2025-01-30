import mongoose from "mongoose";

const DatabaseCofig = async () => {
  mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error:", err);
  });

  try {
    mongoose.set("debug", true);
<<<<<<< HEAD
    await mongoose.connect(process.env.db);
=======
    await mongoose.connect(
     process.env.db
    );
>>>>>>> 42c151edb1e007536563460d9426c2d92e369a2a
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Unable to set the database :=>", error);
  }
};

export default DatabaseCofig;
