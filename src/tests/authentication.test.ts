import request from 'supertest';
import express from 'express';
import authenticationRoutes from '../router/authentication';
import { UserModel } from '../db/users';
import chai from 'chai';
const expect = chai.expect;

const app = express();
app.use(express.json());
app.use('/auth', authenticationRoutes);

describe('Authentication Routes', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'Test1234', username: 'testuser' });
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message', 'Registration successful.');
    expect(response.body).to.have.property('user');
    expect(response.body.user).to.have.property('email', 'test@example.com');
    expect(response.body.user).to.have.property('username', 'testuser');
    expect(response.body).to.have.property('token');
  });

  it('should login an existing user', async () => {
    await UserModel.create({
      email: 'testlogin@example.com',
      username: 'testloginuser',
      authentication: {
        salt: 'salt',
        password: 'hashedpassword',
      },
    });

    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'testlogin@example.com', password: 'Test1234' });
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message', 'Login successful.');
    expect(response.body).to.have.property('user');
    expect(response.body.user).to.have.property('email', 'testlogin@example.com');
    expect(response.body.user).to.have.property('username', 'testloginuser');
    expect(response.body).to.have.property('token');
  });
});
