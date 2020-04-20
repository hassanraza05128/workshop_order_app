'use strict';

var materialModel   = require('../database').models.material;

var create = function (data, callback){
    var newMaterial = new materialModel(data);
    newMaterial.save(callback);
};

var find = function (data, callback){
    materialModel.find(data, callback);
}

var findOne = function (data, callback){
   return materialModel.findOne(data, callback);
}

var findById = function (id, callback){
   return materialModel.findById(id, callback);
}

var findByIdAndUpdate = function(id, data, callback){
    materialModel.findByIdAndUpdate(id, data, { new: true }, callback);
}

module.exports = {
    mat:materialModel,
    create,
    find,
    findOne,
    findById,
    findByIdAndUpdate,

};