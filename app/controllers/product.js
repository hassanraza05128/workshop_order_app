var siteUrl= require('../config').siteUrl;
//models
var uploader = require('../helper/fileuploader');
var ProductModel = require('../models/product');
var MaterialModel = require('../models/material');
var ProducttypeModel = require('../models/producttype');
var ParameterModel = require('../models/parameter');

var P={};
var up_opts={
    field:'file_data',//'file-input-files',
    path:'./public/uploads/products/',
    extensions:['jpg', 'jpeg', 'gif', 'png'],
    multiple:true,
    encodeName:true,
    limits:{fileSize:25,files:100},
    thumbDefault:
        {
          // prefix: '',
          // suffix: '_thumb',
          // digest: false,
          // hashingType: 'sha1', // 'sha1', 'md5', 'sha256', 'sha512'
          // width: 800,
          // concurrency: <num of cpus>,
          // quiet: false, // if set to 'true', console.log status messages will be supressed
          // overwrite: false,
          // skip: false, // Skip generation of existing thumbnails
          // basename: undefined, // basename of the thumbnail. If unset, the name of the source file is used as basename.
          // ignore: false, // Ignore unsupported files in "dest"
          // logger: function(message) {
          //   console.log(message);
          
        
       // concurrency: 4
        },
};

P.productreg_get  =    function(req, res, next){
    MaterialModel.find({},function (err,mats) {
        ProducttypeModel.find({},function (err,types) {
            res.render('admin/product/register', {
                types:types,
                materials:mats,
                'error':req.flash('error'),
                'msg':req.flash('msg'),
                'old_name':req.flash('old_name',req.body.name),
                'old_discription':req.flash('old_discription',req.body.discription),
                'old_type':req.flash('old_type',req.body.type),
                'old_material':req.flash('old_material',req.body.material),
            });
        });
    });

};

P.productreg_post     = async (req, res, next)=>{
    // console.log('value',req.body);
    //console.log('value',req.body['parameter[]'] );
    var parameters=[];

    //check material and producttype shuld not empty
    if(req.body.material === '' || req.body.type === ''|| req.body.sellby === ''){res.status(500).json({msg:'Missing Form Fields',error:null});return;}
    try {
            //Validate material and product shuld not empty
        let type = await ProducttypeModel.producttype.findById(req.body.type).exec();//function (err) {if(err)res.status(500).json({msg:'database query error in type',error:err});}

        let mat = await MaterialModel.mat.findById(req.body.material).exec();
            // mat.then(function(m){console.log(m);}).catch(function(m){console.log(m);});
        //console.log('mat',mat);console.log('type',type);
        if (!mat) {
            res.status(500).json({msg: 'database query error in material', error: null});
        }
        if (!type) {
            res.status(500).json({msg: 'database query error in type', error: null});
        }


        // store form data to object.
        var productdata = {
            'designid': 10000,
            'name': req.body.name,
            'discription': req.body.discription,
            'material': req.body.material,
            'type': req.body.type,
            'sellby': {
                'by': req.body.sellby,
                /*    parameters:parameters,
                    // rawitems:[{ type: ObjectId, ref:'raw' , autopopulate:true}],
                    cost:req.body.cost,*/
            },
        };

        switch (req.body.sellby) {
            case "peritem":
                productdata.sellby.cost = req.body.cost;
                break;

            case "parametermultiple":
                console.log("body",req.body);
                if (Array.isArray(req.body['parameter[]'])) {
                    req.body['parameter[]'].forEach(async function (p) {
                        let para = await ParameterModel.parameter.findById(p).exec();
                        if (para) parameters.push(p);
                    });
                } else {
                    let para = await ParameterModel.parameter.findById(req.body['parameter[]']).exec();
                    if (para) parameters.push(req.body['parameter[]']);
                }
                productdata.sellby.parameters = parameters;
                productdata.sellby.cost = req.body.cost;
                break;

            case "rawsum":
                return ;
                break;
        }


        // get last product from db
        let lastProduct = await ProductModel.product.findOne().sort({'createdAt': -1}).exec();//function (err) {if(err)res.status(500).json({msg:'database query error',error:err});}
        //if db has no last start from default design id 10000
        if (lastProduct) productdata.designid = ++lastProduct.designid;

        // stroe product into db
        ProductModel.create(productdata, function (err, newproduct) {
            if (err) {
                res.status(500).json({msg: 'database data storing error', error: err,});
            } else {
                res.status(200).json({msg: 'New Product ' + newproduct.name + ' has Registered', product: newproduct,});
            }
        });
    }catch (e) {
        console.log(e);
    }
};

