'use strict';

var parameterModel   = require('../database').models.parameter;

var create = function (data, callback){
    var newParametertype = new parameterModel(data);
    newParametertype.save(callback);
};

var find = function (data, callback){
    parameterModel.find(data, callback);
}

var findOne = function (data, callback){
    parameterModel.findOne(data, callback);
}

var findById = function (id, callback){
    parameterModel.findById(id, callback);
}

// var findByIdAndUpdate = function(id, data, callback){
//     parameterModel.findByIdAndUpdate(id, data, { new: true }, callback);
// }


module.exports = {
    parameter:parameterModel,
    create,
    find,
    findOne,
    findById,
   // findByIdAndUpdate,

};