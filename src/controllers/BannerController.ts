import { Request, Response } from "express";
import Banner from "../db/models/Banner";
import multer, { Multer } from 'multer';
import path from "path"
import moment from 'moment-timezone';
import fs from "fs"

const upload: Multer = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '../uploads/img/banner');
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const now = moment().tz('Asia/Makassar').format('YYYYMMDD');
      const filename = `${now}_${file.originalname}`;
      cb(null, filename);
    }
  })
});

const GetBanner = async (req: Request, res: Response): Promise<Response> => {
  try {
    const banner = await Banner.findAll({
      order: [['createdAt', 'DESC']] // Menyortir data berdasarkan kolom createdAt secara descending (terbaru ke terlama)
    });

    const baseUrl = "http://localhost:7000"; // Your backend base URL here
      const bannerwithurl = banner.map((item) => ({
        ...item.toJSON(), // Convert the Sequelize model instance to a plain JavaScript object
        banner: `${baseUrl}/images/banner/${item.banner}`,
      }));

    return res.status(200).send({
      data: bannerwithurl
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

const GetBannerById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const bannerId: number = Number(req.params.id);
    const banner = await Banner.findByPk(bannerId);

    if (!banner) {
      return res.status(404).send({
        status: 404,
        message: "Banner not found",
        errors: null
      });
    }

    return res.status(200).send({
      data: banner
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

const createBanner = async (req: Request, res: Response): Promise<any> => {
  try {
    upload.single('bannerImage')(req, res, async (err) => {
      if (err) {
        return res.status(400).send({
          status: 400,
          message: 'Failed to upload Banner',
          errors: err
        });
      }

      if (!req.file) {
        return res.status(400).send({
          status: 400,
          message: 'No image file uploaded',
          errors: null
        });
      }
      const bannerImage = req.file;
      const imageName = bannerImage.filename;

      // const { title, subtitle } = req.body;

      const banner = await Banner.create({
        // title,
        // subtitle,
        banner: imageName
      });

      return res.status(201).send({
        status: 201,
        message: 'Banner created successfully',
        data: banner
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

const updateBanner = async (req: Request, res: Response): Promise<any> => {
  try {
    upload.single('bannerImage')(req, res, async (err: any) => {
      if (err) {
        return res.status(400).send({
          status: 400,
          message: 'Failed to upload image',
          errors: err
        });
      }

      const bannerId: number = Number(req.params.id);
      const { title, subtitle } = req.body;

      const banner: Banner | null = await Banner.findByPk(bannerId);
      if (!banner) {
        return res.status(404).send({
          status: 404,
          message: 'Banner not found',
          errors: null
        });
      }

      if (req.file) {
        const bannerImage = req.file;
        const imageName = bannerImage.filename;
        console.log(bannerImage)

        // Menghapus gambar lama jika ada
        if (banner.banner) {
          const oldImagePath = path.join(__dirname, '../uploads/img/banner', banner.banner);
          fs.unlinkSync(oldImagePath);
          // console.log('Old image deleted:', banner.banner);
        }
        console.log(banner.banner)

        banner.banner = imageName;
        // console.log('New image:', imageName);
      }

      banner.title = title;
      banner.subtitle = subtitle;

      await banner.save();

      return res.status(200).send({
        status: 200,
        message: 'Banner updated successfully',
        data: banner
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



const deleteBanner = async (req: Request, res: Response): Promise<Response> => {
	try {
	  const bannerId: number = Number(req.params.id);
  
	  const banner = await Banner.findByPk(bannerId);
  
	  if (!banner) {
		return res.status(404).send({
		  status: 404,
		  message: "Banner not found",
		  errors: null
		});
	  }
  
	  await banner.destroy();
  
	  return res.status(200).send({
		status: 200,
		message: "Banner deleted successfully",
		data: banner
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

export default { GetBanner, GetBannerById, createBanner, updateBanner, deleteBanner };
