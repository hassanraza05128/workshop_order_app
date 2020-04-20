'use strict';

var RawModel   = require('../database').models.raw;

var create = function (data, callback){
    var newRaw = new RawModel(data);
    newRaw.save(callback);
};

var find = function (data, callback){
    RawModel.find(data, callback);
}

var findOne = function (data, callback){
    RawModel.findOne(data, callback);
}

var findById = function (id, callback){
    RawModel.findById(id, callback);
}

var findByIdAndUpdate = function(id, data, callback){
   RawModel.findByIdAndUpdate(id, data, { new: true }, callback);
}

module.exports = {
    property:RawModel,
    create,
    find,
    findOne,
    findById,
    findByIdAndUpdate,
};