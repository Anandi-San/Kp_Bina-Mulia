import { Request, Response } from "express";
import Berita from "../db/models/Berita";
import User from "../db/models/User";
import multer, { Multer} from 'multer';
import path from "path"
import moment from 'moment-timezone';
import fs from "fs";
import session from "express-session";



const upload: Multer = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/img/Berita');
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const now = moment().tz('Asia/Makassar').format('YYYYMMDD');
        const filename = `${now}_${file.originalname}`;
        cb(null, filename);
      }
    })
  });

  const GetBerita = async (req: Request, res: Response): Promise<Response> => {
    try {
      const berita = await Berita.findAll({
        order: [['createdAt', 'DESC']]
      });
  
      const baseUrl = "http://localhost:7000"; // Your backend base URL here
      const beritaWithImageUrls = berita.map((item) => ({
        ...item.toJSON(), // Convert the Sequelize model instance to a plain JavaScript object
        image1: `${baseUrl}/images/Berita/${item.image1}`,
        image2: `${baseUrl}/images/Berita/${item.image2}`,
        image3: `${baseUrl}/images/Berita/${item.image3}`,
      }));
  
      return res.status(200).send({
        data: beritaWithImageUrls
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
  
  

  const GetBeritaById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const beritaId: number = Number(req.params.id);
      const berita = await Berita.findOne({
        where: {
          id: beritaId
        },
        include: {
          model: User,
          attributes: ["name"]
        }
      });
  
      if (!berita) {
        return res.status(404).send({
          status: 404,
          message: "Berita not found",
          errors: null
        });
      }
  
      const baseUrl = "http://localhost:7000"; // Your backend base URL here
  
      const beritaData = {
        ...berita.toJSON(),
        image1: `${baseUrl}/images/Berita/${berita.image1}`,
        image2: `${baseUrl}/images/Berita/${berita.image2}`,
        image3: `${baseUrl}/images/Berita/${berita.image3}`,
      };
  
      return res.status(200).send({
        data: beritaData
      });
    } catch (error) {
      return res.status(500).send({
        status: 500,
        message: "Internal server error",
        errors: error
      });
    }
  };
  
  interface CustomSession extends session.Session {
    userId?: number;
    }

    const createBerita = async (req: Request, res: Response): Promise<any> => {
      try {
        upload.array('images', 3)(req, res, async (err) => {
          if (err) {
            return res.status(400).send({
              status: 400,
              message: 'Failed to upload Berita',
              errors: err
            });
          }
    
          const images: string[] = [];
          if (req.files && Array.isArray(req.files)) {
            const files = req.files as Express.Multer.File[];
    
            for (let i = 0; i < files.length; i++) {
              const file = files[i];
              images.push(file.filename);
            }
          }
    
          const customSession = req.session as CustomSession;
          const userId = customSession.userId;
    
          const { title, deskripsi } = req.body;
    
          const berita = await Berita.create({
            title,
            userId,
            deskripsi,
            image1: images[0],
            image2: images[1],
            image3: images[2]
          });
    
          // Assuming 'berita' contains image filenames (e.g., '20230726_babymetal.jpg')
          // Update 'image1' property with the full image URL
          const baseUrl = "http://localhost:7000"; // Your backend base URL here
          const beritaWithImageUrls = {
            ...berita.toJSON(), // Convert the Sequelize model instance to a plain JavaScript object
            image1: `${baseUrl}/src/uploads/img/Berita/${berita.image1}`,
            image2: `${baseUrl}/src/uploads/img/Berita/${berita.image2}`,
            image3: `${baseUrl}/src/uploads/img/Berita/${berita.image3}`,
          };
    
          return res.status(201).send({
            status: 201,
            message: 'Berita created successfully',
            data: beritaWithImageUrls
          });
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
          message: 'Internal server error',
          errors: error
        });
      }
    };
    

  const updateBerita = async (req: Request, res: Response): Promise<any> => {
    try {
      upload.array('Images', 3)(req, res, async (err: any) => {
        if (err) {
          return res.status(400).send({
            status: 400,
            message: 'Failed to upload images',
            errors: err
          });
        }
  
        const beritaId: number = Number(req.params.id);
        const { title, deskripsi, userId } = req.body;
  
        let berita: Berita | null = await Berita.findByPk(beritaId);
        if (!berita) {
          return res.status(404).send({
            status: 404,
            message: 'Berita not found',
            errors: null
          });
        }
  
        const images: (string | null)[] = [null, null, null];
  
        if (req.files && Array.isArray(req.files)) {
          const files = req.files as Express.Multer.File[];
  
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            images[i] = file.filename;
          }
  
          // Menghapus gambar lama jika ada
          if (berita.image1) {
            const oldImagePath1 = path.join(__dirname, '../uploads/img/Berita', berita.image1);
            fs.unlinkSync(oldImagePath1);
          }
  
          if (berita.image2) {
            const oldImagePath2 = path.join(__dirname, '../uploads/img/Berita', berita.image2);
            fs.unlinkSync(oldImagePath2);
          }
  
          if (berita.image3) {
            const oldImagePath3 = path.join(__dirname, '../uploads/img/Berita', berita.image3);
            fs.unlinkSync(oldImagePath3);
          }
  
          berita.image1 = images[0]!;
          berita.image2 = images[1]!;
          berita.image3 = images[2]!;
        }
  
        berita.title = title;
        berita.deskripsi = deskripsi;
        berita.userId = userId;
  
        await berita.save();
  
        return res.status(200).send({
          status: 200,
          message: 'Berita updated successfully',
          data: berita
        });
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
        message: 'Internal server error',
        errors: error
      });
    }
  };

  const deleteBerita = async (req: Request, res: Response): Promise<any> => {
    try {
      const beritaId: number = Number(req.params.id);
  
      const berita: Berita | null = await Berita.findByPk(beritaId);
      if (!berita) {
        return res.status(404).send({
          status: 404,
          message: 'Berita not found',
          errors: null
        });
      }
  
      // Menghapus file gambar jika ada
      if (berita.image1) {
        const imagePath1 = path.join(__dirname, '../uploads/img/Berita', berita.image1);
        fs.unlinkSync(imagePath1);
      }
  
      if (berita.image2) {
        const imagePath2 = path.join(__dirname, '../uploads/img/Berita', berita.image2);
        fs.unlinkSync(imagePath2);
      }
  
      if (berita.image3) {
        const imagePath3 = path.join(__dirname, '../uploads/img/Berita', berita.image3);
        fs.unlinkSync(imagePath3);
      }
  
      await berita.destroy();
  
      return res.status(200).send({
        status: 200,
        message: 'Berita deleted successfully',
        data: null
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
        message: 'Internal server error',
        errors: error
      });
    }
  };

  export default {GetBerita, GetBeritaById, createBerita, updateBerita, deleteBerita};