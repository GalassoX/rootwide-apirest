import app from "./app";
import { connectDB } from "./data/database";

app.listen(app.get('port'), async () => {
    await connectDB();
    console.log('Server running in port: ' + app.get('port'));
});