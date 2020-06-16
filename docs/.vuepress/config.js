/*
 * @Author: your name
 * @Date: 2020-06-10 15:28:11
 * @LastEditTime: 2020-06-16 13:58:02
 * @LastEditors: LYoSoo
 * @Description: In User Settings Edit
 * @FilePath: \cloudgise:\normal-time\vuepress-d\docs\.vuepress\config.js
 */
module.exports = {
    title: 'LYoSoo’s Blog',
    description: '我的个人网站',
    // head: [ // 注入到当前页面的 HTML <head> 中的标签
    //     ['link', { rel: 'icon', href: '/logo.jpg' }], // 增加一个自定义的 favicon(网页标签的图标)
    // ],
    base: '/', // 这是部署到github相关的配置
    markdown: {
        lineNumbers: true // 代码块显示行号
    },
    themeConfig: {
        logo: "/img/logo.jpg",
        nav: [ // 导航栏配置
            { text: 'GitHub', link: 'https://github.com/LYoSoo' },
            { text: '有问题请问我', link: 'https://baidu.com' }
        ],
        sidebar: {
            '/': [
                ["/", "回到首页"],
            ]
        }
        // [{ // 左侧导航栏配置
        //     title: 'Vuepress搭建'
        //     // collapsable: false, //是否展开
        // },
        // ['/accumulate/2019/准备工作', '准备工作']
        // ]
        // sidebar: 'auto', // 侧边栏配置
        // sidebarDepth: 2, // 侧边栏显示2级
    }
};