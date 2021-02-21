const mongoose = require('../../database');

const Attachment = require('../models/attachment');

const anexoSchema = new mongoose.Schema({
  name: String,
  size: Number,
  key: String,
  url: String,
  type: String,
});

const answersSchema = new mongoose.Schema({
  pergunta: {
    type: String,
    required: true
  },
  resposta: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true
  },
  comentario: {
    type: String,
  },
  anexo: anexoSchema,
}, { _id: false });

const checklistUserPropsSchema = new mongoose.Schema({
  unity: new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
  }),
  sector: new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
  }),
  cargo: new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
  }),
}, { _id: false });

const AnsweredChecklistSchema = new mongoose.Schema({
  answeredBy: new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    answeredAt: {
      type: Date,
      default: Date.now()
    },
  }),
  checklistName: {
    type: String,
    required: true,
  },
  checklistDesc: {
    type: String,
    required: true,
  },
  checklistID: {
    type: String,
    required: true,
  },
  checklistUnity: new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
  }),
  checklistUserProps: checklistUserPropsSchema,
  permissions: new mongoose.Schema({
    view: {
      type: Array
    }
  }, { _id: false }),
  nota: {
    type: Number,
    required: true
  },
  answers: [answersSchema],
}, { timestamps: { createdAt: true, updatedAt: false } });

/*AnsweredChecklistSchema.pre('save', async function(next) {
  const now = Date.now();
  console.log(`[ANSWER CHECKLIST EVENT]: Checklist: ${this.name}, ID: ${this._id}, answeredAt: ${now}`);
  next();
});*/

AnsweredChecklistSchema.post('remove', async function(req, next) {
  try {
    const now = new Date().toLocaleString();
    const { checklistName, answers } = req;
    for (const [idx, answer] of answers.entries()) {
      if(answer.anexo) {
        const attachment = await Attachment.findById(answer.anexo._id);
        await attachment.remove();
        console.log(`[DELETE EVENT]: ${answer.anexo.name} deleted from ${checklistName}, at: ${now}`);
      }
    }
    console.log(`[DELETE EVENT]: ${checklistName} was successfully deleted, at: ${now}`);
    next();
  } catch (error) {
    console.log(error);
  }
});

const AnsweredChecklist = mongoose.model('AnsweredChecklist', AnsweredChecklistSchema);

module.exports = AnsweredChecklist;