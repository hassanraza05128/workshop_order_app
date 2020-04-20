var siteUrl= require('../../config').siteUrl;
//models
var UnitModel = require('../../models/unit');
var U={};

U.unitspage_get  =    function(req, res, next){res.render('admin/setting/unit/unit');};
U.units_ajax    = async (req, res, next)=>{
    if(!req.xhr)res.send(404);
    UnitModel.unit.findWithDeleted({}).exec(function(err, units){
          if(err){
            res.status(500).json({msg:'database data storing error',error:err,});
        }else{
          var response=[];
          var i=0;
          units.forEach(function (unit) {
              response.push([
                  ++i,
                  unit._id,
                  unit.text,
                  unit.symbol,
                  unit.quantity,
                  unit.e,
                  (unit.deleted)?
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
U.newUnitReg= function (req, res, next){
    if(!req.xhr){res.sendStatus(404);}
    UnitModel.unit.create({
        text:req.body.text,
        quantity:req.body.unitof,
        e:req.body.efactor,
        symbol:req.body.symbol,
    },function (err,newunit) {
        if(err){res.status(500).json({msg:err.message});}
        else res.status(200).json({msg:'New Unit Has Registered'});
    });
};
U.UnitUpdate= async (req, res, next)=>{
    if(!req.xhr){res.sendStatus(404);return;}
    if(!req.body.unitid){res.status(500).json({msg:'Parameter Error'});return;}
    UnitModel.unit.findOneAndUpdate({_id:req.body.unitid},
        {   
          text:req.body.text,
          quantity:req.body.unitof,
          e:req.body.efactor,
          symbol:req.body.symbol,
        },function (err,unit) {
        if(err)res.status(500).json({msg:err.message});
        else res.status(200).json({msg:'Unit Has Updated'});
    });
};
U.UnitDelete= async (req, res, next)=>{
    if(!req.xhr){res.sendStatus(404);return;}
    if(!req.body.unitid || !req.body.action){res.status(500).json({msg:'Parameter Error'});return;}

    UnitModel.unit.findOneWithDeleted({_id:req.body.unitid}, function (err,unit) {
            if(err)res.status(500).json({msg:err.message});
            else{
                if(req.body.action=="delete") {
                    unit.delete(function (err) {
                        if (err) res.status(500).json({msg: err.message});
                        else res.status(200).json({msg: 'Unit Has Deleted'});
                    });
                }else if(req.body.action==-"restore"){
                    unit.restore(function (err) {
                        if (err) res.status(500).json({msg: err.message});
                        else res.status(200).json({msg: 'Unit Has Restored'});
                    });

                }else res.sendStatus(404);
            }
        });
};

module.exports=U;
