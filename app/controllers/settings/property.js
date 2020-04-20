var siteUrl= require('../../config').siteUrl;
//models
var PropertyModel = require('../../models/property');
var P={};

P.propertyspage_get  =    function(req, res, next){res.render('admin/setting/property/property');};
P.propertys_ajax    = async (req, res, next)=>{
    if(!req.xhr)res.send(404);
    PropertyModel.property.findWithDeleted({}).exec(function(err, propertys){
          if(err){
            res.status(500).json({msg:'database data storing error',error:err,});
        }else{
          var response=[];
          var i=0;
          propertys.forEach(function (property) {
              response.push([
                  ++i,
                  property._id,
                  property.name,
                  (property.deleted)?
                      "<button class='restore btn btn-warning'>Restore</button>":
                      "<button class='update btn btn-primary'>update</button>"+
                      "<button class='delete btn btn-danger'>Delete</button>"
              ]);
          });
          var resobject={data:response};
          res.status(200).json(resobject);
        }
    });
};
P.newpropertyReg= function (req, res, next){
    if(!req.xhr){res.sendStatus(404);}
    PropertyModel.property.create({
        name:req.body.name,
    },function (err,newproperty) {
        if(err){res.status(500).json({msg:err.message});}
        else res.status(200).json({msg:'New property Has Registered'});
    });
};
P.propertyUpdate= async (req, res, next)=>{
    if(!req.xhr){res.sendStatus(404);return;}
    if(!req.body.aid){res.status(500).json({msg:'Parameter Error'});return;}
    PropertyModel.property.findOneAndUpdate({_id:req.body.aid},
        {name:req.body.name,
        },function (err,property) {
        if(err)res.status(500).json({msg:err.message});
        else res.status(200).json({msg:'Property Has Updated'});
    });
};
P.propertyDelete= async (req, res, next)=>{
    if(!req.xhr){res.sendStatus(404);return;}
    if((!req.body.aid) || (!req.body.action)){res.status(500).json({msg:'Parameter Error'});return;}

    PropertyModel.property.findOneWithDeleted({_id:req.body.aid}, function (err,property) {
            if(err)res.status(500).json({msg:err.message});
            else{
                if(req.body.action==="delete") {
                    property.delete(function (err) {
                        if (err) res.status(500).json({msg: err.message});
                        else res.status(200).json({msg: 'Property Has Deleted'});
                    });
                }else if(req.body.action==="restore"){
                    property.restore(function (err) {
                        if (err) res.status(500).json({msg: err.message});
                        else res.status(200).json({msg: 'Property Has Restored'});
                    });

                }else res.sendStatus(404);
            }
        });
};

module.exports=P;
