import { Request, Response } from "express";
import Role from "../db/models/Role";
import User from "../db/models/User";
import Register from "../db/models/Register";
import nodemailer from "nodemailer";
import Mailgen from 'mailgen'
import Helper from "../helpers/Helper";
import PasswordHelper from "../helpers/PasswordHelper";

import dotenv from "dotenv";

dotenv.config();

const SignUp = async (req: Request, res: Response): Promise<any> => {
	try {
	  const { name, email, password ,confirmPassword} = req.body;

	  const hashed = await PasswordHelper.PasswordHashing(password);
  
	  // Buat transporter Nodemailer menggunakan konfigurasi Gmail
	  const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		// service: 'gmail',
		auth: {
		  user: process.env.USER_EMAIL,
		  pass: process.env.USER_PASS,
		},
	  });
  
	  const verificationToken = Helper.generateVerificationToken();
	  const verificationLink = `https://yayasanbinamulia/verify/${verificationToken}`;
  
	  const mailGenerator = new Mailgen({
		theme: 'default',
		product: {
		  name: 'Mailgen',
		  link: 'https://mailgen.js',
		},
	  });
  
	  const emailTemplate = {
		body: {
		  name: name,
		  intro: 'Selamat datang di aplikasi kami! Klik tombol di bawah ini untuk melakukan verifikasi email Anda.',
		  action: {
			instructions: 'Klik tombol di bawah:',
			button: {
			  color: '#22BC66',
			  text: 'Verifikasi Email',
			  link: verificationLink,
			},
		  },
		},
	  };
  
	  const emailBody = mailGenerator.generate(emailTemplate);
	  const emailText = mailGenerator.generatePlaintext(emailTemplate);
  
	  const mailOptions = {
		from: 'Yayasan Bina Mulia <noreply@gmail.com>',
		to: email,
		subject: 'Verifikasi Email',
		text: emailText,
		html: emailBody,
	  };

	  await Register.create({
		name,
		email,
		password: hashed,
		token: verificationToken,
		isVerified: false,
	  });
  
	  await transporter.sendMail(mailOptions);
  
	  return res.status(201).json({
		msg: 'Email verifikasi telah dikirim',
	  });
	} catch (error: any) {
	  return res.status(500).send(Helper.ResponseData(500, '', error, null));
	}
  };

  const VerifyToken = async (req: Request, res: Response): Promise<any> => {
	
  }


const RegisterUser = async (req: Request, res: Response): Promise<Response> => {
	try {
		const { name, email, password, confirmPassword } = req.body;

		const hashed = await PasswordHelper.PasswordHashing(password);

		const user = await User.create({
			name,
			email,
			password: hashed,
			active: true,
			verified: true,
			roleId: 3
		});

		return res.status(201).send(Helper.ResponseData(201, "Created", null, user));
	} catch (error: any) {
		return res.status(500).send(Helper.ResponseData(500, "", error, null));
	}
};

const SignInwithGoogle = async (req: Request, res: Response): Promise<Response> => {
	try {
		const { name, email,photoUrl, accessToken, verified } = req.body;

		const existingUser = await User.findOne({
			where: {
			  email: email,
			},
		  });
	  
		  if (existingUser) {
			// Jika email sudah terdaftar, kirim respons dengan pesan kesalahan
			return res.status(400).send(Helper.ResponseData(400, "Email already exists", null, null));
		  }

		const user = await User.create({
			name,
			email,
			photoUrl,
			accessToken,
			// gambar nnti ada gambar
			active: true,
			verified,
			roleId: 3
		});

		return res.status(201).send(Helper.ResponseData(201, "Created", null, user));
	} catch (error: any) {
		return res.status(500).send(Helper.ResponseData(500, "", error, null));
	}
};

