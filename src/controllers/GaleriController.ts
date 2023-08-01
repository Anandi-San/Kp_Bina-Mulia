import { Request, Response } from "express";
import Galeri from "../db/models/Galeri";
import multer, { Multer} from 'multer';
import path from "path"
import moment from 'moment-timezone';
import fs from "fs"

const upload: Multer = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/img/Galeri');
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const now = moment().tz('Asia/Makassar').format('YYYYMMDD');
        const filename = `${now}_${file.originalname}`;
        cb(null, filename);
      }
    })
  });


  const GetGaleri = async (req: Request, res: Response): Promise<Response> => {
    try {
      const galeri = await Galeri.findAll({
      order: [['createdAt', 'DESC']]
      });

      const baseUrl = "http://localhost:7000"; // Your backend base URL here
      const GaleriWithImageUrls = galeri.map((item) => ({
        ...item.toJSON(), // Convert the Sequelize model instance to a plain JavaScript object
        gambar1: `${baseUrl}/images/Galeri/${item.gambar1}`,
        gambar2: `${baseUrl}/images/Galeri/${item.gambar2}`,
        gambar3: `${baseUrl}/images/Galeri/${item.gambar3}`,
        gambar4: `${baseUrl}/images/Galeri/${item.gambar4}`,
        gambar5: `${baseUrl}/images/Galeri/${item.gambar5}`,
        gambar6: `${baseUrl}/images/Galeri/${item.gambar6}`,
        gambar7: `${baseUrl}/images/Galeri/${item.gambar7}`,
        gambar8: `${baseUrl}/images/Galeri/${item.gambar8}`,
      }));


      return res.status(200).send({
        status: 201,
        message: "show all Galeri",
        data: GaleriWithImageUrls
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

  const GetGaleriById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const galeriId: number = Number(req.params.id);
      const galeri = await Galeri.findOne({
        where: {
          id: galeriId
        },
      });
      if (!galeri) {
        return res.status(404).send({
          status: 404,
          message: "Galeri not found",
          errors: null
        });
      }
  
      const baseUrl = "http://localhost:7000"; // Your backend base URL here
      const galeriWithImageUrls = {
        ...galeri.toJSON(),
        gambar1: `${baseUrl}/images/Galeri/${galeri.gambar1}`,
        gambar2: `${baseUrl}/images/Galeri/${galeri.gambar2}`,
        gambar3: `${baseUrl}/images/Galeri/${galeri.gambar3}`,
        gambar4: `${baseUrl}/images/Galeri/${galeri.gambar4}`,
        gambar5: `${baseUrl}/images/Galeri/${galeri.gambar5}`,
        gambar6: `${baseUrl}/images/Galeri/${galeri.gambar6}`,
        gambar7: `${baseUrl}/images/Galeri/${galeri.gambar7}`,
        gambar8: `${baseUrl}/images/Galeri/${galeri.gambar8}`,
      };
  
      return res.status(200).send({
        status: 200,
        message: "Get Galeri by id",
        data: galeriWithImageUrls
      });
    } catch (error: any) {
      return res.status(500).send({
        status: 500,
        message: "Internal server error",
        errors: error
      });
    }
  };
  

  const createGaleri = async (req: Request, res: Response): Promise<any> => {
    try {
      upload.array('images', 8)(req, res, async (err) => {
        if (err) {
          return res.status(400).send({
            status: 400,
            message: 'Failed to upload Galeri',
            errors: err
          });
        }
  
        const images: (string | null)[] = [null, null, null];
        if (req.files && Array.isArray(req.files)) {
          const files = req.files as Express.Multer.File[];
  
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            images[i] = file.filename;
          }
        }
  
        const { title, tanggal, lokasi, } = req.body;
  
        const galeri = await Galeri.create({
          title,
          tanggal,
          lokasi,
          gambar1: images[0],
          gambar2: images[1],
          gambar3: images[2],
          gambar4: images[3],
          gambar5: images[4],
          gambar6: images[5],
          gambar7: images[6],
          gambar8: images[7],
        });
  
        return res.status(201).send({
          status: 201,
          message: 'Galeri created successfully',
          data: galeri
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

  const updateGaleri = async (req: Request, res: Response): Promise<any> => {
    try {
      upload.array('Images', 8)(req, res, async (err: any) => {
        if (err) {
          return res.status(400).send({
            status: 400,
            message: 'Failed to upload images',
            errors: err
          });
        }
  
        const galeriId: number = Number(req.params.id);
        const { title, tanggal, lokasi } = req.body;
  
        let galeri: Galeri | null = await Galeri.findByPk(galeriId);
        if (!galeri) {
          return res.status(404).send({
            status: 404,
            message: 'Galeri not found',
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
          if (galeri.gambar1) {
            const oldImagePath1 = path.join(__dirname, '../uploads/img/Galeri', galeri.gambar1);
            fs.unlinkSync(oldImagePath1);
          }
  
          if (galeri.gambar2) {
            const oldImagePath2 = path.join(__dirname, '../uploads/img/Galeri', galeri.gambar2);
            fs.unlinkSync(oldImagePath2);
          }
  
          if (galeri.gambar3) {
            const oldImagePath3 = path.join(__dirname, '../uploads/img/Galeri', galeri.gambar3);
            fs.unlinkSync(oldImagePath3);
          }

          if (galeri.gambar4) {
            const oldImagePath4 = path.join(__dirname, '../uploads/img/Galeri', galeri.gambar4);
            fs.unlinkSync(oldImagePath4);
          }

          if (galeri.gambar5) {
            const oldImagePath5 = path.join(__dirname, '../uploads/img/Galeri', galeri.gambar5);
            fs.unlinkSync(oldImagePath5);
          }

          if (galeri.gambar6) {
            const oldImagePath6 = path.join(__dirname, '../uploads/img/Galeri', galeri.gambar6);
            fs.unlinkSync(oldImagePath6);
          }

          if (galeri.gambar7) {
            const oldImagePath7 = path.join(__dirname, '../uploads/img/Galeri', galeri.gambar7);
            fs.unlinkSync(oldImagePath7);
          }

          if (galeri.gambar8) {
            const oldImagePath8 = path.join(__dirname, '../uploads/img/Galeri', galeri.gambar8);
            fs.unlinkSync(oldImagePath8);
          }
  
          galeri.gambar1 = images[0]!;
          galeri.gambar2 = images[1]!;
          galeri.gambar3 = images[2]!;
          galeri.gambar4 = images[3]!;
          galeri.gambar5 = images[4]!;
          galeri.gambar6 = images[5]!;
          galeri.gambar7 = images[6]!;
          galeri.gambar8 = images[7]!;
        }
  
        galeri.title = title;
        galeri.tanggal = tanggal;
        galeri.lokasi = lokasi;
  
        await galeri.save();
  
        return res.status(200).send({
          status: 200,
          message: 'Galeri updated successfully',
          data: galeri
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


  const deleteGaleri = async (req: Request, res: Response): Promise<any> => {
    try {
      const galeriId: number = Number(req.params.id);
  
      const galeri: Galeri | null = await Galeri.findByPk(galeriId);
      if (!galeri) {
        return res.status(404).send({
          status: 404,
          message: 'Galeri not found',
          errors: null
        });
      }

      if (galeri.gambar1) {
        const imagePath1 = path.join(__dirname, '../uploads/img/Galeri', galeri.gambar1);
        fs.unlinkSync(imagePath1);
      }
  
      if (galeri.gambar2) {
        const imagePath2 = path.join(__dirname, '../uploads/img/Galeri', galeri.gambar2);
        fs.unlinkSync(imagePath2);
      }
  
      if (galeri.gambar3) {
        const imagePath3 = path.join(__dirname, '../uploads/img/Galeri', galeri.gambar3);
        fs.unlinkSync(imagePath3);
      }

      if (galeri.gambar4) {
        const imagePath4 = path.join(__dirname, '../uploads/img/Galeri', galeri.gambar4);
        fs.unlinkSync(imagePath4);
      }

      if (galeri.gambar5) {
        const imagePath5 = path.join(__dirname, '../uploads/img/Galeri', galeri.gambar5);
        fs.unlinkSync(imagePath5);
      }

      if (galeri.gambar6) {
        const imagePath6 = path.join(__dirname, '../uploads/img/Galeri', galeri.gambar6);
        fs.unlinkSync(imagePath6);
      }

      if (galeri.gambar7) {
        const imagePath7 = path.join(__dirname, '../uploads/img/Galeri', galeri.gambar7);
        fs.unlinkSync(imagePath7);
      }

      if (galeri.gambar8) {
        const imagePath8 = path.join(__dirname, '../uploads/img/Galeri', galeri.gambar8);
        fs.unlinkSync(imagePath8);
      }
  
      await galeri.destroy();
  
      return res.status(200).send({
        status: 200,
        message: 'Galeri deleted successfully',
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



export default {GetGaleri, GetGaleriById, createGaleri, updateGaleri, deleteGaleri }