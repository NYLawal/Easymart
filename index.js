require('express-async-errors');
require('dotenv').config();

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const morgan = require('morgan')
const express = require('express');
const jwt = require('jsonwebtoken')
const app = express();
const cors = require('cors');
// const multer = require('multer')              // multer will be used to handle the form data.
// const Aws = require('aws-sdk')

const connectDB = require('./backend/db/connect')
const productRouter = require('./backend/routers/productRouter');
const userRouter = require('./backend/routers/userRouter');
const homeRouter = require('./backend/routers/homeRouter');
const errorHandler= require('./backend/middleware/errorHandler')
// app.set('view-engine', 'pug')
// app.set('views', './views')


app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());
app.use((req, res, next) => {
    res.setHeader(
      "Access-Control-Allow-Origin",
      "https://your-frontend.com"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Private-Network", true);
    //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
    res.setHeader("Access-Control-Max-Age", 7200);
  
    next();
  });

  // Set preflight
app.options("*", (req, res) => {
    console.log("preflight");
    if (
      req.headers.origin === "https://easymart-gap9.onrender.com/api/v1" &&
      allowMethods.includes(req.headers["access-control-request-method"]) &&
      allowHeaders.includes(req.headers["access-control-request-headers"])
    ) {
      console.log("pass");
      return res.status(204).send();
    } else {
      console.log("fail");
// app.use(express.static('public'))


if (app.get('env') === 'development' ) {
    app.use(morgan('tiny'))
    console.log('morgan enabled...')
}

app.use('/api/v1', homeRouter )
app.use('/api/v1/user', userRouter )
app.use('/api/v1/product', productRouter)
app.use(errorHandler)

 const port = process.env.PORT || 3000
async function start(){
    try {
        const success = await connectDB(process.env.Mongo_URI)
        if (success) console.log('connected')
        app.listen(port, console.log(`server listening on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}
start()

// app.listen(port, ()=>{
//    startupDebugger('server listening on port ' + port);
// })