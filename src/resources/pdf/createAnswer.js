//const PDFDocument =  require('pdfkit');
const fetchImage = require('../../utils/fetchImage');
const axios = require('axios');

function createAnswer(doc, content) {
  generateHeader(doc, content);
  generateBody(doc, content);
  //generateCustomerInformation(doc, invoice);
  //generateInvoiceTable(doc, invoice);
  //generateFooter(doc);
}

function generateHeader(doc, content) {
  const { 
    checklistName, 
    checklistDesc,
    checklistUserProps, 
    answeredBy, 
    nota,
  } = content;
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text(checklistName, 50, 57)
    .fontSize(16)
    .text(answeredBy.name, 50, 87)
    .fontSize(14)
    .text(`Nota: ${nota}`, 50, 107)
    .fontSize(18)
    .text(checklistDesc, 50, 167)
    .fontSize(10)
    .text(checklistUserProps.cargo.name, 200, 50, { align: "right" })
    .text(`${checklistUserProps.unity.name}, ${checklistUserProps.sector.name}`, 200, 65, { align: "right" })
    .text(`Feito em: ${new Date(answeredBy.answeredAt).toLocaleString('pt-BR')}`, 200, 80, { align: "right" })
    .moveDown();
}

async function handleImage(url) {
  const image = await fetchImage(url);
  return image;
}

async function generateBody(doc, content) {
  const { 
    answers,
  } = content;

  doc
  .fillColor("#444444")
  .fontSize(18)
  .text('Respostas:', 50, 247)
  .moveDown()

  for (const [index, answer] of answers.entries()) {
    if (doc.y > 680) {
      doc
      .addPage()
      .fillColor("#444444")
      doc.y = 50;
    }
    //if(answer.anexo) var image = await fetchImage(answer.anexo.url);
    doc
    .fontSize(12)
    .text(`Pergunta ${index+1}`, { width: 410, align: 'left', lineBreak: true, lineGap: 5 })
    .fontSize(16)
    .text(answer.pergunta, { width: 410, align: 'left', lineBreak: true, lineGap: 8 })
    .fontSize(14)
    .text(`Resposta: ${answer.resposta}`, { width: 410, align: 'left', lineBreak: true, lineGap: 10 })
    answer.comentario ? (
      doc.text(`Comentário: ${answer.comentario}`, { width: 410, align: 'left', lineBreak: true, lineGap: 10 })
    ) : doc.text(`Comentário: Nenhum`, { width: 410, align: 'left', lineBreak: true, lineGap: 10 })
    answer.anexo ? (
      axios.get(answer.anexo.url, {responseType: 'arraybuffer'}).then(response => {
        const pngBuffer = Buffer.from(response.data, 'base64');
        //console.log(pngBuffer)
        //console.log(response.data)
        doc.image(pngBuffer, 0, 15, {width: 300});
      })
      //doc.text(`Anexo: ${image}`, { width: 410, align: 'left', lineBreak: true, lineGap: 10 })
    ) : doc.text(`Anexo: Nenhum`, { width: 410, align: 'left', lineBreak: true, lineGap: 15 })
    .moveDown()
  }

  /*answers.forEach((answer, index) => {
    if (doc.y > 680) {
      doc
      .addPage()
      .fillColor("#444444")
      doc.y = 50;
    }
    doc
    .fontSize(12)
    .text(`Pergunta ${index+1}`, { width: 410, align: 'left', lineBreak: true, lineGap: 5 })
    .fontSize(16)
    .text(answer.pergunta, { width: 410, align: 'left', lineBreak: true, lineGap: 8 })
    .fontSize(14)
    .text(`Resposta: ${answer.resposta}`, { width: 410, align: 'left', lineBreak: true, lineGap: 10 })
    answer.comentario ? (
      doc.text(`Comentário: ${answer.comentario}`, { width: 410, align: 'left', lineBreak: true, lineGap: 10 })
    ) : doc.text(`Comentário: Nenhum`, { width: 410, align: 'left', lineBreak: true, lineGap: 10 })
    answer.anexo ? (
      doc.text(`Anexo: ${answer.anexo.url}`, { width: 410, align: 'left', lineBreak: true, lineGap: 10 })
    ) : doc.text(`Anexo: Nenhum`, { width: 410, align: 'left', lineBreak: true, lineGap: 15 })
    .moveDown()
  })*/
}

/*function generateCustomerInformation(doc, invoice) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Invoice", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text('invoice.invoice_nr', 150, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .text("Balance Due:", 50, customerInformationTop + 30)
    .text(
      formatCurrency('invoice.subtotal - invoice.paid'),
      150,
      customerInformationTop + 30
    )

    .font("Helvetica-Bold")
    .text('invoice.shipping.name', 300, customerInformationTop)
    .font("Helvetica")
    .text('invoice.shipping.address', 300, customerInformationTop + 15)
    .text(
      'invoice.shipping.city' +
        ", " +
        'invoice.shipping.state' +
        ", " +
        'invoice.shipping.country',
      300,
      customerInformationTop + 30
    )
    .moveDown();

  generateHr(doc, 252);
}*/

/*function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Description",
    "Unit Cost",
    "Quantity",
    "Line Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.item,
      item.description,
      formatCurrency(item.amount / item.quantity),
      item.quantity,
      formatCurrency(item.amount)
    );

    generateHr(doc, position + 20);
  }*/

  /*const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Subtotal",
    "",
    formatCurrency(invoice.subtotal)
  );

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    "",
    "",
    "Paid To Date",
    "",
    formatCurrency(invoice.paid)
  );

  const duePosition = paidToDatePosition + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Balance Due",
    "",
    formatCurrency(invoice.subtotal - invoice.paid)
  );
  doc.font("Helvetica");
}*/

/*function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Payment is due within 15 days. Thank you for your business.",
      50,
      780,
      { align: "center", width: 500 }
    );
}*/

/*function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(cents) {
  return "$" + (cents / 100).toFixed(2);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}*/

module.exports = {
  createAnswer
};