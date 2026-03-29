import express, { Router } from 'express';
import dotenv from 'dotenv';
// import authentication from '@src/auth';
// import Handle_CreateMedication from './handle/CreateMedication';
// import Handle_CreateMedicationComment from './handle/CreateMedicationComment';
import Handle_DelIsNewMessage from './handle/DelIsNewMessage';

dotenv.config();

const router_mutate_myCustomer: Router = express.Router();
const handle_delIsNewMessage = new Handle_DelIsNewMessage();
// const handle_createMedicationComment = new Handle_CreateMedicationComment();

router_mutate_myCustomer.delete('/delIsNewMessage', handle_delIsNewMessage.main);

// router_mutate_medication.post(
//     '/createMedicationComment',
//     authentication,
//     handle_createMedicationComment.setup,
//     handle_createMedicationComment.main
// );

export default router_mutate_myCustomer;
