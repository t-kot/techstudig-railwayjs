DiverNode
=========
作業するときはwikiのsetup方法 https://github.com/TechStuDIG2012b/DiverNode/wiki
とgit運用 https://github.com/TechStuDIG2012b/DiverNode/wiki/_pages
を読んでください

### About
socket.ioを使用したリアルタイムシューティングゲーム。接続すると、一定秒ごとのスコアがsubmitされ、同時接続している他のユーザのスコアと比較、スコアが良いとスターがもらえる。もらえるスターの数は接続数に応じて変化し、逆にスコアが悪いとスターが奪われる。

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
	* routes.coffee どのcontrollerに処理を渡すかのルーティング(*)
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
		* game.js ゲーム本体(*)
		* game-transceiver.js ゲームでsocket通信を行う(*)
* server.coffee 一般で言うapp.jsと同じ
* test/ testコード置き場

### adminページ
ユーザタイプがadminのものでログイン済みだと、/admin/にアクセスすると  
ページが見られる。ユーザや諸々のデータの編集・削除権限は基本的には当該ユーザのみに与えられるが、adminユーザはすべての情報を編集・削除できる。
実際的には通常のuser作成のときにはadminになることはさせずに、adminを増やす場合はadminページから作成するのが望ましいが、簡単のために通常のuser作成からadminを作ることができるようにした。

### その他
質問等はこちらまで。 <t.kotohata@gmail.com>

