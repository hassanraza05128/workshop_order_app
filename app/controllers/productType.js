//models
var Producttype = require('../models/producttype');

/*var producttypereg_get  =    function(req, res, next){
    res.render('admin/producttype/register',{
        'error':req.flash('error'),
        'msg':req.flash('msg'),
        'old_name':req.flash('old_name',req.body.name),
    });
}
var producttypereg_post     =   function(req, res, next){
    var producttypedata = {'name': req.body.name,parent:req.body.parent || null};
    // if(!!req.body.parent)producttypedata.parent=req.body.parent;

    // flash data for reset values on redirectback
    req.flash('error',true);
    req.flash('old_name',req.body.name);

    if(producttypedata.name === '' || producttypedata.name === undefined){
        req.flash('msg', 'Missing Fields.');
        res.redirect('producttypereg');
    }else{
        Producttype.producttype.findOneWithDeleted({name:new RegExp('^' + producttypedata.name + '$', 'i'),parent:producttypedata.parent}, function (err, existing) {
            if(existing){
                req.flash('error',true);
                req.flash('msg','Already Register With Same Name'+(producttypedata.parent!==null)?'under this parent':'');
                res.redirect('producttypereg');
            }else{
                Producttype.create(producttypedata, function(err, newproducttype){
                    if(err) throw err;
                    req.flash('error', false);
                    req.flash('msg', 'New Product Type has Registered.');
                    res.redirect('producttypereg');
                });
            }
        });
    }
}
var allproducttypes     = async (req, res, next)=>{
    var resData={error:{},table:[]};
    resData.redirect_error  =   req.flash('redirect_error');
    resData.redirect_msg    =   req.flash('redirect_msg');

    resData.table=await Producttype.producttype.findWithDeleted().populate("parent");
    // res.send(resData);
    res.render('admin/producttype/table', resData);

    // Producttype.producttype.findWithDeleted().populate("parent").exec(function (err, producttype) {
    //     if (err!==null){
    //         resData.error=err;
    //     }else{
    //         resData.table=producttype;
    //     }
    //     // res.send(resData);
    //     res.render('admin/producttype/table', resData);
    // });
}
var producttypedelete   = function (req, res, next) {
    var id=req.query.id;
    if(!id)redirect('/admin/allproducttypes');
    req.flash('redirect_error',true);
    Producttype.findById(id,function (err, producttype) {
        if(err){
            req.flash('redirect_msg',err.name+' : '+err.message);
        }else {
            //console.log(material);
            producttype.delete(function (err) {
                if(err){
                    req.flash('redirect_msg',err.name+' : '+err.message);
                }else {
                    req.flash('redirect_error', false);
                    req.flash('redirect_msg', 'Operation Successful');
                }
            });
        }
    });
    res.redirect('/admin/allproducttypes');
}
var producttyperestore  =function (req, res, next) {
    var id=req.query.id;
    if(!id)redirect('/admin/allproducttypes');
    req.flash('redirect_error',true);
    Producttype.producttype.findOneWithDeleted({_id:id},function (err, producttype) {
        if(err){
            req.flash('redirect_msg',err.name+' : '+err.message);
        }else {
            //console.log(material);
            producttype.restore(function (err) {
                if(err){
                    req.flash('redirect_msg',err.name+' : '+err.message);
                }else {
                    req.flash('redirect_error', false);
                    req.flash('redirect_msg', 'Operation Successful');
                }
            });
        }

    });
    res.redirect('/admin/allproducttypes');
}
var producttypeupdate_get   = function (req, res, next) {
    var resData={
        redirect_error : req.flash('redirect_error'),
        redirect_msg : req.flash('redirect_msg'),
    };
    var  id = req.query.id;
    if(!id)res.redirect('/admin/allproducttypes');
    req.flash('redirect_error', true);
    Producttype.findById(id,function (err, data) {
        if(err){
            req.flash('redirect_msg',err);
            res.redirect('/admin/allproducttypes');
        }else{
            req.flash('redirect_error',false);
            // data.redirect_error =resData.redirect_error;
            // data.redirect_msg   =resData.redirect_msg;
            resData.id=data._id;
            resData.name=data.name;
            //res.send(resData);
            res.render('admin/producttype/edit', resData);
        }
    });
}
var producttypeupdate_post  = async (req, res, next) => {
    if(!req.body.id)res.redirect('/admin/allproducttypes');
    req.flash('redirect_error', true);


    //check and update product type by id
    Producttype.findById(req.body.id).exec(async (err, data) => {
        if(err){
            req.flash('redirect_msg',"data not find");
            res.redirect('/admin/allproducttypes');
        }else{
            if(data.name === req.body.name){
                req.flash('redirect_msg', 'Same So no change');
                res.redirect('/admin/allproducttypes');
                return;
            }
            //check if name already exist
            let pt = await Producttype.producttype.findOneWithDeleted({name:new RegExp('^' + req.body.name + '$', 'i'),});
            if(!!pt){
                req.flash('redirect_msg', 'Already Exist this Product type So try some thing else');
                res.redirect('/admin/allproducttypes');return;
            }
            data.name = req.body.name;
            data.save(function (err) {
                if(err){
                    req.flash('redirect_msg', err.name+' : '+err.message);
                }else{
                    req.flash('redirect_error', true);
                    req.flash('redirect_msg', 'Operation successfull');
                }
            });
            res.render('admin/producttype/edit',data);
        }
    });
}*/

