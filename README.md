# Laravel 5.2 + Webpack 4

> Laravel搭配純粹的Webpack 4, 並具備Hot Reload

## 前言

因新版的Laravel(5.4 up)使用laravel-mix作為內建, 但其中的Webpack起今為止是v.3(2018/6)

Webpack 4提升了很多方面, 此專案示例該如何設定Webpack 4來對應Laravel專案的`Multiple Entry Point`以及搭配`Hot-Reload`

## 參數

| Parameter | Explanation | Example |
| --------- | ----------- | ------- |
| ignoreEntries `<Array>[string]` | 要排除的進入點 | `['.DS_Store.js']` |
| outputPath `[string]` | 輸出目錄 | `resources/views/bundle` |
| entryPath `[string]` | 進入點目錄 | `resource/assets/js/entries` |
| defaultChunks `<Array>[string]` | 預設加入的Chunks | `[vendor, commons]` |

## 原理

此技術原理主要是讓程式自動去跑HtmlWebPlugin
自行客制的AutoWebPlugin會針對以下架構去自動搭配HtmlWebPlugin

## 使用方式

```bash
$ yarn hot
```

將對應的*.blade.php引入bundle檔案
ex. page1.blade.php記得在body底部加入`@include('bundle.page1')`

再開另一個terminal tab去執行Laravel server即可, `php artisan serve --port=8080`

## 附註

預設的php server port = 8080, webpack-dev-server port = 3000
部份code可在自行抽出來`(webpack.dev.js | webpack.pro.js)`
