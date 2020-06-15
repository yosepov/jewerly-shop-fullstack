const express = require("express");
const socketIO = require("socket.io");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const http = require("http");

// import controllers: 
const usersController = require("./controllers/users-controller");
const productsController = require("./controllers/products-controller");
const cartController = require("./controllers/cart-controller");
const orderController = require("./controllers/order-controller");
const categoiesController = require("./controllers/categories-controller");
const cartsLogic = require("./bll/cart-logic");
const productLogic = require("./bll/products-logic");
const cors = require("cors");
const server = express();

// server.use: 
server.use(cors());
server.use(express.json());
server.use("/api/users", usersController);
server.use("/api/products", productsController);
server.use("/api/categories", categoiesController);
server.use("/api", cartController);
server.use("/api/orders", orderController);
server.use(express.static(__dirname));
// need to get the category name
const upload = multer({ dest: __dirname + "\\assets\\products" });

server.post("/upload-image", upload.single("myImage"), (request, response) => {
    let newObj = JSON.parse(request.body.newProduct);
    console.log(request.file);
    const fileExtension = path.extname(request.file.originalname);
    const multerFilename = request.file.destination + "\\" + request.file.filename;
    const finalFileName = multerFilename + fileExtension;

    // Rename multer file name to contain the original extension: 
    fs.rename(multerFilename, finalFileName, err => {
        if (err) {
            response.status(500).json(err);
            return;
        }
        response.send("Done.");


    });
    try {
        newObj.img_name = request.file.filename + fileExtension;
        console.log("new product: ", newObj);
        productLogic.addProduct(newObj);
    }
    catch (err) {
        console.log(err);
    }
});


// Socket.io
const httpServer = http.createServer(server).listen(3001, () => console.log('socketing on port 3001...'))
const socketServer = socketIO.listen(httpServer);
const allSockets = [];

socketServer.sockets.on("connection", async socket => {
    allSockets.push(socket);

    socket.on('disconnect', () => {
        const index = allSockets.indexOf(socket);
        allSockets.splice(index, 1);
    });

    socket.on("call-cart-items", async cart_id => {
        console.log(cart_id);
        const cartItems = await cartsLogic.getCartItemsFromOneCart(cart_id);
        socketServer.sockets.emit("call-cart-items", cartItems);
        console.log(cartItems);
    });

});

server.listen(8080, () => console.log("Listening..."));