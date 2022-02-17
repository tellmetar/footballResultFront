import Vue from 'vue';
import VueRouter from 'vue-router'

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: "/signin",
            name: "Signin",
            meta: {
              title: "Auto Vue"
            },
        },        
        {
            path: '/',
            redirect: 'user'
        },
        {
            path: '/user',
            name: 'user',
            component: () => import("@/components/user")
        },
        {
            path: '/addResult',
            name: 'addResult',
            component: () => import("@/components/addResult")
        },
        {
            path: '/result',
            name: 'result',
            component: () => import("@/components/result")
        },
    ]
})