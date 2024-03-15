var express = require('express');
var router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const moment = require('moment');
const eventServices = require('../services/eventServices')
// const upload = multer({ dest: 'uploads/' });
function streamToBuffer(req, res, next) {
  //    const filename = req.query.filename;

  const downloadFile = "05-03-2024_Book1.xlsx";
  const filePath = 'D:\\GitHub\\IT-Project-2\\BE\\uploads\\' + downloadFile;

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
    cb(null, `${req.params.eventId}_${file.originalname}`);
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
    res.setHeader('Content-Disposition', `attachment; filename="${downloadFile}"`); // Use original filename

    // Send the buffer as the response
    res.send(req.excelBuffer);
  } catch (error) {
    console.error('Error exporting MSSVs:', error);
    res.status(500).send('Error exporting MSSVs.');
  }
});

module.exports = router;
