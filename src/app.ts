import express, { NextFunction, Request, Response } from "express";
const app = express();
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";
import router from "./routes";
import cookieParser from "cookie-parser";

// parsers ( middleware )
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// routes moddleware
app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Car Washing Server is running...");
});

// not found route
app.use(notFound);

// global error handler route
app.use(globalErrorHandler);

export default app;
