

// const ErrorHandler = (err, req, res, next) => {
//     console.log("Middleware Error Handling");
//     const errStatus = err.statusCode || 500;
//     const errMsg = err.message || 'Something went wrong';
//     res.status(errStatus).json({
//         success: false,
//         status: errStatus,
//         message: errMsg.includes("E11000") ? 'duplicate value: product ID already exists': errMsg,
//         // stack: err.stack
//         // stack: process.env.NODE_ENV === 'development' ? err.stack : {}
//     })
// }

const ErrorHandler = (err, req, res, next) => {
console.log("Middleware Error Handling");

  return res.status(err.status || 500).json({
    status: "Failed",
    message:  err.message || 'something went wrong',
    message: err.message.includes("E11000") ? 'duplicate value: product ID already exists': err.message || 'something went wrong',
  })
}


process.on('uncaughtException', err =>{
    console.log(`something happened: ${err}`);
    process.exit(1);
})

module.exports = ErrorHandler