const express = require("express");
const dotenv = require("dotenv");
const router = require("./routers/quizrouter");
const dbconnection = require("./config/db")
const cors = require("cors");
const authrouter = require("./routers/auth");
const userrouter = require("./routers/user");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(cors({origin: " http://localhost:5173",
    credentials: true,}));
app.use(express.json());

dbconnection();

app.use('/api/v1', router);
app.use('/api/v1', authrouter);
app.use('/api/v1', userrouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`the server is running at port ${PORT}`);
})
