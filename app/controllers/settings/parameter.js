var siteUrl= require('../../config').siteUrl;
//models
var ParameterModel = require('../../models/parameter');
var P={};

P.Parameterspage_get  =    function(req, res, next){res.render('admin/setting/parameter/parameter');};
P.Parameters_ajax    = async (req, res, next)=>{
    if(!req.xhr)res.send(404);
    ParameterModel.parameter.findWithDeleted({}).exec(function(err, parameters){
          if(err){
            res.status(500).json({msg:'database data storing error',error:err,});
        }else{
          var response=[];
          var i=0;
              parameters.forEach(function (parameter) {
              response.push([
                  ++i,
                  // parameter.unit._id,
                  parameter._id,
                  parameter.name,
                  parameter.quantity,
                  // parameter.unit.text,
                  (parameter.deleted)?
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

P.Parameters_list_ajax    = function (req, res, next){
    if(!req.xhr)res.send(404);
    ParameterModel.parameter.find({},function(err, parameters){
        if(err){
            res.status(500).json({msg:'database data storing error',error:err,});
        }else{
            var response=parameters.map(p=>({id:p._id, text:p.name}));
            res.status(200).json({data:response});
        }
    });
};
P.newParameterReg= function (req, res, next){
    if(!req.xhr ){res.sendStatus(404);}
    if((!req.body.aid) || (!req.body.name) || (!req.body.quantity)){res.status(500).json({msg:'Parameter Error'});return;}

    ParameterModel.create({
        name:req.body.name,
        quantity:req.body.quantity,
    },function (err,newparameter) {
        if(err){res.status(500).json(err);}
        else res.status(200).json({msg:'New Parameter Has Registered'});
    });
};
P.ParameterUpdate= async (req, res, next)=>{
    if(!req.xhr){res.sendStatus(404);return;}
  //  console.log('param',req.body.aid);

    if((!req.body.aid) || (!req.body.name) || (!req.body.quantity)){res.status(500).json({msg:'Parameter Error'});return;}
    ParameterModel.parameter.findOneAndUpdate({_id:req.body.aid},
        {   name:req.body.name,
            quantity:req.body.quantity,
        },function (err,parameter) {
        if(err)res.status(500).json({msg:err.message});
        else res.status(200).json({msg:'Parameter Has Updated'});
    });
};
P.ParameterActions= async (req, res, next)=>{
    if(!req.xhr){res.sendStatus(404);return;}
      //console.log('param',req.body);
    if((!req.body.aid) || (!req.body.action)){res.status(500).json({msg:'Parameter Error'});return;}
    ParameterModel.parameter.findOneWithDeleted({_id:req.body.aid}, function (err,parameter) {
            if(err)res.status(500).json({msg:err.message});
            else{
                if(req.body.action==="delete") {
                    parameter.delete(function (err) {
                        if (err) res.status(500).json({msg: err.message});
                        else res.status(200).json({msg: 'Parameter Has Deleted'});
                    });
                }else if(req.body.action==="restore"){
                    parameter.restore(function (err) {
                        if (err) res.status(500).json({msg: err.message});
                        else res.status(200).json({msg: 'Parameter Has Restored'});
                    });

                }else res.sendStatus(404);
            }
        });
};

module.exports=P;
