import axios from 'axios'
import Router from '../router'
import {Notice} from 'view-design';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = localStorage.getItem('token')
  }
  return config;
},
  (error) => {
  // console.error('request interceptor: ', error)
  // if (error.response) {
  //   switch (error.response.status) {
  //     case 401:
  //       if(localStorage.getItem('token')){
  //         localStorage.clear()
  //       }
  //       let url = document.location.toString();
  //       let arr = url.split("//");
  //       let last = arr[1].substring(arr[1].indexOf("/"));
  //       console.log(last)
  //       if(last != '/login' && last != '/mobile/loginMobile'){
  //         localStorage.setItem('last', last)
  //       }
  //       Router.replace('/login');
  //       setTimeout(() => {
  //         $Notice.error({
  //           title: "请先登录",
  //           content: "您没有访问该页面的权限，或许是因为您的用户身份与该页面不一致，请重新登录，系统会自动跳转到相应页面。",
  //           duration: 5
  //         })
  //       }, 1500)
  //       break;
  //     case 403:
  //       if(localStorage.getItem('token')){
  //         localStorage.clear()
  //       }
  //       url = document.location.toString();
  //       arr = url.split("//");
  //       last = arr[1].substring(arr[1].indexOf("/"));
  //       console.log(last)
  //       if(last != '/login' && last != '/mobile/loginMobile'){
  //         localStorage.setItem('last', last)
  //       }
  //       Router.replace('/login');
  //       setTimeout(() => {
  //         $Notice.error({
  //           title: "请先登录",
  //           content: "您没有访问该页面的权限，或许是因为您的用户身份与该页面不一致，请重新登录，系统会自动跳转到相应页面。",
  //           duration: 5
  //         })
  //       }, 1500)
  //       break;
  //   }
  // }
  return Promise.reject(error)
})

axios.interceptors.response.use((res) => {
  return res;
}, (error) => {
  // console.error('response interceptor: ', error)
  console.log(Object.assign({}, error))
  if (error.response) {
    switch (error.response.status) {
      case 401:
        if(error.response.data.message != "无权限访问") {
          if (localStorage.getItem('token')) {
            localStorage.clear()
          }
          let url = document.location.toString();
          let arr = url.split("//");
          let last = arr[1].substring(arr[1].indexOf("/"));
          console.log(last)
          if (last != '/login' && last != '/mobile/loginMobile') {
            localStorage.setItem('last', last)
            localStorage.setItem("logout", "comfirm")
          }
          Router.replace({ path: '/login'});
        } else{
          localStorage.clear();
          localStorage.setItem("logout", "comfirm")
          Router.replace({ path: '/login'});
        }
        setTimeout(() => {
          Notice.error({
            title: "请先登录",
            content: "您没有访问该页面的权限，或许是因为您的用户身份与该页面不一致，请重新登录，系统会自动跳转到相应页面。",
            duration: 5
          })
        }, 1500)
        break;
      case 403:
        if(error.response.data.message != "无权限访问") {
          if (localStorage.getItem('token')) {
            localStorage.clear()
          }
          let url = document.location.toString();
          console.log(url)
          let arr = url.split("//");
          let last = arr[1].substring(arr[1].indexOf("/"));
          if (last != '/login' && last != '/mobile/loginMobile') {
            localStorage.setItem('last', last)
            localStorage.setItem("logout", "comfirm")
          }
          Router.replace({ path: '/login'});
        } else{
          localStorage.clear();
          localStorage.setItem("logout", "comfirm")
          Router.replace({ path: '/login'});
        }
        setTimeout(() => {
          console.log('!!!')
          Notice.error({
            title: "请先登录",
            content: "您没有访问该页面的权限，或许是因为您的用户身份与该页面不一致，请重新登录，系统会自动跳转到相应页面。",
            duration: 5
          })
        }, 10)
        break;
    }
  } else {
    if(error.response.data.message != "无权限访问"){
      if(localStorage.getItem('token')){
        localStorage.clear()
      }
      let url = document.location.toString();
      let arr = url.split("//");
      let last = '/' + arr[1].substring(arr[1].indexOf("/"));
      console.log(last)
      if(last != '/login' && last != '/mobile/loginMobile'){
        localStorage.setItem('last', last)
        localStorage.setItem("logout", "comfirm")
      }
      Router.replace({ path: '/login'});
    } else{
      localStorage.clear();
      localStorage.setItem("logout", "comfirm")
      Router.replace({ path: '/login'});
    }
    setTimeout(() => {
      console.log('!!!')
      this.$Notice.error({
        title: "请先登录",
        content: "您没有访问该页面的权限，或许是因为您的用户身份与该页面不一致，请重新登录，系统会自动跳转到相应页面。",
        duration: 5
      })
    }, 1500)
  }
  return Promise.reject(error);
})
