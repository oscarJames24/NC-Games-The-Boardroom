exports.getApiDocumentation = (req, res) => {
  res.status(200).send(require('../endpoints.json'));
};
