import express from 'express';
import userController from './user/controller';
import resourcesController from './resources/controller';


// Main controller
const mainController = express.Router();

// add new controllers here
// mainController.use('/user', userController);
mainController.use('/resources', resourcesController);

export default mainController;
