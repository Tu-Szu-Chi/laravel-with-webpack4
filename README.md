# Laravel 5.2 + Webpack 4

## 前言

因新版的Laravel大多使用laravel-mix作為內建, 但其中的Webpack起今為止是v.3(2018/6)

Webpack 4提升了很多方面, 此專案示例該如何設定Webpack 4來對應Laravel專案的`Multiple Entry Point`以及使用`Hot-Reload`

## 架構

自行開發的AutoWebPlugin會針對以下架構去自動注入HtmlWebPlugin

### resources/views/template

底下的每個Floder代表頁面, 其中的index.blade.php會被注入所需要的Chunks

### resources/assets/js/entries

底下的每個js代表各頁面js入口點, 會自動注入至對應的/template/***/index.blade.php

### resources/assets/vue

放置Vue相關組件, 其中架構不影響Webpack編譯

## Run

先編譯

```bash
>npm run build
```

啟用webpack server搭配Hot-reload開發

```bash
>npm run run:dev
```