P.contentreg_post     = async (req, res, next)=>{
    // console.log(req.body.productID);
    up_opts.multiple=false;
    try {
        var upload = uploader.do_upload(up_opts);

        upload(req, res, async (err) => {
            // console.log(req.body.productID);

            if (err) {
                res.json(responceUpload(null, null, err, null));
                console.log(err);
                return;
            } else {
                if (!req.file) {
                    res.json(responceUpload(null, null, "No file To Upload", null));
                    return;
                }
                if (!req.body.productID) {
                    res.json(responceUpload(null, null, "product not submit", null));
                    return;
                } else {
                    let pro = await ProductModel.product.findById(req.body.productID).exec();
                    // console.log(req.body.productID);

                    if (!pro) {
                        res.json(responceUpload(null, null, "Invalid Product", null));
                        return;
                    }
                    var fs = require('fs');
                    var path =up_opts.path;/* await (function () {
                        var str = '';
                        var arr = req.file.destination.split("/");
                        arr.shift();
                        arr.shift();
                        str = arr.join('/');
                        return "/" + str;
                    })();*/
                    var newpath = path + 'id'+pro.designid +'/';
                    // console.log(newpath);
                    if (!fs.existsSync(newpath))
                        fs.mkdirSync(newpath, 0o744);

                    var newpath=await (function () {
                        var str = '';
                        var arr = newpath.split("/");
                        arr.shift();
                        arr.shift();
                        str = arr.join('/');
                        return "/" + str /*+ 'id'+pro.designid +'/'*/;
                    })();

                    var thumb = (function () {
                        var str = '';
                        var arr = req.file.filename.split(".");
                        str = arr[0] + '_thumb.' + arr[1];
                        return str;
                    })();




                    var rename_source       =     path    + req.file.filename;
                    var rename_destination  =   './public'+newpath + req.file.filename;

                    var contentdata = {
                        orignalname: req.file.originalname,
                        name: req.file.filename,
                        thumb: thumb,
                        mimetype: req.file.mimetype,
                        path: '.'+newpath,
                        fullpath: '.'+newpath + req.file.filename,
                        size: req.file.size,
                    };
                    // console.log(contentdata);
                    // console.log(req.file);
                    // var err = content.validate();
                    // err.then(function (err){
                    //     if(err)
                    //         handleError(err);
                    // });
                    fs.rename(rename_source, rename_destination, function (err) {
                        if (err) throw err;
                        else {
                            console.log('Move complete.');
                            create_thumb({fullpath: rename_destination, directoryPath: './public' + newpath,});


                            pro.contents.push(contentdata);
                            var content_index = pro.contents.length - 1;
                            var content = pro.contents[content_index];
                            content.isNew = true;
                            pro.save(
                                function (err, product) {
                                    if (err) {
                                        res.json(responceUpload(null, null, null, err));
                                    } else {
                                        res.json(responceUpload(product.contents[content_index], product._id, null, null));
                                    }
                                }
                            );
                        }
                    });

                    return true;
                }
            }
        });
    }catch(e)
    {console.log(e);
        res.json({'error':e});
    }
};

P.singlecontentdelete_post=async (req, res, next)=>{
    var fs = require('fs');
    try {
        var pid=req.body.pid,cid=req.body.cid;
        if(!pid || !cid){throw new Error("Required Parameters Not Find");return;}
        ProductModel.product.findById(pid,function (err,pro) {
            if(err){throw new Error(err);return;}
            var content=pro.contents.id(cid);
            if(!content){throw new Error({name:'file Error',message:content});return;}

            var filePath='./public/'+content.fullpath;
            var fileThumbPath='./public/'+content.path+content.thumb;
            if(fs.existsSync(filePath)){
                fs.unlinkSync(filePath);
                fs.unlinkSync(fileThumbPath);
            }else{throw {name:'fileerror',message:'file not found'};}

            pro.contents.id(cid).remove();
            pro.save(function (err) {
                if(err)throw err;
                res.json({success:content.orignalname+' Has Deleted SuccessFully'});
            });
        });
    }catch (e) {
        console.log(e);
        res.json({'error':e});
    }finally {
        //res.json({error:"Couldnot delete"});
    }
};

var create_thumb= function(file){
    if(!file)return false;
    var thumb = require('node-thumbnail').thumb;
    // console.log(file);
    return thumb({
        source: file.fullpath,
        destination: file.directoryPath,
        concurrency:4,
    },function(files, err, stdout, stderr) {
        if(err){
            console.log('Error',err);
            return;
        }
        else{
           // console.log('thumb Created');
            return true;
        }
    });
};

var responceUpload=function(newfile, proid, fileError, dbError ){

    if(dbError){return {error:dbError};}
    if(fileError){return {error:fileError};}
    if(newfile && proid && !fileError && !dbError){

        return {
            initialPreview: [
                siteUrl+newfile.fullpath,
                // 'sfasdasdasdasdadasa',
                //'<img src="'+image_url+'" class="file-preview-image" title="'+newfile.originalname+'" >',
            ],
            initialPreviewConfig:[{ 
                caption: newfile.originalname, 
                width: '120px',
                url: '/admin/singlecontentdelete', // server delete action 
                //key:100 ,
                size: newfile.size,
                extra: {cid:newfile._id,pid: proid}
            }],
            // initialPreviewThumbTags: [
            //     {
            //         '{CUSTOM_TAG_NEW}': '',
            //         '{CUSTOM_TAG_INIT}': '<span class=\'custom-css\'>CUSTOM MARKUP</span>'
            //     }
            // ],
            append:true,
        };
    }
};

