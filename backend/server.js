const express = require("express");
const cors = require("cors");
const sql = require("mysql2");

const app = express();

const portNo = 1301;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

const db = sql.createConnection({
    "user":"root",
    "host":"127.0.0.1",
    "password":"MySQL@2025",
    "port":"3306",
    "database":"pharmacy_db"

})

db.connect((err)=>{
    if(err){
        console.log("Error in connecting database");
    }
    else{
        console.log("database connected successfully")
    }
})


//db querries
const get="select * from medicineData;"
const add="insert into medicineData (medName,category,price,expDate,stock) values (?,?,?,?,?);"
const del="delete from medicineData where id=?;"
const update="update  medicineData set medName=? , category=? , price=? , expDate=? ,stock=? where id=?;";


//opr
app.get("/data" , (req,res)=>{
    db.query(get , (err,results)=>{
        if(err){
            console.log("Error in getting data");
            return res.status(500).json({err:err.message});
        }
        else{
            console.log("successfull get operation");
            res.status(200).json(results)
        }
    })
})
app.post("/data" , (req,res)=>{
    const{medName,category,price,expDate,stock}=req.body;
    const newDate = expDate.slice(0,10);
    
    db.query(add,[medName,category,price,newDate,stock],(err,results)=>{
        if(err){
            console.log("Error in adding data");
            return res.status(500).json({err:err.message});

        }
        else{
            console.log("successfull add operation");
            res.status(200).json(results)

        }
    })
})
app.delete("/data/:id" , (req,res)=>{
    const {id}=req.params;
    db.query(del ,[id],(err,results)=>{
       if(err){ console.log("Error in deleting data");
            return res.status(500).json({err:err.message});
       }
       else{
            console.log("successfull delete operation");
            res.status(200).json(results)

        }

    })
})
app.put("/data/:id" , (req,res)=>{
   const {id}=req.params;
    const{medName,category,price,expDate,stock}=req.body;
    const newDate = expDate.slice(0,10)

    db.query(update , [medName,category,price,newDate,stock,id],(err,results)=>{
        if(err){ console.log("Error in updating data");
            return res.status(500).json({err:err.message});
       }
       else{
            console.log("successfull update operation");
            res.status(200).json(results)

        }

    })
})




app.listen(portNo , ()=>{
    console.log("port connected sccessfully");
})