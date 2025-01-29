import mongoose from "mongoose";

const DatabaseCofig = async () => {
  mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error:", err);
  });

  try {
    mongoose.set("debug", true);
    await mongoose.connect(
      "mongodb+srv://bipincloudshope12:EDDL3X2cP6XlSVJV@cluster0.pyhii.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Unable to set the database :=>", error);
  }
};

export default DatabaseCofig;
