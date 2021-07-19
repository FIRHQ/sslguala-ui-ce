import { createRouter, createWebHistory } from 'vue-router';
import Home from 'page/Home/Home.vue';
import DomainDashboard from 'page/Home/DomainDashboard.vue';
import DomainDetail from 'page/Domain/Details.vue';
// import HelloWorld from '../components/HelloWorld.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    redirect: '/projects',
    children: [
      {
        path: 'projects/:project_id/domains/:id/details',
        component: DomainDetail,
        props: true,
      },
      { path: 'projects/:project_id', component: DomainDashboard },
      { path: 'projects', component: DomainDashboard },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ 'page/Login/Login.vue'),
  },
  {
    path: '/auth/callback',
    name: 'auth',
    component: () => import('page/Auth/Auth.vue'),
  },
  // {
  //   path: '/api/description',
  //   name: 'apidoc',
  //   component: () => import('page/ApiDoc/ApiDoc.vue'),
  // },
  {
    path: '/msg_channels',
    name: 'msg_channels',
    component: () => import('page/MsgChannel/Channel.vue'),
  },
  // {
  //     path: "/about",
  //     name: "About",
  //     // route level code-splitting
  //     // this generates a separate chunk (about.[hash].js) for this route
  //     // which is lazy-loaded when the route is visited.
  //     component: () =>
  //         import(/* webpackChunkName: "About" */ "../components/About.vue")
  // }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
