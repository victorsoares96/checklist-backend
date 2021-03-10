const mongoose = require('../../database');

const expirationTimeSchema = new mongoose.Schema({
  expiratedAt: {
    type: Date,
    required: true,
<<<<<<< HEAD
    default: new Date().toISOString()
=======
>>>>>>> 35d6406903ca95532e86f8583249e45cd150bf15
  },
  isUndefined: {
    type: Boolean,
    required: true,
<<<<<<< HEAD
    default: true
=======
>>>>>>> 35d6406903ca95532e86f8583249e45cd150bf15
  },
  timeToAnswer: {
    type: Number,
    required: true
  }
}, { _id: false });

const permissionsSchema = new mongoose.Schema({
  view: {
    type: Array,
    required: true,
  },
  write: {
    type: Array,
    required: true
  }
}, { _id: false });

const perguntasSchema = new mongoose.Schema({
  pergunta: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
  },
  anexos: {
    type: Boolean,
    required: true,
  },
  comentarios: {
    type: Boolean,
    required: true
  },
  obrigatoria: {
    type: Boolean,
    required: true
  }
}, { _id: false });

const ChecklistSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
<<<<<<< HEAD
  answer_before: {
    type: String,
    required: true,
  },
  answer_after: {
    type: String,
    required: true
  },
=======
>>>>>>> 35d6406903ca95532e86f8583249e45cd150bf15
  ativo: {
    type: Boolean,
    required: true,
  },
  autoSelectUnity: {
    type: Boolean,
    required: true
  },
  expirationTime: expirationTimeSchema,
  permissions: permissionsSchema,
  perguntas: [perguntasSchema]
}, { timestamps: { createdAt: true, updatedAt: true } });

ChecklistSchema.pre('updateOne', async function(next) {
  const now = new Date().toISOString();
  console.log(`[UPDATE CHECKLIST EVENT]: Checklist: ${this.nome}, ID: ${this._id}, updatedAt: ${now}`);
  next();
});

ChecklistSchema.pre('save', async function(next) {
  const now = new Date().toISOString();
  console.log(`[CREATE CHECKLIST EVENT]: Checklist: ${this.nome}, ID: ${this._id}, createdAt: ${now}`);
  next();
});

const Checklist = mongoose.model('Checklist', ChecklistSchema);

module.exports = Checklist;