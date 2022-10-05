var express = require('express');
var router = express.Router();
var productHelper = require("../helpers/product-helpers.js")
const userHelpers = require("../helpers/user-helpers")
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.render('user/user-login',{login:true,cart:false})
  }
}

// var ulala=false
/* GET home page. */
router.get('/', function (req, res, next) {
 


  productHelper.getAllProducts().then((products) => {
    let user = req.session.user
    
    
    res.render("user/view-products", { customer: true, products, user });
  })


});
router.get('/login', function (req, res, next) {
  // console.log(req.session)
  if (req.session.loggedIn) {
    res.redirect('/')


  } else {
    res.render("user/user-login", { login: true ,loginErr:req.session.loginErr,cart:true})
    req.session.loginErr=false
  }



});
router.get('/signup', function (req, res, next) {

  res.render("user/user-signup", { login: true })

});
router.post('/signup', function (req, res, next) {

  userHelpers.doSignup(req.body).then((response) => {
    req.session.loggedIn=true
    req.session.user=response
  
    
    res.redirect('/')

  })

});
router.post('/login', function (req, res, next) {

  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      // ulala=true
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect("/")
    } else {
      req.session.loginErr=true
      res.redirect('/login')
      // res.render("user/user-login", { login: true ,loggedIn:false})
    }
  })

});
router.get('/cart',verifyLogin,async(req,res)=>{
   let user = req.session.user
   let products = await userHelpers.getCartProducts(req.session.user._id)
   console.log(products)

  res.render('user/cart',{customer:true,user})
})
router.get('/add-to-cart/:id',verifyLogin,(req,res)=>{
  userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.redirect('/')
  })
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  // ulala=false
  res.redirect('/')
})



module.exports = router;
