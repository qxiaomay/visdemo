import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import VueRouer from 'vue-router'
import fans from 'components/fans/fans'
import emotion from 'components/emotion/emotion'
import timeline from 'components/timeline/timeline'
import dashboard from 'components/dashboard/dashboard'
import themeRiver from 'components/themeRiver/themeRiver'
// import wordCloud from 'components/wordCloud/wordCloud'
import { DatePicker } from 'element-ui'

Vue.component(DatePicker.name, DatePicker)

Vue.use(VueRouer)
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        count: 0,
        color: ['#325B69', '#698570', '#AE5548', '#6D9EA8', '#9CC2B0', '#C98769']
    }
});
const router = new VueRouer({
    routes: [{
        path: '/fans',
        component: fans
    }, {
        path: '/emotion',
        component: emotion
    }, {
        path: '/dashboard',
        component: dashboard
    }, {
        path: '/themeRiver',
        component: themeRiver
    }, {
        path: '/timeline',
        component: timeline
    }],
    linkActiveClass: 'active'
})
new Vue({
    router,
    store,
    template: '<App>',
    components: {
        App
    },
    data: {
        eventHub: new Vue(),
        charts: []
    }
}).$mount('#app')

router.push('dashboard')