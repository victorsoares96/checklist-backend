const express = require('express');

const Checklist = require('../models/checklist');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.get('/count', async (req, res) => {
  try {
    const count = await Checklist.find(req.query).countDocuments();
    res.send({ count });
  } catch (error) {
    res.status(400).send({ error: 'Falha ao realizar a operação. (Contar formulários)' });
    console.log(error);
  }
});

router.get('/list', async (req, res) => {
  try {
      const checklist = await Checklist.find(req.query);
      res.send({ checklist });
  } catch (error) {
      res.status(400).send({ error: 'Falha ao realizar a operação. (Listar formulários)' });
      console.log(error);
  }
});

router.get('/search/:id', async (req, res) => {
  try {
    const checklist_id = await Checklist.findById(req.params.id);
    if(checklist_id == null) return res.status(404).send({ error: 'O formulário não existe!'});
    await Checklist.findById(req.params.id, function (error, data) {
      if(error) res.status(400).send({ error: 'Falha ao encontrar o formulário!'});
      res.send(data);
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ error: 'Falha ao realizar a operação. (Encontrar formulário)'});
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const checklist_id = await Checklist.findById(req.params.id);
    if(checklist_id == null) return res.status(404).send({ error: 'O formulário não existe!'});
    await Checklist.findByIdAndUpdate(req.params.id, req.body, async function (error, data) {
      if(error) { 
        console.log(error); 
        res.status(400).send({ error: 'Falha ao encontrar o formulário!'}); 
      }
      res.send(data);
    });
    await checklist_id.updateOne();
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: 'Falha ao realizar a operação. (Atualizar formulário)'});
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const checklist_id = await Checklist.findById(req.params.id);
    if(checklist_id == null) return res.status(404).send({ error: 'O formulário não existe!'});
    await Checklist.findByIdAndDelete(req.params.id, function (error, data) {
      if(error) { 
        console.log(error); 
        res.status(400).send({ error: 'Falha ao deletar o formulário!'}); 
      }
      if(data) res.send(data);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: 'Falha ao realizar a operação. (Deletar formulário)'});
  }
});

router.post('/register', async (req, res) => {
  //const { cnpj, contact } = req.body;
  //console.log(req.body);
  try {
    /*if(await Unity.findOne({ cnpj }))
      return res.status(400).send({ error: 'Já existe alguma unidade utilizando este CNPJ.'});
    if(await Unity.findOne({ email: contact.email }))
      return res.status(400).send({ error: 'Já existe alguma unidade utilizando este e-mail.'});*/
    
    const checklist = await Checklist.create(req.body);
    
    return res.send({ checklist });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: 'Falha ao realizar a operação. (Criar formulário)'});
  }
});

module.exports = app => app.use('/checklist', router);