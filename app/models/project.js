'use strict';

var projectModel   = require('../database').models.project;

var create = function (data, callback){
    var newProjecttype = new projectModel(data);
    newProjecttype.save(callback);
};

var find = function (data, callback){
    projectModel.find(data, callback);
}

var findOne = function (data, callback){
    projectModel.findOne(data, callback);
}

var findById = function (id, callback){
    projectModel.findById(id, callback);
}

var findByIdAndUpdate = function(id, data, callback){
    projectModel.findByIdAndUpdate(id, data, { new: true }, callback);
}


module.exports = {
    project:projectModel,
    create,
    find,
    findOne,
    findById,
    findByIdAndUpdate,
};