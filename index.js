import express from "express";
import bodyParser from "body-parser";
import pg from "pg"

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'INSERT DATABASE NAME',
  password: 'INSERT PASSWORD',
  port: 5432,
})

db.connect()


async function getItems(){
  let items = [];
  const titles = (await db.query("SELECT * FROM items")).rows
  titles.forEach((title) => 
    items.push(title)
  )
  return items
}


app.get("/", async (req, res) => {
  try{
    const items = await getItems()
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch(err){
    console.log(err)
  }
  
});

app.post("/add", async (req, res) => {
  try{
    await db.query("INSERT INTO items(title) VALUES($1)", [req.body.newItem])
    res.redirect("/");
  } catch(err){
    console.log(err)
  }
  
});

app.post("/edit", async (req, res) => {
  try{
    await db.query("UPDATE items SET title=$1 WHERE id=$2", [req.body.updatedItemTitle, req.body.updatedItemId])
    res.redirect("/")
  } catch(err){
    console.log(err)
  }
    
});


app.post("/delete", async (req, res) => {
  try{
    await db.query("DELETE FROM items WHERE id=$1 ", [req.body.deleteItemId])
    res.redirect("/")
  } catch(err){
    console.log(err)
  }
  
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
