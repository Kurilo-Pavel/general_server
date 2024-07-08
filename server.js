import express from "express";
import nodemailer from "nodemailer";
import multer from "multer";

const upload = multer({dest: 'uploads/'})
const configNodeMailer = {
  host: "smtp.yandex.ru",
  port: 465,
  secure: true,
  auth: {
    user: "pkuryla",
    pass: "hcarfnblkzgbehrs"
  }
};

const server = express();
const port = 7780;

server.post("/engineering/message", upload.single('doc'), (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", ` https://kurilo-pavel.github.io`);

  const transporter = nodemailer.createTransport(configNodeMailer);
  const message = {
    from: "pkuryla@yandex.ru",
    to: "kurilo.pavel@mail.ru",
    subject: "Новая заявка",
    html: `<div>
<b>Имя клиента: </b><span>${request.body.name}</span><br/>
<b>Телефон клиента: </b><span>${request.body.phone}</span><br/>
<b>Email клиента: </b><span>${request.body.email}</span><br/>
<b>Тема: </b><span>${request.body.topic}</span><br/>
<b>Сообщение: </b><span>${request.body.message}</span><br/>

</div>`,

    attachments: [
      {
        filename: request.file?.originalname,
        contentType: request.file?.mimetype,
        content: request.file
      }
    ]
  };
  transporter.sendMail(message, err => {
    if (err) {
      response.status(401).send({status: "error"});
    } else {
      response.send({status: "success"});
    }
  });
});

server.listen(port, () => {
  console.log("server working...");
});