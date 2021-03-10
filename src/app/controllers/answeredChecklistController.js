const express = require('express');
const router = express.Router();

const telegram = require('../../config/telegram');
const Unity = require('../models/unity');
const AnsweredChecklist = require('../models/answeredChecklist');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.get('/count/byUnity', async (req, res) => {

  const { unity, checklist, beforeDate, afterDate } = req.query;

  let query = {};
  if(unity) {
    query['checklistUnity._id'] = unity
  }
  if(beforeDate && afterDate) {
    query['answeredBy.answeredAt'] = { $gte: beforeDate, $lte: afterDate }
  }
  if(checklist) {
    query.checklistID = checklist
  }

  try {
    const checklists = await AnsweredChecklist
      .find(query).select('checklistUnity._id -_id');
    const unities = await Unity.find().select('apelido');

    let results = {}
    unities.forEach(unity => {
      const countChecklists = checklists.filter(checklist => {
        return (String(checklist.checklistUnity._id) === String(unity._id))
      }).length

      results[unity.apelido] = countChecklists
    })

    res.send(results);
  } catch (error) {
    res.status(400).send({ error: 'Falha ao realizar a operação.' });
    console.log(error);
  }
});

router.get('/grades/byUnity', async (req, res) => {

  const { unity, checklist, beforeDate, afterDate } = req.query;

  let query = {};
  if(unity) {
    query['checklistUnity._id'] = unity
  }
  if(beforeDate && afterDate) {
    query['answeredBy.answeredAt'] = { $gte: beforeDate, $lte: afterDate }
  }
  if(checklist) {
    query.checklistID = checklist
  }

  try {
    const grades = await AnsweredChecklist
      .find(query).select('nota checklistUnity._id');
    const unities = await Unity.find().select('apelido');

    let results = {}
    unities.forEach(unity => {
      const filter = grades.filter(grade => {
        return (String(grade.checklistUnity._id) === String(unity._id))
      })

      results[unity.apelido] = Number((filter.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.nota
      }, 0)/filter.length).toFixed(1)) || 0
    })

    res.send(results);
  } catch (error) {
    res.status(400).send({ error: 'Falha ao realizar a operação.' });
    console.log(error);
  }
});

router.get('/count', async (req, res) => {

  const { unity, checklist, beforeDate, afterDate } = req.query;

  let query = {};
  if(unity) {
    query['checklistUnity._id'] = unity
  }
  if(beforeDate && afterDate) {
    query['answeredBy.answeredAt'] = { $gte: beforeDate, $lte: afterDate }
  }
  if(checklist) {
    query.checklistID = checklist
  }
  try {
    const count = await AnsweredChecklist
      .find(query).countDocuments();
    res.send({ count });
  } catch (error) {
    res.status(400).send({ error: 'Falha ao realizar a operação. (Listar formulários respondidos)' });
    console.log(error);
  }
});

router.get('/average', async (req, res) => {

  const { unity, beforeDate, afterDate, checklist } = req.query;

  let query = {};
  if(unity) {
    query['checklistUnity._id'] = unity
  }
  if(beforeDate && afterDate) {
    query['answeredBy.answeredAt'] = { $gte: beforeDate, $lte: afterDate }
  }
  if(checklist) {
    query['checklistID'] = checklist
  }
  try {
    const results = await AnsweredChecklist
      .find(query).select('nota checklistID')

    const sumGrades = results.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.nota
    }, 0)

    const total = results.length;
    const average = isNaN(sumGrades/total) ? 0 : (sumGrades/total).toFixed(1);
    res.send({ average });
  } catch (error) {
    res.status(400).send({ error: 'Falha ao realizar a operação. (Listar formulários respondidos)' });
    console.log(error);
  }
});

router.get('/list', async (req, res) => {

  const { page = 1, unity, beforeDate, afterDate, checklist, answeredBy, sortType } = req.query;

  let query = {};
  if(unity) {
    query['checklistUnity._id'] = unity;
  }
  if(beforeDate && afterDate) {
    query['answeredBy.answeredAt'] = { $gte: beforeDate, $lte: afterDate }
  }
  if(checklist) {
    query['checklistName'] = new RegExp(checklist, 'i');
  }
  if(answeredBy) {
    query['answeredBy.name'] = new RegExp(answeredBy, 'i');
  }
  try {
    const results = await AnsweredChecklist
      .find(query).limit(5).skip((page - 1) * 5).sort(sortType)

    const count = await AnsweredChecklist
      .find(query).countDocuments();
    res.header('X-Total-Count', count);

    res.send({ results, count });
  } catch (error) {
    res.status(400).send({ error: 'Falha ao realizar a operação. (Listar formulários respondidos)' });
    console.log(error);
  }
});

router.get('/search/:id', async (req, res) => {
  try {
    const answeredChecklist = await AnsweredChecklist.findById(req.params.id);
    if(answeredChecklist == null) return res.status(404).send({ error: 'O formulário não existe!'});
    await AnsweredChecklist.findById(req.params.id, function (error, data) {
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
    const answeredChecklist = await AnsweredChecklist.findById(req.params.id);
    if(answeredChecklist == null) return res.status(404).send({ error: 'O formulário não existe!'});
    await AnsweredChecklist.findByIdAndUpdate(req.params.id, req.body, async function (error, data) {
      if(error) { 
        console.log(error); 
        res.status(400).send({ error: 'Falha ao encontrar o formulário!'}); 
      }
      res.send(data);
    });
    await answeredChecklist.updateOne();
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ error: 'Falha ao realizar a operação. (Atualizar formulário)'});
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const answeredChecklist = await AnsweredChecklist.findById(req.params.id);
    if(answeredChecklist == null) return res.status(404).send({ error: 'O formulário não existe!'});
    await AnsweredChecklist.findByIdAndDelete(req.params.id, async function (error, data) {
      if(error) { 
        console.log(error); 
        res.status(400).send({ error: 'Falha ao deletar o formulário!'}); 
      }
      if(data) {
        res.send(data);
        await answeredChecklist.remove();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: 'Falha ao realizar a operação. (Deletar formulário)'});
  }
});

router.post('/register', async (req, res) => {
  try {
    const answeredChecklist = await AnsweredChecklist.create(req.body);

    await telegram.sendMessage(-471032826, `
    Checklist Respondido! \n\nChecklist: ${answeredChecklist.checklistName}\nLocal: ${answeredChecklist.checklistUnity.name}\nPor: ${answeredChecklist.answeredBy.name}\nSetor: ${answeredChecklist.checklistUserProps.sector.name}\nNota: ${answeredChecklist.nota}\nLink: https://checklistweb.netlify.app/checklist/answereds/${answeredChecklist._id}/view\n\nRespondido em: ${new Date(answeredChecklist.createdAt).toLocaleString('pt-BR', { timeZone: 'America/Fortaleza' })}
    `);
    return res.send(answeredChecklist);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: 'Falha ao realizar a operação.'});
  }
});

module.exports = app => app.use('/checklist/answer', router);