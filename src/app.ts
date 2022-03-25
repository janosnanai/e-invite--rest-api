import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

import adminRoutes from "./routes/admin-routes";
import guestRoutes from "./routes/guest-routes";

const app = express();

app.use(express.json());

app.get("/", (req,res)=>{res.send("Hello")});
app.use("/api/guest/", guestRoutes);
app.use("/api/admin/", adminRoutes);

// app.use("/api/guest", (req, res, next) => {});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.b4ara.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(`server listening on port:${process.env.PORT || 8080} ...`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
