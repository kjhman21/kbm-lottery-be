require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()
const port = process.env.API_SERVER_PORT;

// Body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

var whitelist = process.env.CORS_DOMAINS.split(',');
var corsOptions = {
origin: function (origin, callback) {
					if (!origin || whitelist.indexOf(origin) !== -1) {
						callback(null, true)
					} else {
						console.log(whitelist)
						console.log(origin);
						callback(new Error('Not allowed by CORS'))
					}
				},
methods: "GET,POST,PUT,DELETE",
};

app.use(cors(corsOptions));

app.use('/', require('./routes'));

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
