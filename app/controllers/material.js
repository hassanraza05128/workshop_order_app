var Mat = require('../models/material');
var C={};
// Register Material
C.matreg_get=function(req, res, next) {
    res.render('admin/mat/register',{
        'error':req.flash('error'),
        'msg':req.flash('msg'),
        'old_name':req.flash('old_name',req.body.name),
    });
};
C.matreg_post=function(req, res, next) {
    var matdata = {'name': req.body.name,};

    // flash data for reset values on redirectback
    req.flash('error',true);
    req.flash('old_name',req.body.name);

    if(matdata.name === ''){
        req.flash('msg', 'Missing Fields.');
        res.redirect('matreg');
    }else{
        Mat.mat.findOneWithDeleted({name:new RegExp('^' + req.body.name + '$', 'i')}, function (err, existing) {
            if(existing){
                req.flash('error',true);
                req.flash('msg','Already Register With Same Name');
                res.redirect('matreg');
            }else{
                Mat.create(matdata, function(err, newmat){
                    if(err) throw err;
                    req.flash('error', false);
                    req.flash('msg', 'New Material has Registered.');
                    res.redirect('matreg');
                });
            }
        });
    }
}

// Materials list or table
C.allmats=function (req, res, next) {
    var resData={error:{},table:[]};
    resData.redirect_error  =   req.flash('redirect_error');
    resData.redirect_msg    =   req.flash('redirect_msg');
    Mat.mat.findWithDeleted({},function (err, material) {
        if (err!==null){
            resData.error=err;
        }else{
            resData.table=material;
        }
        res.render('admin/mat/mattable', resData);
    });

}

// Delete client
C.matdelete=function (req, res, next) {
    var id=req.query.id;
    if(!id)redirect('/admin/allmats');
    req.flash('redirect_error',true);
    Mat.findById(id,function (err, material) {
        if(err){
            req.flash('redirect_msg',err.name+' : '+err.message);
        }else {
            //console.log(material);
            material.delete(function (err) {
                if(err){
                    req.flash('redirect_msg',err.name+' : '+err.message);
                }else {
                    req.flash('redirect_error', false);
                    req.flash('redirect_msg', 'Operation Successful');
                }
            });
        }
    });
    res.redirect('/admin/allmats');
}

// Restore Deleted client
C.matrestore=function (req, res, next) {
    var id=req.query.id;
    if(!id)redirect('/admin/allmats');
    req.flash('redirect_error',true);
    Mat.mat.findOneWithDeleted({_id:id},function (err, material) {
        if(err){
            req.flash('redirect_msg',err.name+' : '+err.message);
        }else {
            //console.log(material);
            material.restore(function (err) {
                if(err){
                    req.flash('redirect_msg',err.name+' : '+err.message);
                }else {
                    req.flash('redirect_error', false);
                    req.flash('redirect_msg', 'Operation Successful');
                }
            });
        }

    });
    res.redirect('/admin/allmats');
}

C.matupdate=function (req, res, next) {
    res.redirect('/admin/allmats');
}


module.exports=C;