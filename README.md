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

配置引用文件方法
configureWebpack: {
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '@': resolve('src')
            }
        }
     },
```
### vuex源码解析：http://localhost:8080/ store里的引入可以查看
### MMVM源码解析：http://localhost:8080/mmvm.html
### tree源码解析：http://localhost:8080/Main1
### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
