import Validator from "validatorjs";
import { Request, Response, NextFunction } from "express";
import Helpers from "../../helpers/Helper";
import User from "../../db/models/User";
import session from 'express-session';

const RegisterValidation = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, email, password, confirmPassword } = req.body;

		const data = {
			name,
			email,
			password,
			confirmPassword
		};

		const rules: Validator.Rules = {
			"name": "required|string|max:50",
			"email": "required|email",
			"password": "required|min:8",
			"confirmPassword": "required|same:password"
		};

		const validate = new Validator(data, rules);

		if (validate.fails()) {
			return res.status(400).send(Helpers.ResponseData(400, "Bad Request", validate.errors, null));
		}

		const user = await User.findOne({
			where: {
				email: data.email
			}
		});

		if (user) {
			const errorData = {
				errors: {
					email: [
						"Email already used"
					]
				}
			};
			return res.status(400).send(Helpers.ResponseData(400, "BadRequest", errorData, null))
		}
		next();
	} catch (error:any) {
		return res.status(500).send(Helpers.ResponseData(500, "", error, null));
	}
	
};

// const verifyUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
//   try {
//     if (!req.session.userId) {
//       return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
//     }

//     const user = await User.findOne({
//       attributes: ['id', 'name', 'email'],
//       where: {
//         id: req.session.userId
//       }
//     });

//     if (!user) {
//       return res.status(404).json({ msg: "User tidak ditemukan" });
//     }

//     // req.id = user.id; // Tidak perlu mengatur req.id karena Anda ingin mengakses user.id dalam middleware berikutnya
//     next();
//   } catch (error) {
//     return res.status(500).json({ error: "Gagal memverifikasi pengguna" });
//   }
// };


export default { RegisterValidation };