# 基于weex-eros的增量发布系统

|文件夹|说明|
| ------------- |:-------------|
|backend|后端代码，基于vuejs，使用iview-admin-template|
|frontend|前端代码,基于fastify，sequelize|

## 准备
在MySQL中新建表，然后修改backend下config.js文件中数据库配置部分
```javascript
db: {
      dialect: 'mysql',
      host: 'localhost',// 改成你自己的数据库地址
      database: 'lygtq-eros-publish', // 改成你新建的数据库名称
      user: 'root', //数据库用户
      password: 'root' //数据库密码
    }
```
## 运行
```javascript
cd backend
npm i
npm run dev
```
```javascript
cd frontend
npm i
npm run dev
```