const router = require('express').Router();

router.use('/*', (req, res) => {
  res.status(404).send({ message: '404: Not Found' });
});

module.exports = router;