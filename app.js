const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
mongoose.connect(
  "mongodb+srv://jeevan24:Enableit123@authmodule.s3btc.mongodb.net/authModule"
);
mongoose.connection
  .once("open", function () {
    console.log("Connection has been made successfully.");
  })
  .on("error", function (error) {
    console.log("error is :", error);
  });

app.use(bodyParser.urlencoded({ extended: true }));

const Schemas = require("./models/mongoschema");

const createModel = async (req, res) => {
  try {
    const crt = await Schemas.create(req.body);
    if (crt) {
      return res.send(crt);
    } else {
      return res.send("error");
    }
  } catch (err) {
    console.log(err);
    throw Error("something went wrong", err.message);
  }
};

const getPost = async (req, res) => {
  try {
    let regex = new RegExp(req.query.search);
    console.log(regex);

    const data = await Schemas.aggregate([
      {
        $match: {
          title: { $regex: regex, $options: "i" },
        },
      },
      {
        $addFields: {
          score: {
            $indexOfCP: [
              { $toLower: "$title" },
              { $toLower: req.query.search },
            ],
          },
        },
      },

      { $sort: { score: 1 } },

      // { $match:
      //   {
      //     $search: {
      //       index: "search_title",

      //       text: {
      //         query: req.query.search,
      //         path: "title",
      //         fuzzy: { maxEdits: 2 , maxExpansions:1000},
      //       },
      //     },
      //     // },
      //   },
      //   {
      //     $project: {
      //       title: 1,
      //       tag: 1,
      //       score: { $meta: "searchScore" },
      //     },
      //   },
    ]);
    return res.send(data);
  } catch (err) {
    console.log(err);
    throw Error("something went wrong");
  }
};

app.post("/create-post", createModel);
app.get("/search", getPost);

app.listen(3000, () => {
  console.log("app is listening at", 3000);
});
