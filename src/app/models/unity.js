const mongoose = require('../../database');
const bcrypt = require('bcryptjs');
const { mongo } = require('../../database');

const ContactSchema = new mongoose.Schema({
  pais: {
    type: String,
    required: true,
  },
  estado: {
    type: String,
    required: true,
  },
  cidade: {
    type: String,
    required: true,
  },
  bairro: {
    type: String,
    required: true
  },
  logradouro: {
    type: String,
    required: true,
  },
  numero: {
    type: String,
    required: true,
  },
  complemento: {
    type: String,
  },
  cep: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  phone2: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
}, { _id: false });

const CargosSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  }
});

const SetoresSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  cargos: [CargosSchema]
});

const UnitySchema = new mongoose.Schema({
  nome_fantasia: {
    type: String,
    required: true,
  },
  razao_social: {
    type: String,
    required: true,
    uppercase: true,
  },
  apelido: {
    type: String,
    required: true,
  },
  cnpj: {
    type: String,
    unique: true,
    required: true,
  },
  contact: ContactSchema,
  status: {
    type: String,
    required: true,
    lowercase: true
  },
  setores: [SetoresSchema]
}, { timestamps: { createdAt: true, updatedAt: true } });

/*UnitySchema.pre('updateOne', async function(next) {
  //this.updatedAt = Date.now();
  this.updatedAt({},{ $set: { updatedAt: Date.now() } });
  console.log('up');
  console.log(this.updatedAt);
  next();
});*/

/*UnitySchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  this.updatedAt = Date.now();
  console.log('save')
  next();
});*/

const Unity = mongoose.model('Unity', UnitySchema);

module.exports = Unity;