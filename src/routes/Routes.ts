import express from "express";

import RoleController from "../controllers/RoleControllers";
import UserController from "../controllers/UserControllers";
import BannerController from "../controllers/BannerController";
import BeritaController from "../controllers/BeritaController";
import CareerController from "../controllers/CareerController";
import GaleriController from "../controllers/GaleriController";
import MessageController from "../controllers/MessageController";
import UserFeaturesController from "../controllers/UserFeaturesController";



import UserValidation from "../middleware/validation/UserValidation";
import Authorization from "../middleware/Authorization";

const router = express.Router();

// Role
router.get("/role", Authorization.Authenticated, RoleController.GetRole);
router.get("/role/:id", Authorization.Authenticated,Authorization.SuperUser ,RoleController.GetRoleById);
router.patch("/role/:id", Authorization.Authenticated,Authorization.SuperUser ,RoleController.UpdateRole);
router.post("/role",Authorization.Authenticated,Authorization.SuperUser , RoleController.CreateRole);
router.patch("/role/:id",Authorization.Authenticated,Authorization.SuperUser , RoleController.UpdateRole);
router.delete("/role/:id",Authorization.Authenticated,Authorization.SuperUser , RoleController.DeleteRole);


// User
// router.post("/user/signup",UserValidation.RegisterValidation, UserController.RegisterUser);
router.post("/signup",UserValidation.RegisterValidation, UserController.SignUp); //ini masih lokal tidak memakai email
router.post("/user/login", UserController.UserLogin);
router.get("/user/refresh-token", UserController.RefreshToken);
router.get("/user/current-user", UserController.UserDetail);
router.get("/user/logout", Authorization.Authenticated, UserController.UserLogout);
router.post("/signin", UserController.SignInwithGoogle);
router.get("/verify/:token", UserController.VerifyToken);
router.post("/resetPassword", UserController.resetPassword)

// features User
router.get("/user", UserFeaturesController.GetAllUser); //masih belum ada login
router.get("/user/:id",Authorization.Authenticated ,UserFeaturesController.GetUserById);
router.patch("/user/:id",Authorization.Authenticated, Authorization.BasicUser, UserFeaturesController.UpdateUserByUser);
router.patch("/user/admin/:id",Authorization.Authenticated, Authorization.AdminRole, UserFeaturesController.UpdateUserByAdmin);
router.delete("/user/:id", Authorization.Authenticated, Authorization.AdminRole, UserFeaturesController.DeleteUser);

// Banner
router.get("/banner", BannerController.GetBanner);
router.post("/banner" ,BannerController.createBanner); // belum ada login
router.get("/banner/:id", Authorization.Authenticated, BannerController.GetBannerById);
router.patch("/banner/:id",Authorization.Authenticated, Authorization.AdminRole ,BannerController.updateBanner);
router.delete("/banner/:id", Authorization.AdminRole, BannerController.deleteBanner);

// Berita
router.get("/berita&program", BeritaController.GetBerita);
router.get("/berita&program/:id", BeritaController.GetBeritaById);
router.post("/berita&program", BeritaController.createBerita);
router.patch("/berita&program/:id",Authorization.Authenticated, Authorization.AdminRole, BeritaController.updateBerita);
router.delete("/berita*program/:id",Authorization.Authenticated, Authorization.AdminRole, BeritaController.deleteBerita);

//Career
router.get("/career", CareerController.getCareer);
router.get("/career/:id", CareerController.GetCareerById);
router.post("/career", Authorization.Authenticated, Authorization.AdminRole, CareerController.CreateCareer);
router.patch("/career/:id",Authorization.Authenticated, Authorization.AdminRole, CareerController.UpdateCareer);
router.delete("/career/:id",Authorization.Authenticated, Authorization.AdminRole, CareerController.DeleteCareer);

// Galeri 
router.get("/galeri", GaleriController.GetGaleri);
router.get("/galeri/:id", GaleriController.GetGaleriById);
router.post("/galeri",Authorization.Authenticated, Authorization.AdminRole, GaleriController.createGaleri);
router.patch("/galeri/:id",Authorization.Authenticated, Authorization.AdminRole, GaleriController.updateGaleri);
router.delete("/galeri/:id",Authorization.Authenticated, Authorization.AdminRole, GaleriController.deleteGaleri);

// Forum
router.get("/forum", MessageController.getMessage);
router.post("/forum",Authorization.Authenticated, MessageController.createMessage);
router.delete("/forum/:id",Authorization.Authenticated, MessageController.deleteMessage);


export default router;