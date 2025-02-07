import app from './index'
import {setupSwagger} from "./swaggerConfig";
const port = process.env.PORT || 8080;

setupSwagger(app)

app.listen(port, () => {
    console.log(`Running on port ${port}`);
});

