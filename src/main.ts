import express from "express";
import user from "./routes/user";
import person from "./routes/person";
import doctor from "./routes/doctor";
import patient from "./routes/patient";

const app = express();

app.use("/users", user);
app.use("/persons", person);
app.use("/doctors", doctor);
app.use("/patients", patient);

export default app;
