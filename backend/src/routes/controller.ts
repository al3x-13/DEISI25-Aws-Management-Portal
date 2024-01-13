import express from 'express';
import userController from './user/controller';


// Main controller
const mainController = express.Router();

// add new controllers here
mainController.use('/user', userController);

export default mainController;
