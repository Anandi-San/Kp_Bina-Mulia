import { Request, Response } from "express";
import User from "../db/models/User";
import Role from "../db/models/Role";
import Helper from "../helpers/Helper";
import multer, { Multer } from 'multer';
import path from "path"
import moment from 'moment-timezone';
import fs from "fs"

const upload: Multer = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/img/profile');
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const now = moment().tz('Asia/Makassar').format('YYYYMMDD');
        const filename = `${now}_${file.originalname}`;
        cb(null, filename);
      }
    })
  });

const GetAllUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const users = await User.findAll({
            attributes: ["name","email","photoUrl","verified","active"],
            include: {
				model: Role,
				attributes: ["roleName"]
			}
        });
        if (!users) {
			return res.status(404).send(Helper.ResponseData(404, "Message not found", null, null));
		}
        return res.status(200).json({
            status: 201,
            message: "Get All User",
            data: users
        });
    } catch (error) {
        console.error("Error retrieving users:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const GetUserById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.params.id;
      const user = await User.findByPk(userId, {
        attributes: ["name", "email", "photoUrl", "verified", "active"],
        include: {
          model: Role,
          attributes: ["roleName"],
        },
      });
      
      if (!user) {
        return res.status(404).send(Helper.ResponseData(404, "User not found", null, null));
      }
      
      return res.status(200).json({
        status: 200,
        message: "Get User By ID",
        data: user,
      });
    } catch (error) {
      console.error("Error retrieving user:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../uploads/img/user"));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix + ext);
    },
  });
  
  // Membuat middleware upload menggunakan multer  
  const UpdateUserByUser = async (req: Request, res: Response): Promise<any> => {
    try {
      const id = req.params.id;
      const { name } = req.body;
  
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).send(Helper.ResponseData(404, "User not found", null, null));
      }
  
      upload.single("image")(req, res, async (err: any) => {
        if (err) {
          return res.status(400).send({
            status: 400,
            message: "Failed to upload image",
            errors: err,
          });
        }
  
        if (req.file) {
          const image = req.file;
          const imageName = image.filename;
          console.log(image);
  
          // Menghapus gambar lama jika ada
          if (user.photoUrl) {
            const oldImagePath = path.join(__dirname, "../uploads/img/profile", user.photoUrl);
            fs.unlinkSync(oldImagePath);
            console.log("Old image deleted:", user.photoUrl);
          }
  
          user.photoUrl = imageName;
          console.log("New image:", imageName);
        }

        user.password = "";
		user.accessToken = "";
        user.name = name;
        await user.save();
  
        return res.status(200).json({
          status: 200,
          message: "User updated successfully",
          data: user,
        });
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

const UpdateUserByAdmin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.params.id;
    const { name, email, roleId, active } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send(Helper.ResponseData(404, "User not found", null, null));
    }

    const role = await Role.findByPk(roleId);
    if (!role) {
      return res.status(404).send(Helper.ResponseData(404, "Role not found", null, null));
    }

    user.name = name;
    user.email = email;
    user.roleId = roleId;
    user.active = active;
    user.password = "";
	user.accessToken = "";

    await user.save();

    return res.status(200).json({
      status: 200,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const DeleteUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.params.id;
  
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).send(Helper.ResponseData(404, "User not found", null, null));
      }
  
      await user.destroy();
  
      return res.status(200).json({
        status: 200,
        message: "User deleted successfully",
        data: null,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  

export default {GetAllUser, GetUserById, UpdateUserByUser, UpdateUserByAdmin, DeleteUser    }