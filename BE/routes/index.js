var express = require('express');
var router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const eventServices = require('../services/eventServices')
const path = require('path');

function streamToBuffer(req, res, next) {

  var downloadFile = req.params.filename;
  const filePath = path.join(__dirname, '../uploads/' + downloadFile);
  const stream = fs.createReadStream(filePath);
  const chunks = [];

  stream.on('data', (chunk) => {
    chunks.push(chunk);
  });

  stream.on('end', () => {
    req.excelBuffer = Buffer.concat(chunks);
    next();
  });

  stream.on('error', (error) => {
    console.error('Error reading Excel file:', error);
    res.status(500).send('Error reading Excel file.');
  });
}
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const isCheckingFileString = req.query.isCheckingFile
    const isCheckingFile = isCheckingFileString === "true";
    var filename = `Registry-${req.params.eventId}_${file.originalname}`
    if (isCheckingFile) {
      filename = `CheckIn-${req.params.eventId}_${file.originalname}`
    }
    cb(null, `${filename}`);
  },
});

const upload = multer({ storage });

router.post('/upload/:eventId', upload.single('excelFile'), async function (req, res, next) {
  if (req.file) {
    try {
      const workbook = xlsx.readFile(req.file.path);
      const sheetNameList = workbook.SheetNames;
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);
      const hasEmail = sheetData.some(row => row.hasOwnProperty('email'));
      var mssvList = hasEmail ? sheetData.filter(row => row.hasOwnProperty('email')).map(row => row.email)
       : sheetData.filter(row => row.hasOwnProperty('mssv')).map(row => row.mssv + '@gmail.com');
      await eventServices.uploadExcelEvent(req, mssvList);
      res.status(200).send('File uploaded successfully.');
    } catch (error) {
      res.status(400).send('Error uploading file.');
    }
  } else {
    res.status(400).send('Unable to recognize uploaded file.');
  }
});

router.get('/download-file/:filename', streamToBuffer, async (req, res) => {
  try {
    var downloadFile = req.query.filename;

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${downloadFile}"`);

    // Send the buffer as the response
    res.send(req.excelBuffer);
  } catch (error) {
    console.error('Error exporting MSSVs:', error);
    res.status(500).send('Error exporting MSSVs.');
  }
});

module.exports = router;
