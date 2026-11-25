import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${mongoose.connection.name}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};
//catches problems that happen later, like Wi-Fi dropping
mongoose.connection.on("error", (err) => {
  console.error(`MongoDB error after connecting: ${err.message}`);
});

export default connectDB;
