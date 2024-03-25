import express from 'express';
import { createTodo, getTodos, updateTodo, deleteTodo, markAsCompleted } from '../controllers/todoControllers';
import { isAuthenticated, AuthenticatedRequest } from '../middlewares'; // Import AuthenticatedRequest

const router = express.Router();

router.post('/todos', isAuthenticated, async (req: express.Request, res: express.Response) => {
    return await createTodo(req as AuthenticatedRequest, res);
  }); 
  
  router.get('/todos', isAuthenticated, async (req: express.Request, res: express.Response) => {
    return await getTodos(req as AuthenticatedRequest, res);
  });
  
  router.patch('/todos/:id', isAuthenticated, async (req: express.Request, res: express.Response) => {
    return await updateTodo(req as AuthenticatedRequest, res);
  });
  
  router.delete('/todos/:id', isAuthenticated, async (req: express.Request, res: express.Response) => {
    return await deleteTodo(req as AuthenticatedRequest, res);
  });
  
  router.patch('/todos/:id/complete', isAuthenticated, async (req: express.Request, res: express.Response) => {
    return await markAsCompleted(req as AuthenticatedRequest, res);
  });
  

export default router;
