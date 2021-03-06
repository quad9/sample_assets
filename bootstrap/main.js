// expressをロードする
const express = require("express"),
      // expressをインスタンスとして保持する
      app = express();

// portの確保 環境変数で指定がなければ3000番をつかう
app.set("port", process.env.PORT || 3000);

// 本文の解析で、URLエンコーディングとJSONパラメータの処理を行う
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// for DB
const mongoose = require("mongoose");
// promiseを使う
mongoose.Promise = global.Promise;
// DBに接続
mongoose.connect(
  // DB名：form
  "mongodb://localhost:27017/form",
  // エラーの対処
  { useNewUrlParser: true, useUnifiedTopology: true }
  );
  //   mongoDBへ該当のDBを接続
  const db = mongoose.connection;
  //   接続確認のログを出力する
  db.once("open", () => {
    console.log("DBへの接続は成功しました。")
  });

// 静的ファイルの関連付け
//   イメージ、CSS ファイル、JavaScript ファイルなどの
//   静的ファイルを提供するには、Express に標準実装されている
//   express.static ミドルウェア関数を使用する。
//   静的アセットファイルを格納しているディレクトリーの名前を
//   express.static ミドルウェア関数に渡して、
//   ファイルの直接提供を開始する。
app.use(express.static("assets"));

// レイアウト
//   viewに関連するファイルの経路の起点となるディレクトリを有効にする
const layouts = require("express-ejs-layouts");
//   ejs形式ファイルの使用を設定
app.set("view engine", "ejs");
//   express-ejs-layoutsモジュールを使うことを宣言する
//   viewsディレクトリにファイルを配置する
//   レイアウトのための設計図であるlayouts.ejsが必須
app.use(layouts);

// controllerのメソッドをロードする    
// const pathCtl = require("./controllers/pathCtl");
const formCtl = require("./controllers/formCtl");
 
// 経路
//   リクエストが来た時の反応をここでスイッチングしていく
//   for index.ejs
app.get("/", (req, res) => {
  // 初期状態の様子をみるため、ブラウザに文字列を送信する
  res.send("Here is ROOT.");
  // res.render("index");
});
//   for contact _form _post s_list
//     1行目は、express-ejs-layoutsで場所を特定している
app.get("/contact_form", formCtl.showForm);

app.post("/contact_posted", formCtl.saveContact);

// List
app.get("/contacts_list", 
        formCtl.getAllContacts, (req, res, next) => {
          res.render("contacts_list", { Contacts: req.data }); 
        }
);
// // viewにデータを送るテスト
//      contacts_list.ejsへformCtl.getAllContactsメソッドを使って
//      req.dataを送れ
// app.get("/contacts_list", 
//         formCtl.getAllContacts,
//         (req, res, next) => { res.send(req.data); });

// アプリがPORTを監視するための設定
app.listen(app.get("port"), () => {
  console.log(`サーバーはhttp://localhost:${ app.get("port") }で起動しています。`);
});