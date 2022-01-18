exports.handle404s = (req, res) => {
    res.status(404).send( {msg: 'Invalid URL - Page does not exist'});
};

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status) {
      res.status(err.status).send({ msg: err.msg });
    } else {
      next(err);
    }
  };
