import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import path from "path";

dotenv.config({});

const app = express();

const _dirname = path.resolve();

// app.get("/home", (req, res) => {
//   return res.status(200).json({
//     message: "I am coming from backend",
//     success: true,
//   });
// });

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
  origin: "https://jobportal-mern-v01m.onrender.com",
  credentials: true,
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3001;

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

//API's
// "http://localhost:8000/api/v1/user"
// "http://localhost:8000/api/v1/user/register"
// "http://localhost:8000/api/v1/user/login"
// "http://localhost:8000/api/v1/user/ptofile/update"

app.use(express.static(path.join(_dirname, "frontend/dist")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  connectDB();
  console.log(`Server running at port ${PORT}`);
});
