import express from "express";

import RoleController from "../controllers/RoleControllers";
import UserController from "../controllers/UserControllers";
import BannerController from "../controllers/BannerController";
import BeritaController from "../controllers/BeritaController";

import UserValidation from "../middleware/validation/UserValidation";
import Authorization from "../middleware/Authorization";

const router = express.Router();

// Role
router.get("/role", Authorization.Authenticated, Authorization.SuperUser, RoleController.GetRole);
router.get("/role/:id", RoleController.GetRoleById);
router.patch("/role/:id", RoleController.UpdateRole);
router.post("/role", RoleController.CreateRole);
router.patch("/role/:id", RoleController.UpdateRole);
router.delete("/role/:id", RoleController.DeleteRole);


// User
router.post("/user/signup",UserValidation.RegisterValidation, UserController.Register);
router.post("/user/login", UserController.UserLogin);
router.get("/user/refresh-token", UserController.RefreshToken);
router.get("/user/current-user", Authorization.Authenticated, UserController.UserDetail);
router.get("/user/logout", Authorization.Authenticated, UserController.UserLogout);

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





export default router;