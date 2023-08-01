import { Request, Response } from "express";
import Role from "../db/models/Role";
import User from "../db/models/User";
import Register from "../db/models/Register";
import nodemailer from "nodemailer";
import Mailgen from 'mailgen'
import Helper from "../helpers/Helper";
import PasswordHelper from "../helpers/PasswordHelper";
import dotenv from "dotenv";
import session from 'express-session';

dotenv.config();

const SignUp = async (req: Request, res: Response): Promise<any> => {
	try {
	  const { name, email, password ,confirmPassword} = req.body;

	  const hashed = await PasswordHelper.PasswordHashing(password);
  
	  // Buat transporter Nodemailer menggunakan konfigurasi Gmail
	  const transporter = nodemailer.createTransport({
		// host: 'smtp.gmail.com',
		// port: 465,
		// secure: true,
		service: 'gmail',
		auth: {
		  user: process.env.USER_EMAIL,
		  pass: process.env.USER_PASS,
		},
	  });
  
	  const verificationToken = Helper.generateVerificationToken();
	  const verificationLink = `http://localhost:7000/verify/${verificationToken}`;
  
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
	try {
	  const { token } = req.params;
	  const registerData = await Register.findOne({ where: { token: token as string } });

  
	  if (!registerData) {
		  return res.status(404).json({
		  msg: 'Invalid verification token',
		});
	  }
  
	  registerData.isVerified = true;
	  await registerData.save();
  
	  const { name, email, password } = registerData;
	  await User.create({
		name,
		email,
		password,
		roleId: 3,
		verified: true,
		active: true,
	  });
  
	  await Register.destroy({ where: { token: token as string } });

	//   redirect front End
	//   return res.redirect('http://localhost:3000/login');
  
	  return res.status(200).json({
		msg: 'Verification successful. Data has been transferred to the User table.',
	  });
	} catch (error: any) {
	  return res.status(500).send(Helper.ResponseData(500, '', error, null));
	}
  };

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

interface CustomSession extends session.Session {
	userId?: number;
  }

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

		// makai password
		// const matched = await PasswordHelper.PasswordCompare(user.password, password);
		// if (!matched) {
		// 	return res.status(401).send(Helper.ResponseData(401, "Unauthorized", null, null));
		// }
		const customSession = req.session as CustomSession;
		customSession.userId = user.id;
		console.log(user.id)
		const dataUser = {
			id: user.id,
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
			id: user.id,
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

		const baseUrl = "http://localhost:7000"; // Your backend base URL here

    // Assuming 'user.photo' contains the photo filename (e.g., 'user123.jpg')
    	user.photoUrl =`${baseUrl}/images/users/${user.photoUrl}`;

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

const resetPassword = async (req: Request, res: Response): Promise<Response> => {
	try {
	  const { email, oldPassword, newPassword, confirmPassword } = req.body;

	  const hashed = await PasswordHelper.PasswordHashing(newPassword);
  
	  if (newPassword !== confirmPassword) {
		return res.status(400).send(Helper.ResponseData(400, "Password and confirm password do not match", null, null));
	  }
  
	  const user = await User.findOne({ where: { email } });
  
	  if (!user) {
		return res.status(404).send(Helper.ResponseData(404, "User not found", null, null));
	  }
  
	  const isPasswordValid = await PasswordHelper.PasswordCompare(user.password, oldPassword);
      if (!isPasswordValid) {
        return res.status(401).json({ msg: "Password lama tidak cocok" });
      }
  
	  user.password = hashed;
	  await user.save();
  
	  return res.status(200).send(Helper.ResponseData(200, "Password has been reset successfully", null, null));
	} catch (error) {
	  return res.status(500).send(Helper.ResponseData(500, "", error, null));
	}
  };
  

export default {RegisterUser, UserLogin, RefreshToken, UserDetail, UserLogout, SignInwithGoogle, SignUp, VerifyToken, resetPassword };