'use strict';

var unitModel   = require('../database').models.unit;

var create = function (data, callback){
    var newunit = new unitModel(data);
    newunit.save(callback);
};

var find = function (data, callback){
    unitModel.find(data, callback);
}

var findOne = function (data, callback){
    unitModel.findOne(data, callback);
}

var findById = function (id, callback){
    unitModel.findById(id, callback);
}

var findByIdAndUpdate = function(id, data, callback){
    unitModel.findByIdAndUpdate(id, data, { new: true }, callback);
}


module.exports = {
    unit:unitModel,
    create,
    find,
    findOne,
    findById,
    findByIdAndUpdate,

};