var config 	= require('../config');
var Material=require('../models/material.js').mat;
var ProductType=require('../models/producttype.js').producttype;
var Product=require('../models/product').product;
var Parameter=require('../models/parameter.js').parameter;
var Unit=require('../models/unit.js').unit;
var Client=require('../models/client.js').client;
var Project = require('../models/project').project;

module.exports = function(io) {

    io.on('connection', function (socket) {
        console.log("project socket connected");

        socket.on('alldata', async () => {
            var data= {
                materials: await Material.find({}).exec() ,
                producttypes: await ProductType.find({}).exec() ,
                units: await Unit.find({}).exec() ,
                parameters: await Parameter.find({}).exec() ,
            };
            // console.log(data);
            socket.emit('alldata',data);
        });

        socket.on('search_products', function (query) {
            console.log("search_products called",query);

            var q=Product.find({});
            if(!!query.material) q.where("material").equals(query.material);
            if(!!query.producttype) q.where("type").equals(query.producttype);
            q.populate('material type sellby.parameters');
            q.exec(function (err,products) {
                if(err)throw err;
                else{
                    // console.log(products);
                    socket.emit('search_products',products);
                }
            })
        });

        socket.on("registerAProject", async function(proj) {
            try {
                let { client , project , orderedProductSets } = proj;

                //deal with clientdata;
                let clientData=new Client();
                if(client.cfname) clientData.firstname = client.cfname;
                if(client.clname) clientData.lastname = client.clname;
                if(client.ccontactnumber)clientData.contactno = client.ccontactnumber;
                if(client.caddress)clientData.address = client.caddress;
                if(client.cemail)  clientData.email = client.cemail;
                if(client.creferer)  clientData.referer = client.creferer;
                clientData.country = "pakistan";
                clientData.city = "sargodha";

                let Cvali=clientData.validateSync();
                if(Cvali!==undefined){
                    socket.emit("registerAProject_error" , Cvali);
                    console.log("ClientObject.validate()",Cvali);
                    return ;
                }

                //deal with Projectdata;
                let projectData=new Project();
                let projectNo = Number.parseInt((new Date()).getFullYear().toString(10).substr(2,2)) *100000;
                // increment in last projectno || default ProjectNO
                let lastProject = await Project.findOne().sort({ 'createdAt': -1 }).exec();
                if (lastProject){
                    // if year ended give default ptoject number for next year
                    if(
                      Number.parseInt( lastProject.projectno.toString(10).substr(0,2) )
                      ===
                      Number.parseInt((new Date()).getFullYear().toString(10).substr(2,2),10)
                    ) projectNo = ++lastProject.projectno;
                /*console.log("last projectNo" , lastProject.projectno);*/}
                /*console.log("default projectNo" , projectNo);*/

                projectData.projectno=projectNo;

                // check if initial is given
                // if initial payment is given project status is "recorded"
                if(project.pinitpay!==""){
                    projectData.payments=[];
                    projectData.payments[0]={
                        payby:"cash", // As default
                        amount:project.pinitpay,
                        date:new Date
                    };
                    projectData.status="initiated";
                    projectData.confirm_date=new Date;
                }else{
                    // As default
                    projectData.status="recorded";
                }
                if(project.pdatepromissing){
                    projectData.milestones.push({
                    maturity_date:new Date(project.pdatepromissing)
                    });
                }
                if(project.psiteaddress)
                    projectData.site_address=project.psiteaddress;
                if(project.padditionalnote){
                    projectData.notes=[];
                    projectData.notes[0]=project.padditionalnote;
                }

                projectData.productsets=orderedProductSets.map(set=>{
                    return {
                        product:set._id,
                        with:set.booking.map(product=>{
                        let pO={};
                        pO.by=product.with.by;
                        if(product.with.parameters!==undefined) {
                            pO.parameters=product.with.parameters.map(p=>(
                              { parameter:p._id,
                                value:p.value,}
                            ));
                        }
                        pO.costa=product.with.cost;
                        return pO; }),
                    }
                });
                projectData.client=clientData._id;
                let Pvali=projectData.validateSync();
                if(Pvali!==undefined){
                    socket.emit("registerAProject_error" , { name:Pvali.name , message:Pvali._message });
                    console.log("ProjectObject.validate()",Pvali);
                    return ;
                }

                clientData.save();
                projectData.save();

            }catch (e) {
                console.log(e);
                }

        });

        // socket.on('search_products', function (query) {
        //     console.log("search_products called",query);
        //
        //     var q=Product.find({});
        //     if(!!query.material) q.where("material").equals(query.material);
        //     if(!!query.producttype) q.where("type").equals(query.producttype);
        //     q.populate('material type');
        //     q.exec(function (err,products) {
        //         if(err)console.log(err);
        //         else{
        //             console.log(products);
        //             socket.emit('search_products',products);
        //         }
        //     })
        // });











    });

    // Rooms namespace
    /*
        io.of('/rooms').on('connection', function(socket) {

            // Create a new room
            socket.on('createRoom', function(title) {
                Room.findOne({'title': new RegExp('^' + title + '$', 'i')}, function(err, room){
                    if(err) throw err;
                    if(room){
                        socket.emit('updateRoomsList', { error: 'Room title already exists.' });
                    } else {
                        Room.create({
                            title: title
                        }, function(err, newRoom){
                            if(err) throw err;
                            socket.emit('updateRoomsList', newRoom);
                            socket.broadcast.emit('updateRoomsList', newRoom);
                        });
                    }
                });
            });
        });

        // Chatroom namespace
        io.of('/chatroom').on('connection', function(socket) {

            // Join a chatroom
            socket.on('join', function(roomId) {
                Room.findById(roomId, function(err, room){
                    if(err) throw err;
                    if(!room){
                        // Assuming that you already checked in router that chatroom exists
                        // Then, if a room doesn't exist here, return an error to inform the client-side.
                        socket.emit('updateUsersList', { error: 'Room doesnt exist.' });
                    } else {
                        // Check if user exists in the session
                        if(socket.request.session.passport == null){
                            return;
                        }

                        Room.addUser(room, socket, function(err, newRoom){

                            // Join the room channel
                            socket.join(newRoom.id);

                            Room.getUsers(newRoom, socket, function(err, users, cuntUserInRoom){
                                if(err) throw err;

                                // Return list of all user connected to the room to the current user
                                socket.emit('updateUsersList', users, true);

                                // Return the current user to other connecting sockets in the room
                                // ONLY if the user wasn't connected already to the current room
                                if(cuntUserInRoom === 1){
                                    socket.broadcast.to(newRoom.id).emit('updateUsersList', users[users.length - 1]);
                                }
                            });
                        });
                    }
                });
            });
    */

    // // When a socket exits
    // socket.on('disconnect', function() {
    //
    //     // Check if user exists in the session
    //     if(socket.request.session.passport == null){
    //         return;
    //     }
    //
    //     // Find the room to which the socket is connected to,
    //     // and remove the current user + socket from this room
    //     /*      Room.removeUser(socket, function(err, room, userId, cuntUserInRoom){
    //               if(err) throw err;
    //
    //               // Leave the room channel
    //               socket.leave(room.id);
    //
    //               // Return the user id ONLY if the user was connected to the current room using one socket
    //               // The user id will be then used to remove the user from users list on chatroom page
    //               if(cuntUserInRoom === 1){
    //                   socket.broadcast.to(room.id).emit('removeUser', userId);
    //               }
    //           });
    //       });*/
    //
    //     /*// When a new message arrives
    //     socket.on('newMessage', function(roomId, message) {
    //
    //         // No need to emit 'addMessage' to the current socket
    //         // As the new message will be added manually in 'main.js' file
    //         // socket.emit('addMessage', message);
    //
    //         socket.broadcast.to(roomId).emit('addMessage', message);
    //     });*/
    //
    // });
}

