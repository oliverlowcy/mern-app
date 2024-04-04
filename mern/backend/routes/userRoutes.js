const express = require('express')
const router = express.Router()
const {registerUser,authUser} = require('../controllers/userControllers')
router.use(express.json());
const {protect} = require("../middleware/authMiddleware")
const {allUsers} = require("../controllers/userControllers")

router.route('/').post(registerUser);

router.post('/login',authUser)

router.route("/").get(protect, allUsers);

module.exports = router;