import express from 'express'
import { register_User,login_User ,userData,forget_Password,reset_Passwords} from '../Controllers/userContoller.js';
import authMiddleware from '../Middleware/authmiddleware.js';

const router = express.Router()

router.post('/register',register_User)
router.post('/login',login_User)
router.get('/getdata',authMiddleware,userData)
router.post('/forget-password',forget_Password)
// router.post('/reset-password/:id/:token',reset_Password)
router.post('/reset-passwords/:id/:token',reset_Passwords)
// router.post('/reset-password/:token',authMiddleware,reset_Passwords)
// router.get('/reset-password/:id/:token',reset_Password)

export default router;