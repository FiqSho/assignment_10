// Basic Lib Import
const express =require('express');
const app= new express();
const bodyParser =require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Security Middleware Lib Import
const rateLimit =require('express-rate-limit');
const helmet =require('helmet');
const mongoSanitize =require('express-mongo-sanitize');
const hpp =require('hpp');
const cors =require('cors');

// Security Middleware Implement
app.use(cors())
app.use(helmet())
app.use(mongoSanitize())
app.use(xss())
app.use(hpp())

// Body Parser Implement
app.use(bodyParser.json())

// Request Rate Limit
const limiter= rateLimit({windowMs:15*60*1000,max:3000})
app.use(limiter)


//Task 1


const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  const Product = mongoose.model('Product', productSchema);
  

//   Task 2


const db = mongoose.connect('mongodb://localhost/products');

app.get('/products', (req, res) => {
  
  Product.find({}, (err, products) => {
    if (err) {
      res.status(500).send(err);
    } else {
      const response = products.map(product => ({
        name: product.name,
        price: product.price
      }));
      res.json(response);
    }
  });
});


//  Task 3


function generateToken(userId, secret) {
    const payload = {
      userId: userId
    };
    const token = jwt.sign(payload,secret, {
      algorithm: 'HS256',
      expiresIn: '1h'
    });
  
    return token;
  }

    const userId = 1234567890;
    const secret = 'my-secret-key';
    const token = generateToken(userId, secret);
    console.log(token);


//  Task 4


function authenticate(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, secretKey); 
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
  