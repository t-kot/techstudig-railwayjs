DiverNode
=========
作業するときはwikiのsetup方法 https://github.com/TechStuDIG2012b/DiverNode/wiki
とgit運用 https://github.com/TechStuDIG2012b/DiverNode/wiki/_pages
を読んでください

### About
socket.ioを使用したリアルタイムシューティングゲーム。接続すると、一定秒ごとのスコアがsubmitされ、同時接続している他のユーザのスコアと比較、スコアが良いとスターがもらえる。もらえるスターの数は接続数に応じて変化し、逆にスコアが悪いとスターが奪われる。

### 詳細
ゲームは2種類ある。ただし現在動作がちゃんとしているのはhalloweenのほうで、invaderは未確認。

ユーザはgame作成時に「倍率」を選択できる。(ex「ガンガン賭ける」など

2名以上でゲームをプレイしていると、ラップスコアの順位と倍率に応じてスターのやり取りを行う。スターは非同期でmongoに永続化される。

また、ゲーム入室のたびにjackpotがたまる。一定の条件を満たした場合に特定のプレイヤーにjackpotが払い出される。（ただしjackpotを手に入れてどうなるかは未実装）
そのほか、入室時にランダムで全体にボスイベントが発生する。本来は接続数10以上かつ10%の確率としていたが、デモ用に接続数の条件はコメントアウトしている。こちらも、ボスが出現して倒すことはできるが、倒してどうなるということはなく、また、ボスにやられるとか逃げられるということがないのでゲーム性には改良の余地が残る。

### 使っているモジュール
* node 0.8.4
* npm 1.1.45
* jade テンプレートエンジン http://jade-lang.com/
* socket.io     リアルタイムアプリケーションの実装のためのライブラリ, http://jxck.github.com/socket.io/
* coffee-script     JavaScriptのBad partsを排除したRuby/Python風言語, http://coffeescript.org/
* jugglingdb    ORM  https://github.com/1602/express-on-railway/wiki/ORM
* RailwayJS     Rails風のMVCフレームワーク。Expressと完全互換
* Express    nodeJSのデファクトスタンダード的フレームワーク
* nvm        nodeのバージョンをスイッチするツール。基本的には今回は0.8.4なので切り替えなどで使うことはない(というかそもそもインストールもいらないのだけれど)
* mongodb    ドキュメント指向DB。
* less CSSがスマートに書ける
* underscore.js 配列等に便利なメソッドが提供されるライブラリ

### setting
nvm(node version manager, rvmのようなもの)のインストールとNodeJSのインストール
     
     mkdir ~/.nvm
     git clone git://github.com/creationix/nvm.git ~/.nvm
     source ~/.nvm/nvm.sh
     nvm install v0.8.4
     nvm use v0.8.4
     node --version #=>v0.8.4

.zshrcに以下を追加
     
     source ~/.nvm/nvm.sh
     export PATH=$HOME/.nvm/v0.8.4/bin/:$PATH

mongoのインストールと起動(フォアグラウンドで)

    brew install mongodb
    mkdir ~/Library/MongoDB_Data
    mongod --dbpath=/Users/hogehoge/Library/MongoDB_Data

RailwayJSのインストールと動作確認

    npm install railway -g
    railway init blog --coffee && cd blog
    #=>coffeeで作成する
    npm install -l
    coffee server

レポジトリからclone

    git clone https://github.com/TechStuDIG2012b/DiverNode.git
    cd ./DiverNode
    git checkout develop
    npm install
    railway server #=>mongoを起動していることを確認のこと。
    
    



### ディレクトリ構成(重要なところは※)
* app/
	* views/ ビューが入っている
	* controllers/ controllerが入っている
	* models/ modelが入っている
	* helpers/ viewで使用するヘルパーメソッドが定義される
* config/
	* database.json データベースの設定ファイル
	* environment.coffee 環境設定ファイル(共通)
	* environments/ developmentやproductionごとの設定ファイル
	* initializers/ アプリ起動時に一度実行される処理。socket.ioの処理などはここに書いてある(※)
	* routes.coffee どのcontrollerに処理を渡すかのルーティング(※)
* db/
	* schema.coffee dbのスキーマ設定ファイル
* log/ 各ログファイル
* npmfile.coffee 全体で使用するモジュールのrequireをまとめる
* Procfile herokuにアプリ起動のコマンドを伝える
* package.json 使用するライブラリをここに書く
* public/
	* images/ 画像
	* stylesheets/ スタイルシート
	* uploads/ アップロードされたファイルの置き場
	* javascripts/
		* game.js ゲーム本体(※)
		* game-transceiver.js ゲームでsocket通信を行う(*)
* server.coffee 一般で言うapp.jsと同じ
* test/ testコード置き場

### adminページ
ユーザタイプがadminのものでログイン済みだと、/admin/にアクセスすると  
ページが見られる。ユーザや諸々のデータの編集・削除権限は基本的には当該ユーザのみに与えられるが、adminユーザはすべての情報を編集・削除できる。
実際的には通常のuser作成のときにはadminになることはさせずに、adminを増やす場合はadminページから作成するのが望ましいが、簡単のために通常のuser作成からadminを作ることができるようにした。

### テスト
nodeunit,sinonを使用。nodeunitはグローバルインストールした場合コマンドがなぜかうまく使えない(要確認)ので、プロジェクトのnode_modulesにインストールし、

NODE_ENV=test ./node_modules/nodeunit/bin/nodeunit test/controllers/**_controller_test.js

のように実行

あるいは

NODE_ENV=test ./nodeunit test/controllers/**_controller_test.js

というふうに提供済みのシンボリックリンクを使用する。

### 作成したnpm
◯load_fixture

https://npmjs.org/package/load_fixture

今回作成したのはdb/fixtures.jsonに用意したテスト用のデータをmongoに突っ込むためのライブラリで、処理的には

	"users":{
		"user1":{
			"name":"hoge"
			…
		},
		"user2":{
			"name":"fuga"
			…
		},
	"games":{
		"game1":{
			"title":"hoge",
			…
		},
		"game2":{
			"title":"fuga",
			…
		}
	}

users,gamesなどがモデル名に対応し、その中のそれぞれのuser1などを一つのレコードとして作成していく。
注意点としては、呼び出した時に一度users,gamesなどのレコードを一度すべて削除してからfixtureのデータを突っ込んでいるので、fixtureのデータをテスト終了時に削除するような、一般的な順序とは逆である。

また、validationを提供するモジュールは使っていないのでアプリ内のバリデーションの記述は無視される。

本来は_idも指定したかったが、原因不明でできなかった。（保存自体はできるが、アプリ側がうまく処理できなくなった）

そのためテストデータとして投入したオブジェクトをテストで使用する際にはUser.find({where:{name:"hoge"} }, function…
のようにしている。

使用する場合には

require('load_fixture').load {path: "db/fixtures.json", host: "localhost", db: "techstudig_test"}

のように用いる。今回,config/environments/test.coffeeの中で呼び出している。

ここから先は理想論として、もし時間がもっとあったら

* テストを書く
* mongoのObjectIdを指定可能にして、mongooseなどからfind可能にする
* fixtureからロード=>削除の順番に
* NODE_ENVがtestの場合のみテスト終了orサーバシャットダウン時にロードしたデータを削除
* コマンドラインツールの提供

などができたらよかったです。。。あと例外処理なども全く書いてないので。。。

### npmの利用
うまくいっていればサーバ起動を

	NODE_ENV=test railway s

とすればテストデータが入った状態でサーバを起動できる。ちなみにテストデータの実体はdb/fixtures.jsonにあり、ひとまず通常ユーザでログインするなら「username: tanaka password: kakuei」,adminユーザでログインするなら「username: fukuda password: takeo」でログインすると早い。
				
### その他
質問等はこちらまで。 <t.kotohata@gmail.com>

