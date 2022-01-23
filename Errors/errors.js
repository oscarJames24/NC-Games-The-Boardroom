exports.handle404s = (err, req, res) => {
  res.status(404).send({ msg: 'Invalid URL - Page does not exist' });
};

exports.handlePsqlErrors = (err, req, res, next) => {
  console.log(err, 'gets to psql')
  console.log(err.code)

  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad Request - Invalid Input' });
  } else if (err.code === '23503') {
    res.status(400).send({ msg: 'Invalid input - extra fields submitted' });
  } else if (err.code === '23502') {
    res.status(400).send({ msg: 'Invalid input - missing fields' });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  console.log('gets to custom')

  if (err.status) {
    console.log(err, 'custom errors')
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err, 'server 500 handler')
  res.status(500).send({ msg: 'Internal server error' });
};
