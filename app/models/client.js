'use strict';

var custumerModel   = require('../database').models.client;

var create = function (data, callback){
    var newCustumer = new custumerModel(data);
    newCustumer.save(callback);
};

var find = function (data, callback){
    custumerModel.find(data, callback);
}

var findOne = function (data, callback){
    custumerModel.findOne(data, callback);
}

var findById = function (id, callback){
    custumerModel.findById(id, callback);
}

var findByIdAndUpdate = function(id, data, callback){
    custumerModel.findByIdAndUpdate(id, data, { new: true }, callback);
}

module.exports = {
    client:custumerModel,
    create,
    find,
    findOne,
    findById,
    findByIdAndUpdate,

};