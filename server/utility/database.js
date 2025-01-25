import mongoose from "mongoose";

const DatabaseCofig = async () => {
  try {
    await mongoose.connect(process.env.db);
    console.log("databse connected suceesfully");
  } catch (error) {
    console.log("unable to set the databse :=>", error);
  }
};

export default DatabaseCofig;
