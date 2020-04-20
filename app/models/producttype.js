'use strict';

var producttypeModel   = require('../database').models.producttype;

var create = function (data, callback){
    var newProducttype = new producttypeModel(data);
    newProducttype.save(callback);
};

var find = function (data, callback){
    producttypeModel.find(data, callback);
}

var findOne = function (data, callback){
    producttypeModel.findOne(data, callback);
}

var findById = function (id, callback){
    producttypeModel.findById(id, callback);
}

var findByIdAndUpdate = function(id, data, callback){
    producttypeModel.findByIdAndUpdate(id, data, { new: true }, callback);
}

module.exports = {
    producttype:producttypeModel,
    create,
    find,
    findOne,
    findById,
    findByIdAndUpdate,

};