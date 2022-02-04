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
            path: '/home',
            name: 'home',
            component: () => import("@/components/home")
        }
    ]
})