const UserLogin = async (req: Request, res: Response): Promise<Response> => {
	try {
		const { email } = req.body;
		const user = await User.findOne({
			where: {
				email: email
			}
		});

		if (!user) {
			return res.status(401).send(Helper.ResponseData(401, "Unauthorized", null, null));
		}

		const dataUser = {
			name: user.name,
			email: user.email,
			roleId: user.roleId,
			verified: user.verified,
			active: user.active
		};
		const token = Helper.GenerateToken(dataUser);
		const refreshToken = Helper.GenerateRefreshToken(dataUser);

		user.accessToken = refreshToken;
		await user.save();
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000
		});

		const responseUser = {
			name: user.name,
			email: user.email,
			roleId: user.roleId,
			verified: user.verified,
			active: user.active,
			token: token
		}
		return res.status(200).send(Helper.ResponseData(200, "OK", null, responseUser));
	} catch (error) {
		return res.status(500).send(Helper.ResponseData(500, "", error, null));
	}
};

const RefreshToken = async (req: Request, res: Response): Promise<Response> => {
	try {
		const refreshToken = req.cookies?.refreshToken;

		if (refreshToken === null) {
			// console.log(refreshToken)
			return res.status(401).send(Helper.ResponseData(401, "Unauthorized", null, null));
		};

		const decodedUser = Helper.ExtractRefreshToken(refreshToken);
		// console.log(decodedUser);
		if (!decodedUser) {
			return res.status(401).send(Helper.ResponseData(401, "Una", null, null));
		};

		const token = Helper.GenerateToken({
			name: decodedUser.name,
			email: decodedUser.email,
			roleId: decodedUser.roleId,
			verified: decodedUser.verified,
			active: decodedUser.active
		});

		const resultUser = {
			name: decodedUser.name,
			email: decodedUser.email,
			roleId: decodedUser.roleId,
			verified: decodedUser.verified,
			active: decodedUser.active,
			token: token
		}

		return res.status(200).send(Helper.ResponseData(200, "OK", null, resultUser));

	} catch (error) {
		return res.status(500).send(Helper.ResponseData(500, "", error, null));
	}
};

const UserDetail = async (req: Request, res: Response): Promise<Response> => {
	try {
		const email = res.locals.userEmail;
		const user = await User.findOne({
			where: {
				email: email
			},
			attributes: { exclude: ['roleId'] },// Mengexklusikan kolom 'roleId' dari hasil query
			include: {
				model: Role,
				attributes: ["id", "roleName"]
			}
		});

		if (!user) {
			return res.status(404).send(Helper.ResponseData(404, "User not found", null, null));
		}

		user.password = "";
		user.accessToken = "";
		return res.status(200).send(Helper.ResponseData(200, "OK", null, user));
	} catch (error) {
		return res.status(500).send(Helper.ResponseData(500, "", error, null));
	}
};

const UserLogout = async (req: Request, res: Response): Promise<Response> => {
	try {
		const refreshToken = req.cookies?.refreshToken;
		if (refreshToken === null) {
			// console.log(refreshToken)
			return res.status(200).send(Helper.ResponseData(200, "User logoutada", null, null));
		}
		const email = res.locals.userEmail;
		const user = await User.findOne({
			where: {
				email: email
			}
		});

		if (!user) {
			res.clearCookie("refreshToken");
			await new Promise<void>((resolve, reject) => {
				req.session.destroy((err: any) => {
				  if (err) reject(err);
				  resolve();
				});
			  });
			return res.status(200).send(Helper.ResponseData(200, "User logout", null, null));
		}

		await user.update({ accessToken: null }, { where: { email: email } });
		res.clearCookie("refreshToken");
		await new Promise<void>((resolve, reject) => {
			req.session.destroy((err: any) => {
			  if (err) reject(err);
			  resolve();
			});
		  });
		return res.status(200).send(Helper.ResponseData(200, "User logout", null, null));
	} catch (error) {
		return res.status(500).send(Helper.ResponseData(500, "", error, null));
	}
}

export default {RegisterUser, UserLogin, RefreshToken, UserDetail, UserLogout, SignInwithGoogle, SignUp };