const express= require('express');
const router = express.Router();

router.get('/', (req,res)=>
{
    obj={
            a:"that",
            b:43
    }
    res.json(obj);
})
module.exports=router