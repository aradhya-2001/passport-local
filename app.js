const express=require("express")
const session=require("express-session")
const mongoStore=require("connect-mongo")
const routes=require("./routes/routes")
const passport=require("./config/passport")

const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({  
/* this attaches "session" obj to req and console.log(req.session)=
Session {
    cookie: {
    path: '/',
    _expires: 2023-05-24T01:29:42.413Z,
    originalMaxAge: 60000,
    httpOnly: true
    }
} */
    secret:"some secret",
    resave:false,
    saveUninitialized:true,
    store:mongoStore.create({mongoUrl:"mongodb://0.0.0.0:27017/sessionDb"}), //session data will be stored in mongodb session store inside "sessions" collection (by default) inspite of being stored in memory
    cookie:{
        maxAge:1000*60  //1 min
    }
}))

/* app.get("/totalViews",(req,res,next)=>{
    if(req.session.views){
        req.session.views++
    }else{
        req.session.views=1
    }
    res.send(`<h1>total views: ${req.session.views}</h1>`)
}) */

//require("./config/passport")
app.use(passport.initialize())
app.use(passport.session())

/* app.use((req, res, next)=>{
    console.log(req.session)
    next();
}) */
app.use(routes)


app.listen(3000,()=>{
    console.log("server started")
})
