# 基于weex-eros的增量发布系统

|文件夹|说明|
| ------------- |:-------------|
|backend|后端代码，基于vuejs，使用iview-admin-template|
|frontend|前端代码,基于fastify，sequelize|

## 准备
> 安装bsdiff，并把bsdiff路径写入系统环境变量中（请自行百度）

> 安装nodejs > 8.0版

> 安装MySQL,并在MySQL中新建表，然后修改backend下config.js文件中数据库配置部分
```javascript
db: {
      dialect: 'mysql',
      host: 'localhost',// 改成你自己的数据库地址
      database: 'lygtq-eros-publish', // 改成你新建的数据库名称
      user: 'root', //数据库用户
      password: 'root' //数据库密码
    }
```
## 测试
### 运行
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

### 访问 [http://localhost:8080/](http://localhost:8080/)

### 使用
> 新建APP,填入APP名称和erosAppName(为eros.native.js中设置的appName)

> 选择APP管理，新建版本，填写版本名称，上传eros build 命令在dist/js中生成的zip全量包
>> 上传全量包后，系统会自动生成增量发布包
>> 上传的全量包和生成的增量包都在backend/uploads下，注意该目录的写入权限

> 在eros.native.js中修改bundleUpdate路径，为：backend系统域名/check 或用反向代理将backedn的/check路径和/uploads路径暴露出去使用

### 备注
本系统只是演示eros增量更新逻辑，未集成登录、验证等操作。建议在本系统基础上添加自己的登录验证逻辑，并把全量包和增量包保存在阿里OSS等公共存储或CDN上加速下载。
