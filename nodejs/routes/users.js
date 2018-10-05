
/*
 * GET users listing.
 */

var jpv=require('jpv');

 var pattern={
     fname: '{/^[a-zA-Z]*$/}',
     lname:'{/^[a-zA-Z]*$/}',
     email: '[email]',
     phone:'/\d{10}/',
     city:'{/^[a-zA-Z]*$/}'
 };
 

exports.list = function(req, res){

  req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM users',function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.render('./list',{page_title:"users - Node.js",data:rows});
                
           
         });
         
         //console.log(query.sql);
    });
  
};

exports.add = function(req, res){
  res.render('./add',{page_title:"Add Contact - Node.js"});
};

exports.edit = function(req, res){
    
    var id = req.params.id;
    
    req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM users WHERE id = ?',[id],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.render('./edit',{page_title:"Edit contact - Node.js",data:rows});
                
           
         });
         
         //console.log(query.sql);
    }); 
};

/*Save the customer*/
exports.save = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));

    var result=jpv.validate(input,pattern);

    if (result)
    {
    req.getConnection(function (err, connection) {
        
        var data = {
            
            fname : input.fname,
            lname : input.lname,
            email : input.email,
            phone : input.phone,
            city  : input.city 
        
        }
    
        var query = connection.query("INSERT INTO users set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
              req.flash('success', 'Registration successfully');
              res.locals.message = req.flash();
          res.render('/list');
          
        });
        
      
    });
}

else{
    req.flash('error', 'One of the format is not correct \n FIRSTNAME,LASTNAME and CITY can only have alpha characters,\nPhone Numer can only contain number ,\nEmail:Should be in proper ');
    res.locals.message = req.flash();
    res.render('/list');


}
};


exports.save_edit = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    console.log(input);
    var id = req.params.id;

     var result=jpv.validate(input,pattern);

    if (result)
    {
    var result=jpv.validate(input,pattern);
    req.getConnection(function (err, connection) {
        
        var dat = {
            
            fname : input.fname,
            lname : input.lname,
            email : input.email,
            phone : input.phone,
            city  : input.city 
        
        };
        
        connection.query("UPDATE users set ? WHERE id = ? ",[dat,id], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
              req.flash('success', 'Registration successfully');
              res.locals.message = req.flash();
         
          res.render('/list');
          
        });
    
    });
}

else{
    req.flash('error', 'One of the format is not correct \n FIRSTNAME,LASTNAME and CITY can only have alpha characters,\nPhone Numer can only contain number ,\nEmail:Should be in proper ');
    res.locals.message = req.flash();
    res.render('/list');


}
};


exports.delete_customer = function(req,res){
        
     var id = req.params.id;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM users  WHERE id = ? ",[id], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/list');
             
        });
        
     });
};

