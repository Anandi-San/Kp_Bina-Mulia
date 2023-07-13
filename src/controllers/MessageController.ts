import { Request, Response } from "express";
import Message from "../db/models/Message";
import User from "../db/models/User";
import Helper from "../helpers/Helper";
import session from "express-session";

const getMessage = async (req: Request, res: Response): Promise<Response> => {
    try {
		const message = await Message.findAll({
			attributes: ["message"],
			include: {
				model: User,
				attributes: ["id", "name" , "photoUrl"]
			}
		});

		if (!message) {
			return res.status(404).send(Helper.ResponseData(404, "Message not found", null, null));
		}
		return res.status(200).send(Helper.ResponseData(200, "OK", null, message));
	} catch (error) {
		return res.status(500).send(Helper.ResponseData(500, "", error, null));
	}
};

interface CustomSession extends session.Session {
	userId?: number;
  }

  const createMessage = async (req: Request, res: Response): Promise<any> => {
    try {
      const customSession = req.session as CustomSession;
      const userId = customSession.userId;
  
      const { message } = req.body;
  
      const createdMessage = await Message.create({
        message,
        userId: userId
      });
  
      return res.status(201).json({
        status: 201,
        message: "Pesan berhasil dibuat",
        errors: null,
        data: createdMessage
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Terjadi kesalahan dalam server",
        errors: error,
        data: null
      });
    }
  };
  
  const deleteMessage = async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
  
      const message = await Message.findByPk(id);
      if (!message) {
        return res.status(404).json({
          status: 404,
          message: "Message not found",
          errors: null,
          data: null
        });
      }
  
      await message.destroy();
  
      return res.status(200).json({
        status: 200,
        message: "Message deleted successfully",
        errors: null,
        data: null
      });
    } catch (error) {
    return res.status(500).json({
        status: 500,
        message: "An error occurred while deleting the message",
        errors: error,
        data: null
        });
    }
};

  export default {getMessage, createMessage, deleteMessage};
  