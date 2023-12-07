const mongoose = require('mongoose');
const schema = mongoose.Schema;
const userSchema = new schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required :true
    },
    password : {
        type : String,
        required : true
    },
    mobile : {
        type : Number
    },
    address : {
        type : String
    },
    active : {
        type : Boolean,
        default : true,
    },
    designation : {
        type : String,
    },
    image : {
        type : String,
        default : 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp',
    }
})
module.exports = mongoose.model('usermng', userSchema)