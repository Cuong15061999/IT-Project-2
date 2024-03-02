var express = require('express');
var router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const upload = multer({ dest: 'uploads/' });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// TODO Store list student
router.post('/upload', upload.single('excelFile'), (req, res) => {
  const file = req.file;
  if (!file) {
      return res.status(400).send('No file uploaded.');
  }

  try {
    // Read the Excel file
    const workbook = xlsx.readFile(file.path);
    const sheet_name_list = workbook.SheetNames;
    const data = fs.readFileSync(file.path);
    const currentDate = moment().format('DD-MM-YYYY');
    const filenameWithoutExt = path.basename(file.originalname, '.xlsx'); // Uses path.basename

    const newPath = path.join(__dirname, '..', 'uploads', `${filenameWithoutExt}_${currentDate}.xlsx`);
    fs.writeFileSync(newPath, data);

    // Get the first sheet data
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    // Filter data based on "MSSV" column
    const mssv_list = sheetData.filter(row => row.hasOwnProperty('mssv')).map(row => row.mssv);

    // Store into student participate
    console.log('MSSV list:', mssv_list); // Example usage, replace with your logic
    res.send('MSSV data extracted successfully!');
  } catch (error) {
    console.error('Error processing Excel file:', error);
    res.status(500).send('Error processing Excel file.');
  } finally {
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
      console.log('Uploaded file deleted successfully.');
    }  }
});

module.exports = router;
