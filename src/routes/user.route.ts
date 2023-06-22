import { Router } from 'express'
import { AuthenticateUserController, CreateUserController, ListUserController } from '../controllers/User.controller'
import checkAuth from '../middlewares/auth.middleware';

const userRoute = Router()

const createUserController = new CreateUserController();
const authenticateUserService = new AuthenticateUserController();
const listUsersController = new ListUserController();

userRoute.post('/', createUserController.handle)

userRoute.post('/auth', authenticateUserService.handle)

userRoute.get('/', checkAuth, listUsersController.handle)

export default userRoute