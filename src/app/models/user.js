const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  apelido: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  type: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    //unique: true,
    required: true,
    lowercase: true,
  },
  group: {
    type: String,
    required: true,
  },
  setor: {
    type: String,
    required: true
  },
  funcao: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
}, { timestamps: { createdAt: true, updatedAt: true } });

UserSchema.pre('update', async function(next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  //this.updatedAt = Date.now();
  next();
});

UserSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  this.updatedAt = Date.now();
  next();
});

UserSchema.post('save', async function(req, next) {
  let now = new Date().toISOString();
  console.log(`[CREATE USER EVENT]: User: ${this.apelido}, createdAt: ${now}`);
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;