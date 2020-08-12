import User from '../sequelize/user.model';
import server, { shutDown } from '../server/server';
import fetch from 'node-fetch';



async function createUser(){
   await User.create({
      name:'fakeName',
      surname:'fakeSurname',
      email:'fakeEmail@domani.it'
   });
}

async function destroyUser(){
   await User.destroy({where:{
      name:'fakeName',
      surname:'fakeSurname',
      email:'fakeEmail@domani.it'
   }});
}

let app;
const CONTENT_TYPE_JSON = 'application/json';

describe('User Endpoints', () => {
   beforeAll(async () => {
      require('dotenv').config();
      app = await server();
      await destroyUser();
   });

   afterAll(async () => {
      shutDown(app);
   });

   const newUser = {
      name:'fakeName',
      surname:'fakeSurname',
      email:'fakeEmail'
   };

   it('should create a new user', async () => {
      const response = await fetch('http://localhost:8080/user',{
         method:'POST',
         headers: {'Content-Type': CONTENT_TYPE_JSON},
         body: JSON.stringify(newUser)
      });
      const result = await response.json();
      expect(response.status).toEqual(200);
      expect(result).toHaveProperty('id');
   });


   it('should user already exists ( email )', async () => {
      const response = await fetch('http://localhost:8080/user',{
         method:'POST',
         headers: {'Content-Type': CONTENT_TYPE_JSON},
         body: JSON.stringify({
            name:'anotherFakeName',
            surname:'anotherFakeSurname',
            email:'fakeEmail'
         })
      });
      const result = await response.json();
      expect(response.status).toEqual(400);
      expect(result).toHaveProperty('message');
   });

   it('should user already exists ( name, surname )', async () => {
      const response = await fetch('http://localhost:8080/user',{
         method:'POST',
         headers: {'Content-Type': CONTENT_TYPE_JSON},
         body: JSON.stringify({
            name:'fakeName',
            surname:'fakeSurname',
            email:'anotherFakeEmail'
         })
      });
      const result = await response.json();
      expect(response.status).toEqual(400);
      expect(result).toHaveProperty('message');
   });

   it('should return the user ', async () => {
      const response = await fetch('http://localhost:8080/user?id=1');
      const result = await response.json();
      expect(response.status).toEqual(200);
      expect(result).toHaveProperty('user');
   });

   it('should not find the user ', async () => {
      const response = await fetch('http://localhost:8080/user?id=999');
      const result = await response.json();
      expect(response.status).toEqual(400);
      expect(result).toHaveProperty('message');
   });

   it('should update the user', async () => {
      const response = await fetch('http://localhost:8080/user',{
         method:'PUT',
         headers: {'Content-Type': CONTENT_TYPE_JSON},
         body: JSON.stringify({
            id:1,
            name:'fakeNameUpate',
            surname:'fakeSurnameUpate',
            email:'fakeEmailUpate'
         })
      });
      const result = await response.json();
      const updateResponse = await fetch('http://localhost:8080/user?id=1');
      const updateResult = await updateResponse.json();

      expect(response.status).toEqual(200);
      expect(result).toHaveProperty('id');
      expect(updateResponse.status).toEqual(200);
      console.log(" Res : ",updateResult);
      expect(updateResult.user.id).toEqual(1);
   });

   it('should not find user to update ', async () => {
      const response = await fetch('http://localhost:8080/user',{
         method:'PUT',
         headers: {'Content-Type': CONTENT_TYPE_JSON},
         body: JSON.stringify({
            id:999,
            name:'fakeNameUpate',
            surname:'fakeSurnameUpate',
            email:'fakeEmailUpate'
         })
      });
      const result = await response.json();

      expect(response.status).toEqual(400);
      expect(result).toHaveProperty('message');
   });

   it('should not find user to delete', async () => {
      const response = await fetch('http://localhost:8080/user?id=999',{
         method:'DELETE',
      });
      const result = await response.json();

      expect(response.status).toEqual(400);
      expect(result).toHaveProperty('message');
   });

   it('should delete user', async () => {
      const response = await fetch('http://localhost:8080/user?id=1',{
         method:'DELETE',
      });
      const result = await response.json();

      expect(response.status).toEqual(200);
      expect(result).toHaveProperty('message');

      const updateResponse = await fetch('http://localhost:8080/user?id=1');
      const updateResult = await updateResponse.json();
      expect(updateResponse.status).toEqual(400);
      expect(updateResult).toHaveProperty('message');

   });

})

