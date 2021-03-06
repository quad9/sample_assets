// 1つ階層を上がったところにある『models』Dのcontacts.jsファイル
// modelを参照している、つまりmodelインスタンスを定数に格納
const Contacts = require("../models/contacts");

// メソッド定義
// FORM 入力FORMを表示する
exports.showForm = (req, res) => {
  // なぜ『/』パスは不要なのか？
  //   メソッドの受け側が、『app.get』したインスタンスなので
  //   resはディレクトリが判っているという理由で『/』パスは不要なのかも？
  //   それとも、express-ejs-layoutsモジュールが関係しているのか？
  res.render("contact_form");
};

// POST FORMに記入してDBに保存する
// 間にconfirmが必要。。。ここ課題！
exports.saveContact = (req, res) => {
  let newContact = new Contacts({
    name: req.body.name,
    email: req.body.email,
    contents: req.body.contents });
  newContact.save()
    .then( (ins) => {
      res.render("contact_posted", {
        Contact: ins
      });
    })
    .catch( (error) => {
      if (error) res.send(error);
    });
};

// LIST DB全データを取得する
exports.getAllContacts = (req, res) => {
  Contacts.find({})
    // findクリエからのプロミスを返す
    // DBにアクセスしてfindを実行し結果を返してるわけか？
    .exec()
    // 確保したデータをthenブロックで処理する
    .then( (ins) => {
      res.render("contacts_list", {
        // 違和感があるけど、とりあえず繋がる書き方
        Contacts: ins
      });
    })
    // プロミスを破ったエラーを掴む　という表現がよくわからない？
    .catch( (error) => {
      console.log(error.message);
      return [];
    })
    // ログを出す。ただし、この処理要るのか？
    .then( () => {
      console.log("promiseは完了です。")
    });
};