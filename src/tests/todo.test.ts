import request from 'supertest';
import express from 'express';
import todoRoutes from '../router/todo';
import mongoose from 'mongoose';
import { Types } from 'mongoose';

import { TodoModel, Todo } from '../db/todo';

const app = express();
app.use(express.json());
app.use('/', todoRoutes);

describe('Todo Routes', () => {
  it('should create a new todo', async () => {
    const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const mockTodo = new TodoModel({
  userId: new ObjectId(), 
  description: 'Test Todo',
  completed: false,
  createdAt: new Date(),
});


    jest.spyOn(TodoModel, 'create').mockResolvedValueOnce(mockTodo as any);

    const response = await request(app)
      .post('/todos')
      .send({ description: 'Test Todo' })
      .expect(201);

    expect(response.body).toEqual(mockTodo);
  });

  it('should get all todos', async () => {
    const todos = [
      { userId: new mongoose.Types.ObjectId().toHexString(), description: 'Todo 1', completed: false, createdAt: new Date() },
      { userId: new mongoose.Types.ObjectId().toHexString(), description: 'Todo 2', completed: true, createdAt: new Date() }
    ];

    jest.spyOn(TodoModel, 'find').mockResolvedValueOnce(todos as any);

    const response = await request(app)
      .get('/todos')
      .expect(200);

    expect(response.body).toEqual(todos);
  });

  it('should get all todos (with ObjectIds)', async () => {
    const todos: Todo[] = [
      { userId: new mongoose.Types.ObjectId(), description: 'Todo 1', completed: false, createdAt: new Date() },
      { userId: new mongoose.Types.ObjectId(), description: 'Todo 2', completed: true, createdAt: new Date() },
    ];

    jest.spyOn(TodoModel, 'find').mockResolvedValueOnce(todos as any);

    const response = await request(app)
      .get('/todos')
      .expect(200);

    expect(response.body).toEqual(todos);
  });

  it('should update a todo', async () => {
    const updatedTodo: Todo = {
      userId: new Types.ObjectId(), 
      description: 'Updated Todo',
      completed: true,
      createdAt: new Date(),
    };
  
    jest.spyOn(TodoModel, 'findByIdAndUpdate').mockResolvedValueOnce(updatedTodo as any);
  
    const response = await request(app)
      .patch('/todos/123')
      .send({ description: 'Updated Todo', completed: true })
      .expect(200);
  
    expect(response.body).toEqual(updatedTodo);
  });
  it('should delete a todo', async () => {
    const deletedTodo: Todo = {
      userId: new Types.ObjectId(), 
      description: 'Deleted Todo',
      completed: false,
      createdAt: new Date(),
    };
  
    jest.spyOn(TodoModel, 'findByIdAndDelete').mockResolvedValueOnce(deletedTodo as any);
  
    const response = await request(app)
      .delete('/todos/123')
      .expect(200);
  
    expect(response.body).toEqual(deletedTodo);
  });
  it('should mark a todo as completed', async () => {
    const updatedTodo: Todo = {
      userId: new Types.ObjectId(), 
      description: 'Todo',
      completed: true,
      createdAt: new Date(),
    };
  
    jest.spyOn(TodoModel, 'findByIdAndUpdate').mockResolvedValueOnce(updatedTodo as any);
  
    const response = await request(app)
      .patch('/todos/123/complete')
      .expect(200);
  
    expect(response.body).toEqual(updatedTodo);
  });
});
