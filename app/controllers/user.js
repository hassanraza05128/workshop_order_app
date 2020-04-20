var passport 	= require('passport');
var User = require('../models/user');
var C={};
// Login
C.login_get=function (req,res,next) {
    if(!req.isAuthenticated()){
        res.render("admin/user/login");
    }else{
        res.redirect('/admin');
    }
};
C.login_post= passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: 'login',
    failureFlash: true
});

// Logout
C.logout=function(req, res, next) {
    // remove the req.user property and clear the login session
    req.logout();

    // destroy session data
    req.session = null;

    // redirect to homepage
    res.redirect('login');
}

// Register via username and password
C.register_get=function(req, res, next) {
    res.render('admin/user/register',{
        'error':req.flash('error'),
        'msg':req.flash('msg'),
        'old_name':req.flash('old_name',req.body.name),
        'old_username':req.flash('old_username',req.body.username),
        'old_role':req.flash('old_role',req.body.role),
    });
};
C.register_post=function(req, res, next) {
    var credentials = {
        'username': req.body.username,
        'password': req.body.password,
        'type': req.body.role,
        'name': req.body.name };
    req.flash('error',true);
    req.flash('old_name',req.body.name);
    req.flash('old_username',req.body.username);
    req.flash('old_role',req.body.role);
    if(credentials.username === ''
        || credentials.password === ''
        || credentials.type === ''
        || credentials.name === ''){

        req.flash('msg', 'Missing credentials.');
        res.redirect('register');
    }else{
        // Check if the username already exists for non-social account
        User.findOne({'username': new RegExp('^' + req.body.username + '$', 'i'), type:{$in:['admin','editor']}/*, 'socialId': null*/}, function(err, user){
            if(err) throw err;
            if(user){
                req.flash('msg', 'Username already exists.');
                res.redirect('register');
            }else{
                User.create(credentials, function(err, newUser){
                    if(err) throw err;
                    req.flash('error', false);
                    req.flash('msg', 'Your account has been created.');
                    res.redirect('register');
                });
            }
        });
    }

}
// user list or table
C.allusers=function (req, res, next) {
    var resData={error:{},table:[]};
    resData.redirect_error  =   req.flash('redirect_error');
    resData.redirect_msg    =   req.flash('redirect_msg');
    User.user.findWithDeleted({},function (err, users) {
        if (err!==null){
            resData.error=err;
        }else{
            resData.table=users;
        }
        //res.send(resData);
        res.render('admin/user/usertable', resData);
    });

}
// active /deactive user
C.userstatus=function (req, res, next) {
    var id=req.query.id;
    if(!id)redirect('/admin/allusers');
    req.flash('redirect_error',true);
    User.findById(id,function (err, user) {
        if(err){
            req.flash('redirect_msg','No record find For this user');
        }
        user.status=(user.status==='active')?'deactive':'active';
        user.save(function (err) {
            if(err){
                req.flash('redirect_msg','database problem cannot do operation');
            }else{
                req.flash('redirect_error', false);
                req.flash('redirect_msg', 'Operation Successful');
            }
        });

    });
    res.redirect('/admin/allusers');
}

// Delete user
C.userdelete=function (req, res, next) {
    var id=req.query.id;
    if(!id)redirect('/admin/allusers');
    req.flash('redirect_error',true);
    User.findById(id,function (err, user) {
        if(err){
            req.flash('redirect_msg',err.name+':'+err.message);
        }
        user.delete(function (err) {
            if(err){
                req.flash('redirect_msg',err.name+':'+err.message);
            }else {
                req.flash('redirect_error', false);
                req.flash('redirect_msg', 'Operation Successful');
            }
        });

    });
    res.redirect('/admin/allusers');
};
C.userrestore=function (req, res, next) {
    var id=req.query.id;
    if(!id)redirect('/admin/allusers');
    req.flash('redirect_error',true);
    User.user.findOneWithDeleted({_id:id},function (err, user) {
        if(err){
            req.flash('redirect_msg',err.name+':'+err.message);
        }
        user.restore(function (err) {
            if(err){
                req.flash('redirect_msg',err.name+':'+err.message);
            }else {
                req.flash('redirect_error', false);
                req.flash('redirect_msg', 'Operation Restore Successful');
            }
        });

    });
    res.redirect('/admin/allusers');
};

// self profile edit page
C.profile_edit_get = function(req, res, next) {
    res.render('/admin/user/profile_edit',{
        'error':req.flash('error'),
        'msg':req.flash('msg'),
        'old_name':req.flash('old_name',req.body.name),
        'old_username':req.flash('old_username',req.body.username),
        'old_role':req.flash('old_role',req.body.role),
    });
};

C.profile_edit_post=function(req, res, next) {
    var credentials = {
        'username': req.body.username,
        'password': req.body.password,
        'type': req.body.role,
        'name': req.body.name };
    req.flash('error',true);
    req.flash('old_name',req.body.name);
    req.flash('old_username',req.body.username);
    req.flash('old_role',req.body.role);
    if(credentials.username === ''
        || credentials.password === ''
        || credentials.type === ''
        || credentials.name === ''){

        req.flash('msg', 'Missing credentials.');
        res.redirect('register');
    }else{
        // Check if the username already exists for non-social account
        User.findOne({'username': new RegExp('^' + req.body.username + '$', 'i'), type:{$in:['admin','editor']}/*, 'socialId': null*/}, function(err, user){
            if(err) throw err;
            if(user){
                req.flash('msg', 'Username already exists.');
                res.redirect('register');
            }else{
                User.create(credentials, function(err, newUser){
                    if(err) throw err;
                    req.flash('error', false);
                    req.flash('msg', 'Your account has been created.');
                    res.redirect('register');
                });
            }
        });
    }

}

// user edit by id
C.userupdate_get=function(req, res, next) {
    var id=req.query.id;
    if(!id)redirect('/admin/allusers');
    req.flash('redirect_error',true);
    User.findById(id,function (err, user) {
        if(err){
            req.flash('redirect_msg','No record find For this user');
            redirect('/admin/allusers');
        }else{
            req.flash('redirect_error', false);
            // var resetdata={
            //     'error':req.flash('error'),
            //     'msg':req.flash('msg'),
            //     'old_name':req.flash('old_name',req.body.name),
            //     'old_username':req.flash('old_username',req.body.username),
            //     'old_role':req.flash('old_role',req.body.role),
            // };
            // user.append(resetdata);
            res.render('/admin/user/user_edit',user);
        }


    });

};
C.userupdate_post=function(req, res, next) {
    var credentials = {
        'username': req.body.username,
        'password': req.body.password,
        'type': req.body.role,
        'name': req.body.name };
    req.flash('error',true);
    req.flash('old_name',req.body.name);
    req.flash('old_username',req.body.username);
    req.flash('old_role',req.body.role);
    if(credentials.username === ''
        || credentials.password === ''
        || credentials.type === ''
        || credentials.name === ''){

        req.flash('msg', 'Missing credentials.');
        res.redirect('register');
    }else{
        // Check if the username already exists for non-social account
        User.findOne({'username': new RegExp('^' + req.body.username + '$', 'i'), type:{$in:['admin','editor']}/*, 'socialId': null*/}, function(err, user){
            if(err) throw err;
            if(user){
                req.flash('msg', 'Username already exists.');
                res.redirect('register');
            }
        });
    }
    User.create(credentials, function(err, newUser){
        if(err) throw err;
        req.flash('error', false);
        req.flash('msg', 'Your account has been created.');
        res.redirect('register');
    });
}





module.exports=C;