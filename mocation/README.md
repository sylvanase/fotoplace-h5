# mocation分享页
代码为开发模式，上线需要修改部分内容，请参照下方列表。

## 上线前所需操作：
- [ ] 将html，js，css，image文件夹按照原来的路径放置。
- [ ] lib包中的vue.js为调式模式，上线时需要使用vue.min.js，并将此文件重命名为vue.js
- [ ] 修改页面接口地址，如下所示
```javascript
//return axios.get('/api/area/' + id + '/route');
return axios.get('/api/mRoute.json');
```
- [ ] 将生成地图所需的png图标上传至金山云，并修改js/common/mserver.js文件中getMap()函数中图标的路径
```javascript
mapIcon = '图标在金山的完整路径';
```
