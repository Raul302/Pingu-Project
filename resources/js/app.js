/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

import moment from 'moment';

import { Form,HasError,AlertError} from 'vform';

import Swal from 'sweetalert2'
window.swal = Swal;

const toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  })
window.toast = toast;


window.Form = Form;
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)

import VueRouter from 'vue-router'
Vue.use(VueRouter)


import VueProgressBar from 'vue-progressbar'
Vue.use(VueProgressBar, {
    color:'rgb(143,255,199)',
    failedColor:'red',
    height: '3px'
})

let routes =[
    {path: "/dashboard",component:require('./components/Dashboard.vue').default },
    {path: "/developer",component:require('./components/Developer.vue').default },
    {path: "/profile",component:require('./components/Profile.vue').default},
    {path: "/users",component:require('./components/Users.vue').default}
]

const router = new VueRouter({
    mode:'history',
    routes
})

Vue.filter('upText',function(text){
    // return text.toUpperCase();
    return text[0].toUpperCase() + text.slice(1)
});
Vue.filter('myDate',function(created){
    
    return moment(created).format('MMMM Do YYYY, h:mm:ss a');
});

window.Fire = new Vue();


Vue.component(
    'passport-clients',
    require('./components/passport/Clients.vue').default
);

Vue.component(
    'passport-authorized-clients',
    require('./components/passport/AuthorizedClients.vue').default
);

Vue.component(
    'passport-personal-access-tokens',
    require('./components/passport/PersonalAccessTokens.vue').default
);

Vue.component('example-component', require('./components/ExampleComponent.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    router
});
