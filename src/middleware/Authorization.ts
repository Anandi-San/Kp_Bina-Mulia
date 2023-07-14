import { Request, Response, NextFunction } from "express";
import Helper from "../helpers/Helper";
import User from "../db/models/User";

interface CustomRequest extends Request {
	userId: string;
  }

const Authenticated = (req: Request, res: Response, next: NextFunction) => {
	try {
		const authToken = req.headers["authorization"];
		const token = authToken && authToken.split(" ")[1];

		if (!token) {
  		return res.status(401).send(Helper.ResponseData(401, "Unauthorized", null, null));
		}
		const result = Helper.ExtractToken(token!);
		// console.log(result)
		if (result === null) {
			return res.status(401).send(Helper.ResponseData(401, "Unautorized", null, null));
		}

		// res.locals.userId = result.id;
		res.locals.userEmail = result?.email;
		res.locals.roleId = result?.roleId;
		next();

	} catch (err:any) {
		return res.status(500).send(Helper.ResponseData(500, "", err, null));
	}
};

const SuperUser = (req: Request, res: Response, next: NextFunction) => {
	try {
		const roleId = res.locals.roleId;
		if (roleId !== 1) {
			return res.status(401).send(Helper.ResponseData(403, "Forbidden", null, null));
		}

		next();
	} catch (err:any) {
		return res.status(500).send(Helper.ResponseData(500, "", err, null));
	}
};

const AdminRole = (req: Request, res: Response, next: NextFunction) => {
	try {
		const roleId = res.locals.roleId;
		if (roleId !== 2) {
			return res.status(401).send(Helper.ResponseData(403, "Forbidden", null, null));
		}

		next();
	} catch (err:any) {
		return res.status(500).send(Helper.ResponseData(500, "", err, null));
	}
};

const BasicUser = (req: Request, res: Response, next: NextFunction) => {
	try {
		const roleId = res.locals.roleId;
		if (roleId !== 3) {
			return res.status(401).send(Helper.ResponseData(403, "Forbidden", null, null));
		}

		next();
	} catch (err:any) {
		return res.status(500).send(Helper.ResponseData(500, "", err, null));
	}
};

export default { Authenticated, SuperUser, AdminRole, BasicUser }