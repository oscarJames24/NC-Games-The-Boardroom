const { PORT = 9090 } = process.env;
const app = require('./app')

app.listen(9090, (err) => {
    if (err) throw err;
    console.log(`listening on 9090`)
})