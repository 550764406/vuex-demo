vuex源码解析

# vuecli3-demo

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```
### vuex源码解析：http://localhost:8080/ store里的引入可以查看
### MMVM源码解析：http://localhost:8080/mmvm.html
### tree源码解析：http://localhost:8080/Main1
### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### vue ssr 服务端渲染：构建客户端的应用程序放在服务器端渲染，以便做SEO搜索引擎爬虫捉取，它只能调用两个生命周期函数 beforecreated和created做渲染
## yarn add webpack webpack-cli webpack-dev-server babel-loader @babel/preset-env @babel/core vue-style-loader css-loader
###  vue-loader vue-template-compiler html-webpack-plugin webpack-merge
###  客户端打包：npm run client:bulid
###  服务端打包： npm run server:build
###  启动服务： http://localhost:7777/
