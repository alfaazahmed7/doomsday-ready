import app from "./app";
import { connectToDatabase } from "./config/db";

const PORT = process.env.PORT || 8000;
connectToDatabase();

app.listen(PORT, () => {
    console.log('Server is running properly');
});

export default app;