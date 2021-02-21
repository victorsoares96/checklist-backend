const express = require('express');

const router = express.Router();

const PDFDocument =  require('pdfkit');
const { createAnswer } = require('../../resources/pdf/createAnswer');

const AnsweredChecklist = require('../models/answeredChecklist');
const authMiddleware = require('../middlewares/auth');

//const generateHeader = require('../../resources/pdf/generateHeader');
router.use(authMiddleware);

router.get('/generatePDF/:id', async function(req, res, next) {
  try {
    const answeredChecklist = await AnsweredChecklist.findById(req.params.id);
    if(answeredChecklist == null) return res.status(404).send({ error: 'O formulário não existe!'});
    await AnsweredChecklist.findById(req.params.id, function (error, data) {
      if(error) res.status(400).send({ error: 'Falha ao encontrar o formulário!'});
      if(data) {
        var myDoc = new PDFDocument({bufferPages: true});
        let buffers = [];
        myDoc.on('data', buffers.push.bind(buffers));
        myDoc.on('end', () => {
          let pdfData = Buffer.concat(buffers);
          res.writeHead(200, {
          'Content-Length': Buffer.byteLength(pdfData),
          'Content-Type': 'application/pdf',
          'Content-disposition': 'attachment;filename=test.pdf',})
          .end(pdfData);
        });
        createAnswer(myDoc, data);
        myDoc.end();
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ error: 'Falha ao realizar a operação. (Encontrar formulário)'});
  }
});

module.exports = app => app.use('/pdf', router);