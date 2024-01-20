import express from "express";
import ec2Controller from "./ec2/controller";

const computeController = express.Router();

computeController.use('/ec2', ec2Controller);

export default computeController;
