const express = require('express');

const Attachment = require('../models/attachment');
const router = express.Router();
const multer = require('multer');
const multerConfig = require('../../config/multer');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.get('/list', async (req, res) => {
  try {
    const attachments = await Attachment.find();
    return res.send(attachments);
  } catch (error) {
    res.status(400).send({ error: 'Falha ao realizar a operação. (Listar anexos)'});
    console.log(error);
  }
});

router.post('/send', multer(multerConfig).single('attachment'), async (req, res) => {
  const { originalName: name, size, key, location: url = '', mimetype } = req.file;
  console.log(req.file);
  try {
    const attachment = await Attachment.create({
      name,
      size,
      key,
      url,
      mimetype
    });
    return res.send(attachment);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: 'Falha ao realizar a operação.'});
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const attachment = await Attachment.findById(req.params.id);
    if(attachment == null) return res.status(404).send({ error: 'O anexo não existe!'});
    await attachment.remove();
    return res.send();
  } catch (error) {
    res.status(400).send({ error: 'Falha ao realizar a operação. (Listar anexos)'});
    console.log(error);
  }
})

module.exports = app => app.use('/attachment', router);