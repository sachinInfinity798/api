var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EmployeeSchema = new Schema({
    Name: String,
    Address: String,
    DOB: { type: Date },
    Gender: String,
    City: String,
    Mobile: Number,
    Email: String,
});

module.exports = mongoose.model('employeeInfo', EmployeeSchema);