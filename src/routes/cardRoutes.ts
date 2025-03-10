import express from 'express';
// import all controller functions as a namespace
import * as cardController from '../controllers/cardController';

const router = express.Router();

router.get('/', cardController.getAllCards);
router.get('/search', cardController.searchCards);
router.get('/type/:type', cardController.getCardsByType);
router.get('/:id', cardController.getCardById);

export default router;


