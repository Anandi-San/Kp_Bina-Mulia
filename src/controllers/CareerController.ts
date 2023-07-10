import { Request, Response } from "express";
import Career from "../db/models/Career";
import { convertToMakassarTime } from '../helpers/timezone';
import moment from 'moment-timezone';
import { Op } from "sequelize";
import cron from 'node-cron';

const getCareer = async (req: Request, res: Response): Promise<Response> => {
  try {
    const careers = await Career.findAll({
      attributes: ["title", "posisi", "kualifikasi", "jobdesc", "penempatan", "deadline", "link"]
    });

    //dengan memakai koma
    const careerData = careers.map((career) => {
      const specializationKualifikasi = career.kualifikasi.trim().split(',');

      const specializationObjects = specializationKualifikasi.map((kualifikasi, index) => {
        return {
          id: index + 1,
          listkualifikasi : "- " + kualifikasi.trim()
        };
      });
      //dengan memakai garis baru
      const jobdescArray = career.jobdesc.trim().split('\n');

      const jobdescObjects = jobdescArray.map((jobdesc, index) => {
        return {
          id: index + 1,
          description: jobdesc.trim()
        };
      });

      return {
        title: career.title,
        posisi: career.posisi,
        kualifikasi: specializationObjects,
        jobdesc: jobdescObjects,
        penempatan: career.penempatan,
        deadline: career.deadline,
        link: career.link,
      };
    });

    return res.status(200).send({
      status: 200,
      message: "Get All Careers",
      data: careerData
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

    const specializationArray = career.kualifikasi.trim().split(',');

    const specializationObjects = specializationArray.map((kualifikasi, index) => {
      return {
        id: index + 1,
        description: kualifikasi.trim()
      };
    });

    const jobdescArray = career.jobdesc.trim().split('\n');

    const jobdescObjects = jobdescArray.map((jobdesc, index) => {
      return {
        id: index + 1,
        description: jobdesc.trim()
      };
    });

    const careerData = {
      title: career.title,
      posisi: career.posisi,
      kualifikasi: specializationObjects,
      jobdesc: jobdescObjects,
      penempatan: career.penempatan,
      deadline: career.deadline,
      link: career.link
    };

    return res.status(200).send({
      data: careerData
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
    };
  };

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
          message: 'Career not found',
          data: null,
        });
      }
  
      const currentDate = convertToMakassarTime(new Date());
      console.log(currentDate);
      const deadline = convertToMakassarTime(career.deadline);
      console.log(career.deadline);
  
      if (currentDate > deadline) {
        career.deletedAt = currentDate;
        console.log(career.deletedAt);
        console.log(currentDate);
        await career.save();
  
        return res.status(200).send({
          status: 200,
          message: 'Career deleted',
          data: null,
        });
      } else {
        return res.status(400).send({
          status: 400,
          message: 'Deadline has not passed yet',
          data: null,
        });
      }
    } catch (error: any) {
      if (error instanceof Error) {
        return res.status(500).send({
          status: 500,
          message: error.message,
          errors: error,
        });
      }
  
      return res.status(500).send({
        status: 500,
        message: 'Internal server error',
        errors: error,
      });
    }
  };

  export const deleteExpiredCareers = async () => {
    try {
      const currentDate = convertToMakassarTime(new Date());
  
      // Ambil semua karier yang memiliki tanggal deadline kurang dari tanggal saat ini
      const expiredCareers = await Career.findAll({
        where: {
          deadline: {
            [Op.lt]: currentDate,
          },
        },
      });
  
      // Soft delete karier yang sudah lewat deadline
      for (const career of expiredCareers) {
        career.deletedAt = currentDate;
        await career.save();
      }
  
      console.log('Expired careers deleted:', expiredCareers.length);
    } catch (error) {
      console.error('Error deleting expired careers:', error);
    }
  };
  
  
  // Fungsi untuk menjalankan tugas penjadwalan
  export const scheduleCareerDeletion = () => {
    // Jalankan fungsi deleteExpiredCareers setiap menit
    cron.schedule('* * * * *', deleteExpiredCareers);
  };
  

export default {getCareer, GetCareerById, CreateCareer, UpdateCareer, DeleteCareer, scheduleCareerDeletion}
