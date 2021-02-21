const mongoose = require('../../database');
const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const s3 = new aws.S3();

const attachmentSchema = new mongoose.Schema({
  name: String,
  size: Number,
  key: String,
  url: String,
  mimetype: String,
}, { timestamps: { createdAt: true } });

attachmentSchema.pre('save', function() {
  if(!this.url) {
    this.url = `${process.env.APP_URL}/files/${this.key}`;
  }
});

attachmentSchema.pre('remove', function() {
  if(process.env.STORAGE_TYPE === 's3') {
    return s3.deleteObject({
      Bucket: 'checklistcompremax2',
      Key: this.key,
    }).promise()
  } else return promisify(fs.unlink)(
    path.resolve(__dirname, "..", "..", "..", "tmp", "uploads", this.key)
  );
})

const Attachment = mongoose.model('Attachment', attachmentSchema);

module.exports = Attachment;