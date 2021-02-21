const express = require('express');
const jwt = require('jsonwebtoken');

const authMiddleware = require('../middlewares/auth');
const authConfig = require('../../config/auth.json');
const Unity = require('../models/unity');
const router = express.Router();

router.use(authMiddleware);

router.get('/list', async (req, res) => {
  try {
      const unities = await Unity.find();
      res.send({ unities });
  } catch (error) {
      res.status(400).send({ error: 'Falha ao realizar a operação. (Listar unidades)'});
      console.log(error);
  }
});

router.get('/search/:id', async (req, res) => {
  try {
    const unity_id = await Unity.findById(req.params.id);
    if(unity_id == null) return res.status(404).send({ error: 'A unidade não existe!'});
    await Unity.findById(req.params.id, function (error, data) {
      if(error) res.status(400).send({ error: 'Falha ao encontrar unidade'});
      res.send(data);
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ error: 'Falha ao realizar a operação. (Encontrar unidade)'});
  }
});

router.get('/search/sectors/:id', async (req, res) => {
  try {
    const unity_id = await Unity.findById(req.params.id);
    if(unity_id == null) return res.status(404).send({ error: 'A unidade não existe!'});
    await Unity.findById(req.params.id, function (error, data) {
      if(error) res.status(400).send({ error: 'Falha ao encontrar unidade'});
      res.send(data.setores);
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ error: 'Falha ao realizar a operação. (Encontrar unidade)'});
  }
});

router.get('/search/:unityID/sector/:sectorID', async (req, res) => {
  const { unityID, sectorID } = req.params;
  try {
    const unity_id = await Unity.findById(unityID);
    if(unity_id == null) return res.status(404).send({ error: 'O setor não existe!'});
    await Unity.findById(unityID, function (error, data) {
      if(error) res.status(400).send({ error: 'Falha ao encontrar setor'});
      const sector = data.setores.filter((setor) => { return setor._id == sectorID });
      console.log(sector[0]);
      res.send(sector[0]);
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ error: 'Falha ao realizar a operação. (Encontrar setor)'});
  }
});

router.get('/search/:unityID/sector/:sectorID/cargo/:cargoID', async (req, res) => {
  const { unityID, sectorID, cargoID } = req.params;
  try {
    const unity_id = await Unity.findById(unityID);
    if(unity_id == null) return res.status(404).send({ error: 'O cargo não existe!'});
    await Unity.findById(unityID, function (error, data) {
      if(error) res.status(400).send({ error: 'Falha ao encontrar cargo'});
      const sector = data.setores.filter((setor) => { return setor._id == sectorID });
      const cargos = sector[0].cargos.filter(cargo => { return cargo._id == cargoID });
      res.send(cargos[0]);
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ error: 'Falha ao realizar a operação. (Encontrar cargo)'});
  }
});

router.get('/list/cargos/:id', async (req, res) => {
  const { sectorID } = req.body;
  try {
    const unity_id = await Unity.findById(req.params.id);
    if(unity_id == null) return res.status(404).send({ error: 'O setor não existe!'});
    await Unity.findById(req.params.id, function (error, data) {
      if(error) res.status(400).send({ error: 'Falha ao encontrar setor'});
      const sector = data.setores.filter((setor) => { return setor._id == sectorID });
      res.send(sector[0].cargos);
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ error: 'Falha ao realizar a operação. (Encontrar setor)'});
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const unity_id = await Unity.findById(req.params.id);
    if(unity_id == null) return res.status(404).send({ error: 'Unidade não existe!'});
    await Unity.findByIdAndUpdate(req.params.id, req.body, async function (error, data) {
      if(error) { 
        console.log(error); 
        res.status(400).send({ error: 'Falha ao encontrar a unidade'}); 
      }
      res.send(data);
    });
    await unity_id.updateOne();
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ error: 'Falha ao realizar a operação. (Atualizar unidade)'});
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const unity_id = await Unity.findById(req.params.id);
    if(unity_id == null) return res.status(404).send({ error: 'A unidade não existe!'});
    await Unity.findByIdAndDelete(req.params.id, function (error, data) {
      if(error) {
        console.log(error.message);
        res.status(400).send({ error: 'Falha ao deletar a unidade'});
      }
      if(data) res.send(data);
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: 'Falha ao deletar unidade.'});
  }
});

router.post('/register', async (req, res) => {
  const { cnpj, contact } = req.body;
  try {
    if(await Unity.findOne({ cnpj }))
      return res.status(409).send({ error: 'Já existe alguma unidade utilizando este CNPJ.'});
    if(await Unity.findOne({ email: contact.email }))
      return res.status(409).send({ error: 'Já existe alguma unidade utilizando este e-mail.'});
    
    const unity = await Unity.create(req.body);
    
    return res.send({ unity });
  } catch (error) {
    console.log(error);
    return res.status(400).send( { error: 'Ocorreu um erro no registro.'});
  }
});

module.exports = app => app.use('/unity', router);