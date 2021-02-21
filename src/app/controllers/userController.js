const express = require('express');
const jwt = require('jsonwebtoken');

const authMiddleware = require('../middlewares/auth');
const authConfig = require('../../config/auth.json');

const User = require('../models/user');
const router = express.Router();

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

router.use(authMiddleware);

router.get('/count', async (req, res) => {
  try {
    const count = await User.find(req.query).countDocuments();
    res.send({ count });
  } catch (error) {
    res.status(400).send({ error: 'Falha ao realizar a operação. (Listar usuários)'});
    console.log(error);
  }
});

router.get('/search/all', async (req, res) => {
  try {
    const users = await User.find(req.query);
    res.send({ users });
  } catch (error) {
    res.status(400).send({ error: 'Falha ao realizar a operação. (Listar usuários)'});
    console.log(error);
  }
});

router.get('/search/:id', async (req, res) => {
  try {
    const user_id = await User.findById(req.params.id);
    if(user_id == null) return res.status(404).send({ error: 'O usuário não existe!'});
    await User.findById(req.params.id, function (error, data) {
      if(error) res.status(400).send({ error: 'Falha ao encontrar usuário'});
      res.send(data);
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ error: 'Falha ao realizar a operação. (Encontrar usuário)'});
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const user_id = await User.findById(req.params.id);
    if(user_id == null) return res.status(404).send({ error: 'O usuário não existe!'});
    await User.findByIdAndUpdate(req.params.id, req.body, async function (error, data) {
      if(error) {
        console.log(error); 
        res.status(400).send({ error: 'Falha ao encontrar usuário'});
      }
      res.send(data);
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ error: 'Falha ao realizar a operação. (Atualizar usuário)'});
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if(user == null) return res.status(404).send({ error: 'O usuário não existe!'});
    await User.findByIdAndDelete(req.params.id, function (error, data) {
      if(error) {
        console.log(error); 
        res.status(400).send({ error: 'Falha ao deletar usuário'});
      }
      if(data) {
        data.password = undefined;
        res.send(data);
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: 'Falha ao deletar usuário.'});
  }
});

router.post('/register', async (req, res) => {
  const { email, user } = req.body;
  try {
    if(await User.findOne({ user }))
      return res.status(409).send({ error: 'Já existe alguém utilizando este nome de usuário.'});

    /*if(await User.findOne({ email }))
      return res.status(400).send({ error: 'Já existe um usuário com esse e-mail.'});*/
    
    const user_ = await User.create(req.body);
    user_.password = undefined;
    
    return res.send({ user_, token: generateToken({ id: user_.id }) });
  } catch (error) {
    console.log(error);
    return res.status(400).send( { error: 'Ocorreu um erro no registro.'});
  }
});

router.post('/reset_password/:id', async (req, res) => {
  const { password } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if((!user)) return res.status(404).send({ error: 'Usuário não encontrado!'});
    user.password = password;
    await user.save();
    res.send();
  } catch (error) {
    res.status(400).send({ error: 'Não foi possivel concluir essa ação, tente novamente mais tarde.' });
    console.log(error);
  }
});

module.exports = app => app.use('/user', router);