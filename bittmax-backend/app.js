const express = require('express')
const bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
const getData = require('./users/users.controller')
const routes = require('./users/users.route')
const app = express()
const mongoose = require('./mongoose')
const port = 3001
let privateKey = '123456werty3456';
const cors = require('cors');

const whitelist = null;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
const corsOptions = {
    origin(origin, callback) {
        if (!whitelist || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};
app.use(cors(corsOptions));

app.get('/', (req, res) => res.send({ token: jwt.sign({ name: 'nikhil', iat: 3600 }, privateKey) }))
app.use('/data', routes);
mongoose.connect();
app.listen(port, () => console.log(`test app on port ${port}!`))

