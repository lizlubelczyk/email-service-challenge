import app from './index'
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Running on port ${port}`);
});
