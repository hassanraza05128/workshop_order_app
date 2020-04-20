'use strict';

var express	 	= require('express');
var router 		= express.Router();
// var passport 	= require('passport');
//var multipartMiddleware = require('connect-multiparty')();
//
// var User = require('../models/user');
//var Client = require('../models/client');
// var Mat = require('../models/material');
// var Producttype = require('../models/producttype');

var ProductTypeController=require('../controllers/productType');
var ProductController=require('../controllers/product');
var MatController=require('../controllers/material');
var ClientController=require('../controllers/client');
var UserController=require('../controllers/user');
var UnitController=require('../controllers/settings/unit');
var ParameterController=require('../controllers/settings/parameter');
var PropertyController=require('../controllers/settings/property');
var RawController=require('../controllers/settings/raw');

var checkAuth=function(req, res, next){
    // if(req.isAuthenticated())
    //     next();
    // else
    //     res.redirect('/admin/login');
    next();
}

var checkAdmin=function(req, res, next){
    // if(req.user.type=='admin')
    //     next();
    // else
    //     res.redirect('/admin');
    next();
}

router.all('/*', function (req, res ,next) {
    res.locals.user = req.user;
    next();
});
// content test
router.get('/content', checkAuth, function(req, res, next) {
    res.render('admin/content');
});

// Home page
router.get('/', checkAuth, function(req, res, next) {
    res.render('admin/content');
});


//////////////////////////// Client/////////////////////////
// Register via username and password
router.get('/clientreg', checkAuth, ClientController.clientreg_get);
router.post('/clientreg', checkAuth, ClientController.clientreg_post);
// client list or table
router.get('/allclients', checkAuth, ClientController.allclients);
// Delete client
router.get('/clientdelete', checkAuth, ClientController.clientdelete);
router.get('/clientrestore', checkAuth, ClientController.clientrestore);
////////////////////////////    /client /////////////////////
///////////////////////////////   USER    //////////////////////////
// Login
router.get('/login', UserController.login_get);
router.post('/login', UserController.login_post );
// Logout
router.get('/logout', UserController.logout );
// Register via username and password
router.get('/register', checkAuth, checkAdmin, UserController.register_get );
router.post('/register', checkAuth, checkAdmin, UserController.register_post);
// user list or table
router.get('/allusers', checkAuth, checkAdmin, UserController.allusers);
// active /deactive user
router.get('/userstatus', checkAuth, checkAdmin, UserController.userstatus);
// Delete user
router.get('/userdelete', checkAuth, checkAdmin, UserController.userdelete );
router.get('/userrestore', checkAuth, checkAdmin, UserController.userrestore );
// self profile edit page
router.get('/profile_edit', checkAuth, UserController.profile_edit_get);
router.post('profile_edit', checkAuth, UserController.profile_edit_post);
// user edit by id
router.get('/userupdate', checkAuth, UserController.userupdate_get);
router.post('/userupdate', checkAuth, UserController.userupdate_post);
///////////////////////////////   /USER    //////////////////////////

//////////////////////////// Material/////////////////////////
// Register Material
router.get('/matreg', checkAuth, MatController.matreg_get);
router.post('/matreg', checkAuth, MatController.matreg_post );
// Materials list or table
router.get('/allmats', checkAuth, MatController.allmats );
// Delete client
router.get('/matdelete', checkAuth, MatController.matdelete );
// Restore Deleted client
router.get('/matrestore', checkAuth, MatController.matrestore );
router.get('/matupdate', checkAuth, MatController.matupdate );

////////////////////////////    /Material /////////////////////

///////////////////////////     Product Type/////////////////////////
// Register Product Type
/*router.get('/producttypereg', checkAuth, ProductTypeController.producttypereg_get );
router.post('/producttypereg', checkAuth, ProductTypeController.producttypereg_post);
// Product Type list or table
router.get('/allproducttypes', checkAuth, ProductTypeController.allproducttypes);
// Delete Product Type
router.get('/producttypedelete', checkAuth, ProductTypeController.producttypedelete);
// Restore Deleted Product Type
router.get('/producttyperestore', checkAuth, ProductTypeController.producttyperestore);

router.get('/producttypeupdate', checkAuth, ProductTypeController.producttypeupdate_get);
router.post('/producttypeupdate', checkAuth, ProductTypeController.producttypeupdate_post);*/