P.allproducts     =   function(req, res, next){
    var resData={error:{},table:[]};
    resData.redirect_error  =   req.flash('redirect_error');
    resData.redirect_msg    =   req.flash('redirect_msg');
    try {

        ProductModel.product.findWithDeleted().populate('type','name').populate('material','name').populate('sellby.parameters',['quantity','name']).exec(function (err, product) {
            if (err) {
               // console.error(err);
                resData.error = err;
            } else {
               // console.error(product);
                resData.table = product;
            }
            resData.siteUrl=siteUrl;
           // res.send(resData.table[0]);
            res.render('admin/product/table', resData);
        });
    }catch (e) {
        console.log(e);
    }
};

P.productdelete   = function (req, res, next) {

    var id=req.query.id;
    if(!id)redirect('/admin/allproducts');
    req.flash('redirect_error',true);
    ProductModel.findById(id,function (err, product) {
        if(err){
            req.flash('redirect_msg',err.name+' : '+err.message);
        }else {
            //console.log(material);
            product.delete(function (err) {
                if(err){
                    req.flash('redirect_msg',err.name+' : '+err.message);
                }else {
                    req.flash('redirect_error', false);
                    req.flash('redirect_msg', 'Operation Successful');
                }
            });
        }
    });
    res.redirect('/admin/allproducts');
};

P.productrestore  =function (req, res, next) {
    var id=req.query.id;
    if(!id)redirect('/admin/allproducts');
    req.flash('redirect_error',true);
    ProductModel.product.findOneWithDeleted({_id:id},function (err, product) {
        if(err){
            req.flash('redirect_msg',err.name+' : '+err.message);
        }else {
            product.restore(function (err) {
                if(err){
                    req.flash('redirect_msg',err.name+' : '+err.message);
                }else {
                    req.flash('redirect_error', false);
                    req.flash('redirect_msg', 'Operation Successful');
                }
            });
        }

    });
    res.redirect('/admin/allproducts');
};

P.productupdate_get   = async (req, res, next)=> {
    var resData={
        redirect_error : req.flash('redirect_error'),
        redirect_msg : req.flash('redirect_msg'),
    };
    var  id = req.query.id;
    if(!id)res.redirect('/admin/allproducts');
    req.flash('redirect_error', true);
    var mats= await MaterialModel.mat.find({}).exec();
    var types= await ProducttypeModel.producttype.find({}).exec();
    ProductModel.product.findById(id).populate('type material sellby.parameters').exec(function (err, data) {
        if(err){
            req.flash('redirect_msg',err);
            res.redirect('/admin/allproducts');
        }else{
            req.flash('redirect_error',false);
            // res.send(data._doc);
            res.render('admin/product/edit', Object.assign(resData, {product:data._doc,materials:mats,types:types,siteUrl:siteUrl}));
        }
    });
};

P.productupdate_post  = async (req, res, next)=>{
    if(!req.xhr)res.status(404).send();
    if(!req.body.pid) res.status(404).json({msg:'Invalid Request'});

    //check and update product type by id
    ProductModel.findById(req.body.pid,async function (err, product) {
        if(err){
            res.status(505).json({msg:'Product not found',error:err});
        }else{
            product.name = req.body.name;
            product.material = req.body.material;
            product.type = req.body.type;
            product.discription = req.body.discription;
            product.sellby.by = req.body.sellby;
            switch (req.body.sellby) {
                case "peritem":
                    product.sellby.cost = req.body.cost;
                    productSave();
                    break;

                case "parametermultiple":
                    product.sellby.cost = req.body.cost;
                    product.sellby.parameters=[];
                    if (Array.isArray(req.body['parameter[]'])) {
                        let i=req.body['parameter[]'].length;
                        req.body['parameter[]'].forEach(async function (p) {
                            let para = await ParameterModel.parameter.findById(p).exec();
                            if (para){product.sellby.parameters.push(p);}
                            if(!--i)productSave();
                        });
                        ;
                    } else {
                        let para = await ParameterModel.parameter.findById(req.body['parameter[]']).exec();
                        if (para) product.sellby.parameters.push(req.body['parameter[]']);
                        productSave();
                    }
                    break;

                case "rawsum":
                    break;
            }
           function productSave() {
               // console.log("product",product);
               product.save(function (err,updatedproduct) {
                   if(err){
                       res.status(404).json({msg:'Operation Unsuccessfull',error:err});
                   }else{
                       res.status(200).json({msg:'Product has Updated',product:{name:updatedproduct.name,}});
                   }
               });
           }
        }
    });
};


module.exports=P;
// {
//     productreg_get,
//         productreg_post,
//         // upload,
//         contentreg_post,
//         singlecontentdelete_post,
//         allproducts,
//         productdelete,
//         productrestore,
//         productupdate_get,
//         productupdate_post,
// }