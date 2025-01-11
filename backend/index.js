const express = require('express')
const app = express()
const dbConnect = require('./db');
const path = require("path")
const fs = require('fs')
const multer = require('multer')
const chats = require('./data/data');
const port = 5000;
const cors = require('cors')

dbConnect();
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World!')
})
const ensureUploadsDirectoryExists = () => {
  const dir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
  }
};

// Call this to create the directory if it doesn't exist
ensureUploadsDirectoryExists();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      ensureUploadsDirectoryExists(); // Ensure the directory exists before saving the file
      cb(null, path.join(__dirname, 'uploads')); // Use absolute path
  },
  filename: function (req, file, cb) {
      let ext = path.extname(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
      cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const upload = multer({ storage: storage });

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  res.send({ filePath: `/uploads/${req.file.filename}` });
});
app.get('/about-us',(req,res)=>{
  res.send("this is about us")
})

app.get('/chats',(req,res)=>{
  res.send(chats)
})
app.get("/chats/:id",(req,res)=>{
  console.log(req.params.id);
  // res.send(`chat is is ${req.params.id}`)
  const singleChat = chats.find((c)=>c._id === req.params.id)
  console.log(singleChat);
  res.send(singleChat)
})
app.use(cors())
app.use('/api/auth', require('./routes/Auth'));
app.use('/api/product', upload.array('myfile') , require("./routes/Product"))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)

}) 