// todoRoutes.ts

import express from 'express';
import { createTodo, getTodos, updateTodo, deleteTodo, markAsCompleted } from '../controllers/todoControllers';
import { isAuthenticated } from '../middlewares';

const router = express.Router();


router.post('/todos', isAuthenticated, createTodo); 
router.get('/todos', isAuthenticated, getTodos);
router.patch('/todos/:id', isAuthenticated, updateTodo);
router.delete('/todos/:id', isAuthenticated, deleteTodo);
router.patch('/todos/:id/complete', isAuthenticated, markAsCompleted);

export default router;