router.get('/allproducttypes', checkAuth, ProductTypeController.ProductTypesPage_get );
router.get('/producttypes_ajax', checkAuth, ProductTypeController.ProductTypes_ajax );
router.post('/producttypes_list_ajax', checkAuth, ProductTypeController.ProductTypes_list_ajax );
router.post('/producttypes_leaf_list_ajax', checkAuth, ProductTypeController.ProductTypes_leaf_list_ajax );
router.post('/producttypes_child_list_ajax', checkAuth, ProductTypeController.ProductTypes_child_list_ajax );
router.post('/producttype_reg_ajax', checkAuth, ProductTypeController.newProductTypeReg );
router.post('/producttype_update_ajax', checkAuth, ProductTypeController.ProductTypeUpdate );
router.post('/producttype_action_ajax', checkAuth, ProductTypeController.ProductTypeActions );

////////////////////////////    /Product Type /////////////////////
///////////////////////////     Product /////////////////////////
// Register Product
router.get('/productreg', checkAuth, ProductController.productreg_get );

router.post('/productreg',ProductController.productreg_post );
router.post('/contentreg',ProductController.contentreg_post );
router.post('/singlecontentdelete',ProductController.singlecontentdelete_post );
// Product Type list or table
router.get('/allproducts', checkAuth, ProductController.allproducts);
// Delete Product Type
router.get('/productdelete', checkAuth, ProductController.productdelete);
// Restore Deleted Product Type
router.get('/productrestore', checkAuth, ProductController.productrestore);

router.get('/productupdate', checkAuth, ProductController.productupdate_get);
router.post('/productupdate', checkAuth, ProductController.productupdate_post);
////////////////////////////    /Product /////////////////////

///////////////////////////     Settings /////////////////////////
///////////////////// unit /////////////////////////////
router.get('/allunits', checkAuth, UnitController.unitspage_get );
router.get('/unitsajax', checkAuth, UnitController.units_ajax );
router.post('/unitregajax', checkAuth, UnitController.newUnitReg );
router.post('/unitupdateajax', checkAuth, UnitController.UnitUpdate );
router.post('/unitactionajax', checkAuth, UnitController.UnitDelete );
//////////////////////////////parameter////////////////////
router.get('/allparameters', checkAuth, ParameterController.Parameterspage_get );
router.get('/parameters_ajax', checkAuth, ParameterController.Parameters_ajax );
router.get('/parameters_list_ajax', checkAuth, ParameterController.Parameters_list_ajax );
router.post('/parameter_reg_ajax', checkAuth, ParameterController.newParameterReg );
router.post('/parameter_update_ajax', checkAuth, ParameterController.ParameterUpdate );
router.post('/parameter_action_ajax', checkAuth, ParameterController.ParameterActions );
///////////////////// property /////////////////////////////
router.get('/allpropertys', checkAuth, PropertyController.propertyspage_get );
router.get('/propertysajax', checkAuth, PropertyController.propertys_ajax );
router.post('/propertyregajax', checkAuth, PropertyController.newpropertyReg );
router.post('/propertyupdateajax', checkAuth, PropertyController.propertyUpdate );
router.post('/propertyactionajax', checkAuth, PropertyController.propertyDelete );
///////////////////// raw /////////////////////////////
router.get('/allraws', checkAuth, RawController.rawspage_get );
router.get('/raws_ajax', checkAuth, RawController.raws_ajax );
router.post('/raw_reg_ajax', checkAuth, RawController.newrawReg );
router.post('/raw_update_ajax', checkAuth, RawController.rawUpdate );
router.post('/raw_action_ajax', checkAuth, RawController.rawActions );




////////////////////////////    /Settings /////////////////////

module.exports = router;