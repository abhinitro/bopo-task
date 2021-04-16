module.exports=function(io){

    let all_users={};
    io.on('connection', function(socket){

        console.log("Connected On Network"+socket.id)

       



       

        socket.on('disconnect', function(){
            console.log(' has disconnected from the chat.' + socket.id);

         
        });



    });





}