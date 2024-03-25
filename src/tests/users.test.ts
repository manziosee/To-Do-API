import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import userRoutes from '../router/users';
import { getAllUsers, deleteUser, updateUser } from '../controllers/users';
import { UserModel } from '../db/users';

const app = express();
app.use(express.json());
app.use('/', userRoutes);

interface AuthenticatedRequest extends Request {
  userId?: string;
}

const mockIsAuthenticated = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  req.userId = 'user_id'; 
  next();
};

describe('User Routes', () => {
  it('should get all users', async () => {
    const users = [{ email: 'test1@example.com', username: 'user1' }, { email: 'test2@example.com', username: 'user2' }];
    jest.spyOn(UserModel, 'find').mockResolvedValueOnce(users);

    const response = await request(app).get('/users').expect(200);
    expect(response.body).toEqual(users);
  });

  it('should delete a user', async () => {
    const mockDeleteUser = jest.spyOn(UserModel, 'findOneAndDelete').mockResolvedValueOnce({ email: 'deleted@example.com', username: 'deleteduser' });

    const response = await request(app).delete('/users/123').expect(200);
    expect(mockDeleteUser).toHaveBeenCalledWith({ _id: '123' });
    expect(response.body).toEqual({ email: 'deleted@example.com', username: 'deleteduser' });
  });

  it('should update a user', async () => {
    const mockFindByIdAndUpdate = jest.spyOn(UserModel, 'findByIdAndUpdate').mockResolvedValueOnce({ _id: '123', email: 'updated@example.com', username: 'updateduser' });

    const response = await request(app)
      .patch('/users/123')
      .send({ email: 'newemail@example.com', username: 'newusername' })
      .expect(200);

    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith('123', { email: 'newemail@example.com', username: 'newusername' });
    expect(response.body).toEqual({ _id: '123', email: 'updated@example.com', username: 'updateduser' });
  });
});
