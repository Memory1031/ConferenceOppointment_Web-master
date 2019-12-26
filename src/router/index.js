import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/group/login/login'
import Error404 from '@/pages/error404/error404'
import User from '@/group/user/user'
import AnnouncementUser from "@/pages/user/announcement_user/announcementUser";
import OppointConference from "@/pages/user/Oppconference/Oppconference"
import MyOpp from '@/pages/user/myOpp/myOpp'
import MyGroup from '@/pages/user/myGroup/myGroup'
import MyInfo from '@/pages/user/myInfo/myInfo'
import Manager from '@/group/manager/manager'
import AnnounceManager from '@/pages/manager/announce_Manager/announceManager'
import ManageConference from '@/pages/manager/manageConference/manageConference'
import ManagerInformation from '@/pages/manager/managerInformation/managerInfo'
import DepartmentInfo from '@/pages/manager/departmentInfo/departmentInfo'
import ManagerList from '@/pages/manager/managerList/managerList'
import OfferCheck from '@/pages/manager/offerCheck/offerCheck'
import Evaluate from '@/pages/manager/evaluate/evaluate'
import HistoryManager from '@/pages/manager/historyManager/historyManager'
import System from '@/group/system/system'
import AnnounceSystem from '@/pages/system/announce_System/announceSystem'
import SystemInfo from '@/pages/system/systemInfo/systemInfo'
import ManagerList2 from '@/pages/system/managerList/managerList'
import SystemList from '@/pages/system/systemList/systemList'
import TagManager from '@/pages/system/tagManage/tagManage'


import loginMobile from "@/mobile/loginMobile/loginMobile";
import UserMobile from '@/mobile/group/userMobile'
import AvaMobile from '@/mobile/pages/user/AvaConference/AvaMobile'
import InfoMobile from '@/mobile/pages/user/myInfo/infoMobile'
import AvaInfo from '@/mobile/pages/user/AvaInfo/AvaInfo'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      component: Error404,
      name: 'error404'
    },
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
          path: 'myOpp',
          component: MyOpp,
          name: 'myOpp'
        },
        {
          path: 'myGroup',
          component: MyGroup,
          name: 'myGroup'
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
        },
        {
          path: 'manageConference',
          component: ManageConference,
          name: 'manageConference'
        },
        {
          path: 'managerInfo',
          component: ManagerInformation,
          name: 'managerInfo'
        },
        {
          path: 'departmentInfo',
          component: DepartmentInfo,
          name: 'departmentInfo'
        },
        {
          path: 'managerList',
          component: ManagerList,
          name: 'managerList'
        },
        {
          path: 'offerCheck',
          component: OfferCheck,
          name: 'offerCheck'
        },
        {
          path: 'evaluate',
          component: Evaluate,
          name: 'evaluate'
        },
        {
          path: 'historyManager',
          component: HistoryManager,
          name: 'historyManager'
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
        },
        {
          path: 'systemInfo',
          component: SystemInfo,
          name: 'systemInfo'
        },
        {
          path: 'managerListS',
          component: ManagerList2,
          name: 'managerListS'
        },
        {
          path: 'systemList',
          component: SystemList,
          name: 'systemList'
        },
        {
          path: 'tagManage',
          component: TagManager,
          name: 'tagManage'
        }
      ]
    },
    {
      path: '/mobile',
      redirect: {name: 'loginMobile'}
    },
    {
      path: '/mobile/loginMobile',
      component: loginMobile,
      name: 'loginMobile'
    },
    {
      path: '/mobile/userMobile',
      component: UserMobile,
      redirect: {name: 'avaMobile'},
      children: [
        {
          path: 'avaMobile',
          component: AvaMobile,
          name: 'avaMobile'
        },
        {
          path: 'infoMobile',
          component: InfoMobile,
          name: 'infoMobile'
        }
      ]
    },
    {
      path: '/mobile/userMobile/avaInfo',
      component: AvaInfo,
      name: 'avaInfo'
    }
  ]
})


const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
