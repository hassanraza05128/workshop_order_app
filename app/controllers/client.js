var Client = require('../models/client');
var C={};

// Register via username and password
C.clientreg_get = function(req, res, next) {
    res.render('admin/client/register',{
        'error':req.flash('error'),
        'msg':req.flash('msg'),
        'old_name':req.flash('old_name',req.body.name),
        'old_address':req.flash('old_username',req.body.address),
        'old_cnic':req.flash('old_role',req.body.cnic),
        'old_phoneno':req.flash('old_role',req.body.phoneno),
        'old_city':req.flash('old_role',req.body.city),
        'old_country':req.flash('old_role',req.body.country),
    });
}
C.clientreg_post= function(req, res, next) {
    var clientdata = {
        'name': req.body.name,
        'address': req.body.address,
        'cnic': req.body.cnic,
        'city': req.body.city,
        'country': req.body.country,
        'phoneno': req.body.phoneno };

    // flash data for reset values on redirectback
    req.flash('error',true);
    req.flash('old_name',req.body.name);
    req.flash('old_address',req.body.address);
    req.flash('old_cnic',req.body.cnic);
    req.flash('old_phoneno',req.body.phoneno);
    req.flash('old_city',req.body.city);
    req.flash('old_country',req.body.country);

    if(clientdata.name === ''
        || clientdata.phoneno === ''
        || clientdata.country === ''
        || clientdata.city === ''){

        req.flash('msg', 'Missing Fields.');
        res.redirect('clientreg');
    }else{

        Client.create(clientdata, function(err, newclient){
            console.log('here');
            if(err) throw err;
            req.flash('error', false);
            req.flash('msg', 'Client has Registered.');
            res.redirect('clientreg');
        });
    }

}

// client list or table
C.allclients = function (req, res, next) {
    var resData={error:{},table:[]};
    resData.redirect_error  =   req.flash('redirect_error');
    resData.redirect_msg    =   req.flash('redirect_msg');
    Client.client.findWithDeleted({},function (err, clients) {
        if (err!==null){
            resData.error=err;
        }else{
            resData.table=clients;
        }
        //res.send(resData);
        res.render('admin/client/clienttable', resData);
    });

}

// Delete client
C.clientdelete = function (req, res, next) {
    var id=req.query.id;
    if(!id){res.redirect('/admin/allclients');}
    req.flash('redirect_error',true);
    Client.findById(id,function (err, client) {
        if(err){
            req.flash('redirect_msg',err.name+' : '+err.message);
            console.log(err.name+' : '+err.message);
        }else {
            client.delete(function (err) {
                if (err) {
                    req.flash('redirect_msg', err.name+' : '+err.message);
                } else {
                    req.flash('redirect_error', false);
                    req.flash('redirect_msg', 'Operation Successful');
                }
            });
        }
    });
    res.redirect('/admin/allclients');
};


C.clientrestore  =function (req, res, next) {
    var id=req.query.id;
    if(!id)redirect('/admin/allproducttypes');
    req.flash('redirect_error',true);
    Client.client.findOneWithDeleted({_id:id},function (err, client) {
        if(err){
            req.flash('redirect_msg',err.name+' : '+err.message);
        }else {
            //console.log(material);
            client.restore(function (err) {
                if(err){
                    req.flash('redirect_msg',err.name+' : '+err.message);
                }else {
                    req.flash('redirect_error', false);
                    req.flash('redirect_msg', 'Operation Successful');
                }
            });
        }

    });
    res.redirect('/admin/allclients');
}

C.clientupdate= function (req, res, next) {
    res.redirect('/admin/allclients');
}





module.exports=C;
// {
//     clientreg_get,
//         clientreg_post,
//         allclients,
//         clientdelete,
//         clientupdate,
//         clientrestore,
//
// };