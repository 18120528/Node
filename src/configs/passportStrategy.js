const passport=require('passport');
const LocalStrategy = require("passport-local").Strategy;
const User=require('../models/users');

module.exports=function()
{
  //User Object to ID
  passport.serializeUser((user,done)=>
  {
    done(null,user.id);
  });
  //ID to User Object
  passport.deserializeUser(async (id,done)=>
  {
    try 
    {
      const user = await User.findById(id);
      done(null, user); // Pass null for error and user object for user
    } catch (err) 
    {
      done(err); // Pass error to done if there's an error
    }
});
  //Strategy
  passport.use('login',new LocalStrategy(//overide name as login/ default is local
  {
    usernameField: 'username',
    passwordField: 'password'
  },async (username, password, done)=>
  {
    user=await User.findOne({username: username});
    if(user)
    {
      user.checkPass(password,(err,isMatch)=>
      {
        if(err){return done(err);}
        if(isMatch) {return done(null,user);}
        else {return done(null,false,{message: "Wrong Password!"});}
      });
    }
    else
    {
      return done(null,false, { message: "The Username Do Not Existed!" });
    }
  }));
}
