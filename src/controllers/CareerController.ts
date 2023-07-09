import { Request, Response } from "express";
import Career from "../db/models/Career";
import { Op } from 'sequelize';

const getCareer = async (req: Request, res: Response): Promise<Response> => {
    try {
      const career = await Career.findAll();
      return res.status(200).send({
        status: 200,
        message: "get All Carerr",
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

  const GetCareerById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const careerId: number = Number(req.params.id);
      const career = await Career.findByPk(careerId);
  
      if (!career) {
        return res.status(404).send({
          status: 404,
          message: "Career not found",
          errors: null
        });
      }
  
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

  const CreateCareer = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { title, posisi, kualifikasi, jobdesc, penempatan, deadline, link  } = req.body;
  
      const create = await Career.create({
        title,
        posisi,
        kualifikasi,
        jobdesc,
        penempatan,
        deadline,
        link 
      });
  
      return res.status(201).send({
        data: create
      });
    } catch (error:any) {
      if (error != null && error instanceof Error) {
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
  }

  const UpdateCareer = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const { title, posisi, kualifikasi, jobdesc, penempatan, deadline, link } = req.body;
  
      const career = await Career.findByPk(id);
  
      if (!career) {
        return res.status(404).send({
          status: 404,
          message: "Data Not Found",
          data: null
        });
      }
  
      career.title = title;
      career.posisi = posisi;
      career.kualifikasi = kualifikasi;
      career.jobdesc = jobdesc;
      career.penempatan = penempatan;
      career.deadline = deadline;
      career.link = link;
  
      await career.save();
  
      return res.status(200).send({
        status: 200,
        message: "OK",
        data: career
      });
    } catch (error: any) {
      if (error != null && error instanceof Error) {
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

  const DeleteCareer = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
  
      const career = await Career.findByPk(id);
  
      if (!career) {
        return res.status(404).send({
          status: 404,
          message: "Data Not Found",
          data: null
        });
      }
  
      const currentDate = new Date();
  
      if (career.deadline <= currentDate) {
        // Jika deadline telah tercapai, set deletedAt ke waktu sekarang
        career.deletedAt = currentDate;
        await career.save();
      } else {
        // Jika deadline belum tercapai, hapus data secara permanen
        await career.destroy({ force: false });
      }
  
      return res.status(200).send({
        status: 200,
        message: "Deleted",
        data: null
      });
    } catch (error: any) {
      if (error != null && error instanceof Error) {
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



  export default {getCareer, GetCareerById, CreateCareer, UpdateCareer, DeleteCareer}
