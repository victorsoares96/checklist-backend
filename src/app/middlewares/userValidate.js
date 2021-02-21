const User = require('../models/user');
const Unity = require('../models/unity');

module.exports = async (req, res, next) => {
  //const user = await User.findById(req.params.id);
  /*const { user } = req.body;
  console.log(req.body);
  const user_ = await User.findOne({ user });
  const unity = await Unity.findById(user_.group);
  console.log({
    user_
  });
  if(!unity) return res.status(401).send({ error: 'Usuário inconsistente.' });
  console.log({
    unity
  });*/
  next();
}