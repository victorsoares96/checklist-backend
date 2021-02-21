const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const authConfig = require('../../config/auth.json');

const User = require('../models/user');
const Unity = require('../models/unity');

const router = express.Router();

/* Middlewares */
const userValidate = require('../middlewares/userValidate');

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

router.post('/authenticate', async (req, res) => {
  const { user, password } = req.body;
  const user_ = await User.findOne({ user }).select('+password');
  try {
    if(!user_) {
      return res.status(404).send({ error: 'Usuário não encontrado.'});
    }
    
    if(!await bcrypt.compare(password, user_.password)) {
      return res.status(404).send({ error: 'Senha inválida.'});
    }
    
    user_.password = undefined;
    let token = generateToken({ id: user_.id });
    res.send({ user_, token: token });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: 'Erro ao autenticar usuário' });
  }
});

module.exports = app => app.use('/user', router);