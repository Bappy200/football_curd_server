const express = require("express");
const cors = require("cors");
const {graphqlHTTP} = require("express-graphql");
const dbConnect = require("./config/dbConnect");
const schema = require("./schema/schema")
require("dotenv").config();

const PORT = process.env.PORT || 5001;

const app = express();


//mongodb conncet
dbConnect();


//midelware
app.use(cors());
app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: process.env.NODE_DEV === 'development'
}))


app.get("/", (req, res)=>{
    res.send("hell0o")
})
     

//listen port
app.listen(PORT, ()=>{
    console.log(`Server is runing at port ${PORT}`);
})

