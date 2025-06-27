const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authController = require("../controller/authController");
const app = express();
app.use(express.json());

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.post("/updatepwd", authMiddleware, authController.updatePassword);
router.get("/getUser", authMiddleware, authController.getUser);

module.exports = router;
