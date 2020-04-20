var siteUrl= require('../../config').siteUrl;
//models
var RawModel = require('../../models/raw');
var R={};

R.rawspage_get  =  function(req, res, next){res.render('admin/setting/rawproduct/rawproduct');};
R.raws_ajax    = async (req, res, next)=>{
    if(!req.xhr)res.send(404);
    RawModel.raw.findWithDeleted({}).exec(function(err, raws){
          if(err){
            res.status(500).json({msg:'database data storing error',error:err,});
        }else{
          var response=[];
          var i=0;
              raws.forEach(function (raw) {
              response.push([
                  ++i,
                  raw.unit._id,
                  raw._id,
                  raw.name,
                  raw.unit.text,
                  (raw.deleted)?
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
R.newrawReg= function (req, res, next){
    if(!req.xhr){res.sendStatus(404);}
    RawModel.create({
        name:req.body.name,
        unit:req.body.unit,
    },function (err,newraw) {
        if(err){res.status(500).json(err);}
        else res.status(200).json({msg:'New Raw Has Registered'});
    });
};
R.rawUpdate= async (req, res, next)=>{
    if(!req.xhr){res.sendStatus(404);return;}
  //  console.log('param',req.body.aid);
    if(!req.body.aid){res.status(500).json({msg:'Parameters Error'});return;}
    RawModel.raw.findOneAndUpdate({_id:req.body.aid},
        {   name:req.body.name,
            unit:req.body.unit,
        },function (err,raw) {
        if(err)res.status(500).json({msg:err.message});
        else res.status(200).json({msg:'raw Has Updated'});
    });
};
R.rawActions= async (req, res, next)=>{
    if(!req.xhr){res.sendStatus(404);return;}
      //console.log('param',req.body);
    if((!req.body.aid) || (!req.body.action)){res.status(500).json({msg:'Parameters Error'});return;}
    RawModel.raw.findOneWithDeleted({_id:req.body.aid}, function (err,raw) {
            if(err)res.status(500).json({msg:err.message});
            else{
                if(req.body.action==="delete") {
                    raw.delete(function (err) {
                        if (err) res.status(500).json({msg: err.message});
                        else res.status(200).json({msg: 'Raw Has Deleted'});
                    });
                }else if(req.body.action==="restore"){
                    raw.restore(function (err) {
                        if (err) res.status(500).json({msg: err.message});
                        else res.status(200).json({msg: 'Raw Has Restored'});
                    });

                }else res.sendStatus(404);
            }
        });
};

module.exports=R;
