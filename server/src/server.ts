import app from "./app.js";
import { connectToDatabase } from "./config/db.js";

const PORT = process.env.PORT || 8000;
connectToDatabase();

app.listen(PORT, () => {
    console.log('Server is running properly');
});

export default app;