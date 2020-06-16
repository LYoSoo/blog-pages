###
 # @Author: your name
 # @Date: 2020-06-10 15:33:32
 # @LastEditTime: 2020-06-10 17:01:03
 # @LastEditors: Please set LastEditors
 # @Description: In User Settings Edit
 # @FilePath: \cloudgise:\normal-time\vuepress-d\deploy.sh
### 
#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件 <根据实际情况修改>
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

git remote add origin https://github.com/lyosoo/lyosoo.github.io.git
# 请替换上面的<Your_name>
git push origin master -f
cd -