var P={};
P.ProductTypesPage_get  =    function(req, res, next){res.render('admin/producttype/producttype');};

P.ProductTypes_ajax    = async (req, res, next)=>{
    if(!req.xhr)res.send(404);
    Producttype.producttype.findWithDeleted({}).populate("parent").exec(function(err, ps){
        if(err){
            res.status(500).json({msg:'database data storing error',error:err,});
        }else{
            var response=[];
            var i=0;
            ps.forEach(function (p) {
                response.push([
                    ++i,
                    p._id,
                    p.name,
                    (p.parent!==null)?p.parent._id:null ,
                    (p.parent!==null)?p.parent.name:"no parent" ,
                    (p.code!==null || p.code!==undefined)?p.code:"Not A leaf Node",
                    (p.deleted)?
                      "<button class='restore btn btn-warning'>Restore</button>":
                      "<button class='update btn btn-primary'>update</button>"+
                      "<button class='delete btn btn-danger'>Delete</button>"
                ]);
            });
            var resobject={data:response};
            res.status(200).json(resobject);
            // console.log(resobject);
        }
    });
};
/*fn for all childs and roots on pid=""*/
P.ProductTypes_list_ajax    = async (req, res, next)=>{
    if(!req.xhr){res.sendStatus(404);return}
    console.log(req.body);
    let pid=null;
    let data={};
    if(req.body.pid===""){
        pid=null;// incase of root nodes
    }else{
        pid=req.body.pid;
        let parent=await Producttype.producttype.findById(pid);
        console.log("parent",parent);
        if(!!!parent){res.sendStatus(404);return;}
        data.parentIsLeaf=parent.isleaf;
    }
    let ptchilds = await Producttype.producttype.find().where({parent:pid});
    data.hasChilds=!(ptchilds===[]);
    data.childs=ptchilds;
    console.log("just before responce",data);
    res.status(200).json(data);
};
/*fn for all child that are leaf but can be root*/
P.ProductTypes_leaf_list_ajax    = async (req, res, next)=>{
    if(!req.xhr){res.sendStatus(404);return}
    let pid=null;
    let data={};
    if(req.body.pid===""){
        pid=null;// incase of root nodes
    }else{
        pid=req.body.pid;
        let parent=await Producttype.producttype.findById(pid);
        if(!!!parent){res.sendStatus(404);return;}
    }
    let ptchilds = await Producttype.producttype.find().where({parent:pid}).where({isleaf:true });
    data.hasChilds=(ptchilds.length>0);
    data.childs=ptchilds;
    res.status(200).json(data);
};
/*fn for all child that are not leaf/ but can be root*/
P.ProductTypes_child_list_ajax    = async (req, res, next)=>{ // for all child that are not leaf but can be root
    if(!req.xhr){res.sendStatus(404);return}
    let pid=null;
    let data={};
    if(req.body.pid===""){
        pid=null;// incase of root nodes
    }else{
        pid=req.body.pid;
        let parent=await Producttype.producttype.findById(pid);
        if(!!!parent){res.sendStatus(404);return;}
    }
    let ptchilds = await Producttype.producttype.find().where({parent:pid}).where({isleaf:{ $ne: true }});
    data.hasChilds=(ptchilds.length>0);
    data.childs=ptchilds;
    res.status(200).json(data);
};

