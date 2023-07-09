import { Request, Response } from "express";
import Career from "../db/models/Career";

const getCareer = async (req: Request, res: Response): Promise<Response> => {
    try {
      const career = await Career.findAll();
      return res.status(200).send({
        data: career
      });
    } catch (error: any) {
      if (error instanceof Error) {
        return res.status(500).send({
          status: 500,
          message: error.message,
          errors: error
        });
      }
      return res.status(500).send({
        status: 500,
        message: "Internal server error",
        errors: error
      });
    }
  };


  export default {getCareer}
