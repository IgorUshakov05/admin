let express = require('express');
const path = require('path');
let logger = require('morgan');
const axios = require('axios');
const cheerio = require('cheerio');
let indexRouter = require('./routes/index');
let setCurse = require('./routes/setCurse');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/admin', function(req, res) {
    res.sendFile(path.join(__dirname,  'public', 'admin.html'));
  });
app.post('/setCurse', setCurse)
app.get('/cb', async (req,res) => {
    try {
        const response = await axios.get('https://www.cbr.ru/currency_base/daily');
        const $ = cheerio.load(response.data);
        const currencies = [];
      
        // Находим все строки в таблице итерируемся по ним
        $('table.data').find('tr').each((index, element) => {
          if (index > 0) {
            const tds = $(element).find('td');
            const code = $(tds[1]).text();
            const name = $(tds[3]).text();
            const rate = $(tds[4]).text();
      
            if (['USD', 'CNY', 'GBP', 'EUR'].includes(code)) {
              currencies.push({ code, name, rate });
            }
          }
        });
      res.json(currencies)
        return currencies;
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        return null;
      }
})

app.listen(4000, () => {
    console.log("Server start");
})