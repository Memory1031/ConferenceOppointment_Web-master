import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/group/login/login'
import User from '@/group/user/user'
import AnnouncementUser from "../pages/user/announcement_user/announcementUser";
import OppointConference from "@/pages/user/Oppconference/Oppconference"
import MyInfo from '@/pages/user/myInfo/myInfo'
import Manager from '@/group/manager/manager'
import AnnounceManager from '@/pages/manager/announce_Manager/announceManager'
import System from '@/group/system/system'
import AnnounceSystem from '@/pages/system/announce_System/announceSystem'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: {name: 'login'}
    },
    {
      path: '/login',
      component: Login,
      name: 'login'
    },
    {
      path: '/user',
      component: User,
      redirect: {name: 'announcementUser'},
      children:[
        {
          path: 'announcementUser',
          component: AnnouncementUser,
          name: 'announcementUser'
        },
        {
          path: 'OppointConference',
          component: OppointConference,
          name: 'OppointConference'
        },
        {
          path: 'myInfo',
          component: MyInfo,
          name: 'myInfo'
        }
      ]
    },
    {
      path: '/manager',
      component: Manager,
      redirect: {name: 'announceManager'},
      children: [
        {
          path: 'announceManager',
          component: AnnounceManager,
          name: 'announceManager'
        }
      ]
    },
    {
      path: '/system',
      component: System,
      redirect: {name: 'announceSystem'},
      children: [
        {
          path: 'announceSystem',
          component: AnnounceSystem,
          name: 'announceSystem'
        }
      ]
    }
  ]
})


const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
