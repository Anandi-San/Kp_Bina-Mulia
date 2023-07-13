import express from "express";

import RoleController from "../controllers/RoleControllers";
import UserController from "../controllers/UserControllers";
import BannerController from "../controllers/BannerController";
import BeritaController from "../controllers/BeritaController";
import CareerController from "../controllers/CareerController";
import GaleriController from "../controllers/GaleriController";
import MessageController from "../controllers/MessageController";


import UserValidation from "../middleware/validation/UserValidation";
import Authorization from "../middleware/Authorization";

const router = express.Router();

// Role
router.get("/role", Authorization.Authenticated, RoleController.GetRole);
router.get("/role/:id", RoleController.GetRoleById);
router.patch("/role/:id", RoleController.UpdateRole);
router.post("/role", RoleController.CreateRole);
router.patch("/role/:id", RoleController.UpdateRole);
router.delete("/role/:id", RoleController.DeleteRole);


// User
router.post("/user/signup",UserValidation.RegisterValidation, UserController.RegisterUser);
router.post("/signup", UserController.SignUp);
router.post("/user/login", UserController.UserLogin);
router.get("/user/refresh-token", UserController.RefreshToken);
router.get("/user/current-user", Authorization.Authenticated, UserController.UserDetail);
router.get("/user/logout", Authorization.Authenticated, UserController.UserLogout);
router.post("/signin", UserController.SignInwithGoogle);
router.get("/verify/:token", UserController.VerifyToken);
router.post("/resetPassword", UserController.resetPassword)

// Banner
router.get("/banner", Authorization.Authenticated, BannerController.GetBanner);
router.post("/banner", BannerController.createBanner);
router.get("/banner/:id", BannerController.GetBannerById);
router.patch("/banner/:id",BannerController.updateBanner);
router.delete("/banner/:id", BannerController.deleteBanner);

// Berita
router.get("/berita&program", BeritaController.GetBerita);
router.get("/berita&program/:id", BeritaController.GetBeritaById);
router.post("/berita&program", BeritaController.createBerita);
router.patch("/berita&program/:id", BeritaController.updateBerita);
router.delete("/berita*program/:id", BeritaController.deleteBerita);

//Career
router.get("/career", CareerController.getCareer);
router.get("/career/:id", CareerController.GetCareerById);
router.post("/career", CareerController.CreateCareer);
router.patch("/career/:id", CareerController.UpdateCareer);
router.delete("/career/:id", CareerController.DeleteCareer);

// Galeri 
router.get("/galeri", GaleriController.GetGaleri);
router.get("/galeri/:id", GaleriController.GetGaleriById);
router.post("/galeri", GaleriController.createGaleri);
router.patch("/galeri/:id", GaleriController.updateGaleri);
router.delete("/galeri/:id", GaleriController.deleteGaleri);

// Forum
router.get("/forum", MessageController.getMessage);
router.post("/forum", MessageController.createMessage);
router.delete("/forum/:id", MessageController.deleteMessage);


export default router;