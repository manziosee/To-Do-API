import express from 'express';
import { TodoModel } from '../db/todo';

interface AuthenticatedRequest extends express.Request {
    userId: string; 
}

export const createTodo = async (req: AuthenticatedRequest, res: express.Response) => {
    try {
      const { description } = req.body;
      const userId = req.userId; 
      const todo = await TodoModel.create({ userId, description });
  
      return res.status(201).json(todo); 
    } catch (error) {
      console.error(error);
      return res.sendStatus(500);
    }
}; 
export const getTodos = async (req: AuthenticatedRequest, res: express.Response) => {
    try {
      const userId = req.userId; 
      const todos = await TodoModel.find({ userId });
      return res.json(todos);
    } catch (error) {
      console.error(error);
      return res.sendStatus(500);
    }
  };
export const updateTodo = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { description, completed } = req.body;
    const updatedTodo = await TodoModel.findByIdAndUpdate(id, { description, completed }, { new: true });

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    return res.status(200).json(updatedTodo);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export const deleteTodo = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const deletedTodo = await TodoModel.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    return res.status(200).json(deletedTodo);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};
export const markAsCompleted = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const updatedTodo = await TodoModel.findByIdAndUpdate(id, { completed: true }, { new: true });

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    return res.status(200).json(updatedTodo);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};
