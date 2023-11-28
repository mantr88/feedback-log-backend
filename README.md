# feedback-log-backend

This is a backend part of service where the user can leave comments.

All comments entered by the user are saved in the relational database МySQL including user data
(data that will help identify the client).

The user can add a picture or text file to the comment. The image must be no more than 320x240
pixels, if you try to upload a larger image, the image will be proportionally reduced to the
specified dimensions, acceptable file formats: JPG, GIF, PNG.

Data will be validated before loading into the database.

After connecting the user to the service, continuous communication is established between the user
(client) and the logic of the service (backend) using websockets, at which time the user receives
all the comments that are available in the database. To be able to leave a comment, the user needs
to register or log in to his account.

After creation, the project was deployed on the render.com
(https://feedback-log-backend.onrender.com) service and packaged in a Docker container with all
dependencies and environment.

During the creation of this project, the following technologies were used Node.js, Express.js,
Socket.io, MySQL, Jsonwebtoken, Joi, Cloudinary.

![JavaScript](https://img.shields.io/badge/JavaScript-F0DB4F?style=for-the-badge&logo=javascript&logoColor=323330)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-3E6E93?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-0091E2?style=for-the-badge&logo=docker&logoColor=white)
<img align="left" alt="Node.js" width="32px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/nodejs/nodejs.png" />
