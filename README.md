DiverNode
=========

### Git Rules
#####Branch

* master => Stable Version
* develop => Development

##### 作業する場合
レポジトリの複製

git clone https://github.com/TechStuDIG2012b/DiverNode.git

developブランチに移動

git checkout develop

作業用ブランチの作成と移動

git checkout -b NEW_BLANCH 

一連の作業

git add , git commit , git reset  …..

リモートレポジトリに更新を反映（新しいブランチを作る）

git push origin NEW_BLANCH

再びdevelopに戻って、更新があれば取り込む

git checkout develop

git pull origin develop