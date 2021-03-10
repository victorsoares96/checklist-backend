const express = require('express');

const Feedback = require('../models/feedback');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const telegram = require('../../config/telegram');

router.use(authMiddleware);

router.get('/count', async (req, res) => {
  const { id, name, message } = req.query;

  let query = {};
  if(id) {
    query['_id'] = id;
  }
  if(name) {
    query['name'] = new RegExp(name, 'i');
  }
  if(message) {
    query['message'] = new RegExp(message, 'i');
  }
  try {
    const count = await Feedback
      .find(query).countDocuments();
    res.send({ count });
  } catch (error) {
    res.status(400).send({ error: 'Falha ao realizar a operação. (Contar formulários)' });
    console.log(error);
  }
});

router.get('/list', async (req, res) => {
  const { id, name, message, page = 1, sort = '-createdAt' } = req.query;

  let query = {};
  if(id) {
    query['_id'] = id;
  }
  if(name) {
    query['name'] = new RegExp(name, 'i');
  }
  if(message) {
    query['message'] = new RegExp(message, 'i');
  }
  try {
    const result = await Feedback
      .find(query).limit(5).skip((page - 1) * 5).sort(sort);
    res.send(result);
  } catch (error) {
    res.status(400).send({ error: 'Falha ao realizar a operação. (Listar formulários)' });
    console.log(error);
  }
});

const Message = `
  Olá! \n
  Segue abaixo a opnião sobre o checklist do ${this.name}.

  "${this.message}"
`;

router.post('/register', async (req, res) => {
  const { name, message } = req.body;
  try {
    if(!name || !message) throw 'Erro: Nome ou comentário está vazio.'
<<<<<<< HEAD
    const result = await Feedback.create({ name, message });

    await telegram.sendMessage(-471032826, `
    Olá! 
    \nSegue abaixo a opnião sobre o checklist do ${name}.
    \n"${message}"
    `);
    return res.send(result);
=======
    await Feedback.create({ name, message });

    await telegram.sendMessage(process.env.TELEGRAM_CHAT_IDS, `
      Olá! 
      \nSegue abaixo a opnião sobre o checklist do ${name}.
      \n"${message}"
    `)
    return res.send();
>>>>>>> 35d6406903ca95532e86f8583249e45cd150bf15
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error });
  }
});

module.exports = app => app.use('/feedback', router);