//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.set('strictQuery', false);


    const cloudCluster = "mongodb+srv://faisalknpr:jqtxwxDyO2j0K2vj@clusterk.23wqc7w.mongodb.net/todolistDB?retryWrites=true&w=majority";
    const conn = mongoose.connect(cloudCluster,{useNewUrlParser:true});
    console.log(`MongoDB Connected`);



const itemSchema = {name:String};
const Item = mongoose.model("item",itemSchema);
const item1 = new Item({name:"Welcome to your todolist!"});
const item2 = new Item({name:"Hit the + button to add a new item."});
const item3 = new Item({name:"<-- Hit this to delete the item"});
const defaultItem = [item1,item2,item3];

app.get("/", function(req,res){
  Item.find({}, function(err,result){
    if (result.length === 0){
      Item.insertMany(defaultItem, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Items inserted");
        }
      });
      res.redirect("/");
    }else{
      res.render("list", {listTitle: "Today", newListItems: result});
    }
  });
});
const listSchema ={
  name:String,
  item:[itemSchema]
};
const List = mongoose.model("List",listSchema);

app.get("/:customListName", function(req,res){
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({name:customListName}, function(err,result){
    if (!err) {
      if (!result){
      const list = new List({
        name:customListName,
        item:defaultItem
      });
      list.save();
      res.redirect("/" + customListName);
    }else {
        res.render("list", {listTitle:customListName, newListItems:result.item})
    }
  }
});
});


app.post("/", function(req, res){
  const listName = req.body.list;
  const itemName = req.body.newItem;
  const item = new Item({
    name:itemName
  });

  if(listName === "Today"){
    item.save();
    res.redirect("/");
  }else{
    List.findOne({name: listName}, function(err,result){
      result.item.push(item);
      result.save();
      res.redirect("/"+ listName);
    });
  }
});


// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

app.post("/delete", function(req,res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err){
      if(!err){
        console.log("item removed");
      }
    })
    res.redirect("/")
  }else{
    List.findOneAndUpdate({name:listName},{$pull:{item:{_id:checkedItemId}}},function(err,result){
      if (!err) {
        res.redirect("/"+listName);
      }
    })
  }

});

app.get("/about", function(req, res){
  res.render("about");
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log(`Server started on port ${PORT}`);
});
