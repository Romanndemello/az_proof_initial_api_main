//Importo somente a funcão router
import { Router } from 'express';

import DashboardsController from './app/controllers/DashboardsController';
import SessionsController from './app/controllers/SessionsController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
//################## PROOF #####################
//Session
routes.post('/proof/session', SessionsController.store);
//################## PROOF #####################

//################## MIDDLEWARE AUTH #####################
routes.use(authMiddleware);
//################## MIDDLEWARE AUTH #####################

//################## AUTH PROOF #####################
//Dashboard
routes.get('/proof/dashboard', DashboardsController.store);
//################## AUTH PROOF #####################

export default routes;
