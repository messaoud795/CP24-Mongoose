const mongoose=require("mongoose");
// connect to mongod server and create contactDB database
mongoose.connect("mongodb://localhost:27017/listDB", { useNewUrlParser: true , useUnifiedTopology: true});

//Connection check to mongodb server
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("we're connected to the database server") ; 
});
//create the schema
personSchema=new mongoose.Schema({
 name : {type:String, required:[true, "Please enter a name"]},
 age  : Number,
  favoriteFoods :  [{type: String}]
})
// Create the model
const Person=mongoose.model("Person", personSchema);
//add record to our database
const arrayOfPeople=[
{name: "John" , age: 26 , favoriteFoods: ["Banana", "chiken", "meat"]} ,
{name: "Mary" , age: 52 , favoriteFoods: ["Salad", "apple", "fish"]} ,
{name: "Sam" , age: 40 , favoriteFoods: ["Apple", "chiken", "burrito"]} ,
{name: "Adam" , age: 62 , favoriteFoods: ["Cake", "burrito", "riz"]} ,
{name: "Mary" , age: 23 , favoriteFoods: ["Cake", "choclate", "honey"]} ,
{name: "John" , age: 50 , favoriteFoods: ["Strawberry", "burrito", "meat"]}];

// count the number of records in listDB  
Person.countDocuments({}, (error, count)=>{
  if (error) {console.log(error)}
  else  { doc(count)}})

//Add docs only the fist time when the num of docs =0
function doc(n) {
  console.log(n);
  if (n==0){
    Person.create(arrayOfPeople, (err, data)=>{
      if (err){console.log(err)}
      else {    mongoose.connection.close();
        console.log("docs successfully saved to the DB"+ data);
        return (null, data)}}) }
  
}
// find all the people with name of  John
Person.find({ name: 'John'}, (error,data)=>{
  if (error){console.log(error)}
  else {
    console.log("Found Johns" + data);
  }
});

//find all the first John
Person.findOne({ name: 'John'}, (error,data)=>{
  if (error){console.log(error)}
  else {
    console.log("the first John found "+data);
  }
});

//update a doc found attribute age to 20
Person.updateOne({name:"Adam"},{age:20},(err)=>
err? console.log(err):console.log("successfully updated"));

//find doc by id and update the favoritefood attribute
Person.findById("5f72ec53ab48b20d34943ec9", (error,data)=>{
  if (error){console.log(error)}
  else {
    console.log(data)
    data.favoriteFoods.push("Hamburger");
    data.save();
    console.log("doc found by id and updated "+ data);
  }
});

//delete the docs with name of Mary
  Person.deleteMany({name:"Mary"}, (error)=>{
  if (error){console.log(error)}
  else {console.log("sucessfully removed")}
})

//find the two people who like burrito and sort them by age descendtly 
Person.find({favoriteFoods: { $all : ["burrito"]}}).sort({'name':1}).limit(2).select('name favoriteFoods').exec((error,data)=>{
  if (error){console.log(error)}
  else {
    console.log("two People  like burrito "+data); }})




