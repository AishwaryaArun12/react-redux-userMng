const express = require('express');
const multer = require('multer');
const user = require('../controller/users')
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/img/'); // Save files to the 'uploads' directory
    },
    filename: (req, file, cb) => {
      const uniqueFileName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueFileName);
    },
  });
  
  const upload = multer({ storage });

router.post('/register',user.register);
router.post('/login', user.login);
router.get('/getUsers', user.getUsers);
router.put('/blockUser/:id', user.blockUser);
router.put('/activeUser/:id', user.activeUser);
router.put('/editEmail', user.editEmail);
router.put('/editPassword', user.editPassword);
router.put('/editProfile', user.editProfile);
router.put('/editProfilePic',upload.single('file'),user.editProfilePic)

module.exports = router;