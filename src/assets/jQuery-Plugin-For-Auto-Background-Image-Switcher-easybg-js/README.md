jquery.easybg.js
================

指定した背景画像を自動で切り替えるjQueryプラグイン。

## 使用方法
### _html_
``` html
<div id="easybg"></div>
```
### _JavaScript_
``` javascript
$("#easybg").easybg([options | method]);
```

## OPTIONS

### _images_ (object Array)
画像ファイルパス
配列で複数指定できます
#### 初期値
null
#### example
``` javascript
$(".selector").easybg({
	images : ['/img/001.jpg', '/img/002.jpg', '/img/003.jpg']
});
```

### _interval_ (int)
画像を切替える間隔(ミリ秒)
#### 初期値
30000
#### example
``` javascript
$(".selector").easybg({
	interval : 15000
});
```

### _speed_ (int)
画像を切替えるスピード(ミリ秒)
#### 初期値
1000
#### example
``` javascript
$(".selector").easybg({
	speed : 2000
});
```

### _ignoreError_ (boolean)
画像の読み込みエラーを無視するかどうか設定できます。

true・・・画像の読み込みエラーを無視して処理を続行します。

false・・・画像の読み込みエラーが発生した場合処理を停止します。
#### 初期値
false
#### example
``` javascript
$(".selector").easybg({
	ignoreError : true
});
```

### _changeMode_ (normal|random)
画像の切り替え順番を指定します。

normal・・・画像の切り替えの順番は配列の並び順になります。

random・・・画像の切り替えの順番はランダムになります。

#### 初期値
normal
#### example
``` javascript
$(".selector").easybg({
	changeMode : 'random'
});
```



## METHODS

### _destroy_
プラグインの機能を削除します。
#### 引数
無し
#### 戻り値
jQueryオブジェクト
#### example
``` javascript
$(".selector").easybg('destroy');
```
