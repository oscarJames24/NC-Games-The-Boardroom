exports.handle404s = (req, res) => {
    res.status(404).send( {msg: 'Invalid URL - Page does not exist'});
};

