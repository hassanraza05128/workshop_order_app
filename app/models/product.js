'use strict';

var productModel   = require('../database').models.product;

var create = function (data, callback){
    var newProducttype = new productModel(data);
    newProducttype.save(callback);
};

var find = function (data, callback){
    productModel.find(data, callback);
}

var findOne = function (data, callback){
    productModel.findOne(data, callback);
}

var findById = function (id, callback){
    productModel.findById(id, callback);
}

var findByIdAndUpdate = function(id, data, callback){
    productModel.findByIdAndUpdate(id, data, { new: true }, callback);
}


module.exports = {
    product:productModel,
    create,
    find,
    findOne,
    findById,
    findByIdAndUpdate,

};