var multer = require('multer');
var mkdirp = require('mkdirp');
const crypto = require('crypto')
var path = require('path');
var uppercase = require('upper-case');
let error;
var uploaded=false;
let options={
    path: './uploads/',
    field:'',
   // extensions:[],
    multiple:false,
    encodeName:true,
    limits:{
       // fieldNameSize:100,//Max field name size 100bytes
        //fieldSize:1024*1024,//Max field value size 1mb
        // fields,//Max number of non-file fields
        // fileSize,//For multipart forms, the max file size (in bytes)
        // files,//For multipart forms, the max number of file fields
        // parts,//For multipart forms, the max number of parts (fields + files)
        //headerPairs:2000,//For multipart forms, the max number of header key=>value pairs to parse
    },
};

var init=function (opts) {
    options.path= (opts.path)?opts.path:'./uploads/';
    options.field=(opts.field)?opts.field:'file-input';
    options.extensions=(opts.extensions)?opts.extensions:[];
    options.multiple=(opts.multiple)?opts.multiple:false;
    options.encodeName=(opts.encodeName)?opts.encodeName:true;

    options.limits.fieldNameSize=(opts.limits.fieldNameSize)?opts.limits.fieldNameSize:100;
    options.limits.fieldSize=(opts.limits.field)?opts.limits.field*1024*1024:1024*1024;
    if(opts.limits.fileSize)options.limits.fileSize=opts.limits.fileSize*1024*1024;
    if(opts.limits.files)options.limits.files=opts.limits.files;
};

// files upload
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        mkdirp.sync(options.path);
        cb(null, options.path);
    },
    filename:function(req, file, cb){
        if(options.encodeName){
           let customFileName = crypto.randomBytes(10).toString('hex');
            var datetimestamp = Date.now();
            cb(null, 'f'+customFileName+'_'+datetimestamp+'.'+file.originalname.split('.')[file.originalname.split('.').length -1]);
            //  cb(null, 'file' + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        }else{
              cb(null, file.originalname);
        }
    },
    // filename: function (req, file, cb) {
    //     var datetimestamp = Date.now();
    //     cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    // }
});

var multerobj={ //multer settings
   
   storage: storage,
    //destination:options.path,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(!exist(ext, options.extensions)) {
            return callback(new Error('Extention ' +' '+ext+' '+ ' not Allowed'))
        }
        callback(null, true)
    },
    limits:options.limits,
};
var do_upload = function(do_opts){
    if(do_opts)init(do_opts);
    upload = (options.multiple)? multer(multerobj).array(options.field):multer(multerobj).single(options.field);
    uploaded=true;
    return upload;
};
var exist=function (ext,arrext) {
    for(var i=0;i < arrext.length;i++) return ext==='.'+arrext[i] ||  ext==='.'+uppercase(arrext[i]);
    return false;
};
var genError=function (req, err) {
    switch (err.code){
        case : ''
    }
};
var bsUpload = async (req, res, next)=>{
    upload = await (options.multiple)? multer(multerobj).array(options.field):multer(multerobj).single(options.field);
    uploaded=true;
    upload(req,res,async (err)=> {
    if(err){
        return this.genError(req, err);
    }else{next();}
    });
    next();};
module.exports={
    init,
    do_upload,
    bsUpload,
};