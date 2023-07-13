import express, { Request, Response } from "express";
import Router from "./routes/Routes";
import {scheduleCareerDeletion} from "./controllers/CareerController"
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import SequelizeStore from "connect-session-sequelize";
import sequelizeConnection from "./config/dbConnect";

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
  db: sequelizeConnection,
});

// const sessSecret: string = process.env.SESS_SECRET || "";

app.use(
	session({
	  secret: process.env.SESS_SECRET as string,
	  resave: false,
	  saveUninitialized: true,
	  store: store,
	  cookie: {
		// https = true
		secure: false,
		// maxAge: 30 * 60 * 1000, // 30m expired
	  },
	})
  )

app.get("/", (req: Request, res: Response) => {
	return res.status(200).send({
		response: "Express TypeScript"
	});
})

app.use(
	cors({
	  credentials: true,
	  origin: "http://localhost:3000",
	})
  );

app.use(express.json());
app.use(Router)
app.use(scheduleCareerDeletion);

//init table session
// store.sync();

app.listen(process.env.APP_PORT, () => {
	console.log((`${process.env.APP_NAME} running on port ${process.env.APP_PORT}`))
});