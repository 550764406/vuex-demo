const path = require("path");

function resolve(dir) {
    console.log('3333333333333333333333',path.join(__dirname, dir))
    return path.join(__dirname, dir);
}

module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '@': resolve('src')
            }
        }
     },

}