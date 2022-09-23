const express = require("express");
const {
	handle404s,
	handlePsqlErrors,
	handleCustomErrors,
	handleServerErrors
} = require("./Errors/errors");

const apiRouter = require("./routes/apiRoutes");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

app.all("/*", handle404s);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
