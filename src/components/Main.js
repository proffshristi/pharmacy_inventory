import react from "react";
import { useEffect, useState } from "react";
import pharmacyServices from "../services/pharmacyServices";

function Main(){

    const[data,setdata] = useState([]);
    const[form , setForm]=useState({medName:"" , category:"" , price:0 , expDate:"" , stock:""});
    const[editing , setEditing] = useState(false);
    const[medName , setMedName] = useState("");
    
    useEffect(()=>{
         pharmacyServices.getAll().then((rec)=>(setdata(rec)));

    },[])

    const handleChange=async (e)=>{
        setForm({...form , [e.target.name]:[e.target.value]})

    }

    const handleAdd=async()=>{
        if(!form.medName || !form.category || !form.price || !form.expDate || !form.stock){
            alert("fill details completely")
        }
        const add = await pharmacyServices.addData(form);
        setForm({medName:"" , category:"" , price:0 , expDate:"" , stock:""})
         pharmacyServices.getAll().then((rec)=>(setdata(rec)));

    }

    const handleDelete = async(id)=>{
        await pharmacyServices.delData(id);
         pharmacyServices.getAll().then((rec)=>(setdata(rec)));
    }

    const handleEdit=async(id)=>{
        console.log(id)
        const dataToUpdate = data.find((med)=>(
            med.id == id

        ))
        setForm(dataToUpdate);
        setEditing(true); 

    }
    const handlegetmedName = async(e)=>{
        setMedName(e.target.value)
        const length = medName.length;
        const newData = data.filter((medi)=>(
            medi.medName.slice(0,length) == medName
        ))
        setdata(newData);

        
    }

    const handleupdate = async()=>{
        setEditing(false);
        await pharmacyServices.updateData(form.id , form);
        setForm({medName:"" , category:"" , price:0 , expDate:"" , stock:""})
         pharmacyServices.getAll().then((rec)=>(setdata(rec)));

    }
    
    return(
        <div className="p-3 container">
            <div className="p-3 ">
                <h1>Pharmacy Management App</h1>
                </div>
                <div>
                    <form>
                        <label></label>
                        <input type="text" name="medName" value={medName} onChange={handlegetmedName}></input>
                    </form>
                </div>


                <div className="p-3">
                    <table className="table table-success table-striped">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Medicine Name</th>
                                <th>category</th>
                                <th>price</th>
                                <th>Exp Date</th>
                                <th>Stock</th>
                                <th>Edit</th>
                                <th>delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((med)=>{
                                    return(
                                        <tr key={med.id}>
                                            <td>{med.id}</td>
                                            <td>{med.medName}</td>
                                            <td>{med.category}</td>
                                            <td>{med.price}</td>
                                            <td>{med.expDate}</td>
                                            <td>{med.stock}</td>
                                            <td><button className="btn btn-secondary"onClick={()=>handleEdit(med.id)}>Edit</button></td>
                                            <td><button className="btn btn-danger"onClick={()=>handleDelete(med.id)}>Delete</button></td>
                                        </tr>
                                    )
                                })

                            }
                        </tbody>
                    </table>
                </div>


                <div>
                    <form>
                        <label>Medicine Name</label>
                        <input type="text" name="medName" value={form.medName} required onChange={handleChange}></input>
                        <label>category</label>
                        <input type="text" name="category" value={form.category} required onChange={handleChange}></input>
                        <label>Price</label>
                        <input type= "number" name="price" value={form.price} required onChange={handleChange}></input>
                        <label>Exp Date</label>
                        <input type="date" name="expDate" value={form.expDate} required onChange={handleChange}></input>
                        <label>Stock</label>
                        <input type="number" name="stock" value={form.stock} required onChange={handleChange}></input>
                        
                    </form>
                   {editing? <button onClick={handleupdate}>Update</button>: <button onClick={handleAdd}>Add</button>}
                </div>
        </div>
    )

}

export default Main;