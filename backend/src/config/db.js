import mongoose from "mongoose";

const startDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Database connected");
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export default startDB;