P.newProductTypeReg= async (req, res, next)=>{
    if(!req.xhr ){res.sendStatus(404);return;}
    if((!req.body.parent) || (!req.body.name) || (!req.body.isleaf)){res.status(500).json({message:'ProductType Error'});return;}
    var data={};
/*check name is unique*/
    let nameisUnique=await Producttype.producttype.findOne({name:req.body.name});
    console.log("nameisUnique",nameisUnique);
    if(nameisUnique!==null){res.status(400).json({message:'Name is not Unique)'});return;}

/*check parent is present*/
    let checkparent=await Producttype.producttype.findById(req.body.parent);
    if(checkparent===null){res.status(400).json({message:'Parent Refrence Lost'});return;}

    data.name=req.body.name;
    data.parent=req.body.parent;

    if(req.body.isleaf==="true" && req.body.code!==undefined && req.body.code!=="" ){
        /*convert code to upercase && check for onlu alphabets A-Z*/
        let code=req.body.code.toUpperCase();
        if(!code.match(/^[A-Z ]+$/)){res.status(400).json({message:'Code is not Valid. (code must be 4 Capital Alphabets)'});return;}
        /*check code is unique*/
        let codeisUnique=await Producttype.producttype.findOne({code:code});
        if(codeisUnique!==null){res.status(400).json({message:'Code is not Valid. (code is not Unique)'});return;}

        data.code=code;
        data.isleaf=true;
    }
    // console.log(data);

    Producttype.create(data,function (err,newp) {
        if(err){console.log(err);res.status(500).json(err);}
        else res.status(200).json({message:"New ProductType ("+newp.name+") Has Registered"});
    });
};

P.ProductTypeUpdate= async (req, res, next)=>{
    if(!req.xhr){res.sendStatus(404);return;}
    //  console.log(req.body);

    if((!req.body.aid) || (!req.body.name) || (!req.body.quantity)){res.status(500).json({msg:'ProductType Error'});return;}
    data.name=req.body.name;
    // data.parent=req.body.parent;
    if(req.body.code===undefined || req.body.code===""){
        data.code=req.body.code;
        data.isleaf=true;
    }
    Producttype.producttype.findOneAndUpdate({_id:req.body.aid},
      data,function (err,p) {
          if(err)res.status(500).json({msg:err.message});
          else res.status(200).json({msg:'ProductType Has Updated'});
      });
};

P.ProductTypeActions= async (req, res, next)=>{
    if(!req.xhr){res.sendStatus(404);return;}
    //console.log('param',req.body);
    if((!req.body.aid) || (!req.body.action)){res.status(500).json({msg:'ProductType Error'});return;}
    Producttype.producttype.findOneWithDeleted({_id:req.body.aid}, function (err,p) {
        if(err)res.status(500).json({msg:err.message});
        else{
            if(req.body.action==="delete") {
                p.delete(function (err) {
                    if (err) res.status(500).json({msg: err.message});
                    else res.status(200).json({msg: 'ProductType Has Deleted'});
                });
            }else if(req.body.action==="restore"){
                p.restore(function (err) {
                    if (err) res.status(500).json({msg: err.message});
                    else res.status(200).json({msg: 'ProductType Has Restored'});
                });

            }else res.sendStatus(404);
        }
    });
};

module.exports=P;
/*
module.exports={
    producttypereg_get,
    producttypereg_post,
    allproducttypes,
    producttypedelete,
    producttyperestore,
    producttypeupdate_get,
    producttypeupdate_post,
};*/
