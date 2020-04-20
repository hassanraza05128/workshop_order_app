'use strict';

var propertyModel   = require('../database').models.property;

var create = function (data, callback){
    var newproperty = new propertyModel(data);
    newproperty.save(callback);
};

var find = function (data, callback){
    propertyModel.find(data, callback);
}

var findOne = function (data, callback){
    propertyModel.findOne(data, callback);
}

var findById = function (id, callback){
    propertyModel.findById(id, callback);
}

var findByIdAndUpdate = function(id, data, callback){
   propertyModel.findByIdAndUpdate(id, data, { new: true }, callback);
}

module.exports = {
    property:propertyModel,
    create,
    find,
    findOne,
    findById,
    findByIdAndUpdate,

};