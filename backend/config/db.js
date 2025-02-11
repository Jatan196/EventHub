import mongoose from "mongoose";

const connect= async () => {
const MONGO_URI="mongodb://localhost:27017/";//"mongodb+srv://tandonjatan:jatan@cluster0.q20ex.mongodb.net/";//"mongodb+srv://tandonjatan:skd@cluster0.x1f8t.mongodb.net/";

await mongoose.connect(MONGO_URI,{
   
}).then((data) => {
    console.log('Database connected');
  
}).catch((error)=>{
    console.log(error);
})  
};
 
export default connect;  