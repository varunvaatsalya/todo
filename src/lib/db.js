const {MONGO_URL} = process.env
export const connectionSrt = MONGO_URL


export async function connectDB(){
    try {
        await mongoose.connect(connectionSrt);
        console.log("Connected Successfully");
    } catch (error) {
        console.error("Connection Error: ", error);
    }
}