import Vue from 'vue';
import Router from 'vue-router';
import store from '../store/store';
// import {websiteGetId, getWebsiteTemplate} from '@/common/api/api.js';
import MessageBox from '@/components/common/messagebox/messagebox.js';
// import {Device} from '@/common/js/utils.js';
// created By HZC
// =============
const homePage = r => require.ensure([], () => r(require('@/pages/homePage/homePage.vue')), 'homePage');
const loginPage = r => require.ensure([], () => r(require('@/pages/formPages/loginPage/loginPage.vue')), 'loginPage');
const registerPage = r => require.ensure([], () => r(require('@/pages/formPages/registerPage/registerPage.vue')), 'registerPage');
const forgotPasswordPage = r => require.ensure([], () => r(require('@/pages/formPages/forgotPasswordPage/forgotPasswordPage.vue')), 'forgotPasswordPage');
const autoLogin = r => require.ensure([], () => r(require('@/pages/formPages/loginPage/autoLogin.vue')), 'autoLogin');
// =============
const supplyOrBuy = r => require.ensure([], () => r(require('@/pages/homePage/supplyOrBuy/index.vue')), 'supplyOrBuy');
const purchaseListPage = r => require.ensure([], () => r(require('@/pages/homePage/purchaseListPage/purchaseListPage.vue')), 'purchaseListPage');
const purchaseDetailPage = r => require.ensure([], () => r(require('@/pages/homePage/purchaseListPage/purchaseDetailPage/purchaseDetailPage.vue')), 'purchaseDetailPage');
const supplyListPage = r => require.ensure([], () => r(require('@/pages/homePage/supplyListPage/supplyListPage.vue')), 'supplyListPage');
const hotListpage = r => require.ensure([], () => r(require('@/pages/homePage/addHotListPage/hotListPage.vue')), 'hotListpage');
const supplyDetailPage = r => require.ensure([], () => r(require('@/pages/homePage/supplyListPage/supplyDetailpage/supplyDetailPage.vue')), 'supplyDetailPage');
// =============
// 订单管理
const order = r => require.ensure([], () => r(require('@/pages/order/index.vue')), 'order');
const cargo = r => require.ensure([], () => r(require('@/pages/order/children/CargoManager.vue')), 'order');
const cuttings = r => require.ensure([], () => r(require('@/pages/order/children/CuttingsManager.vue')), 'order');
const cutVersion = r => require.ensure([], () => r(require('@/pages/order/children/CutVersionManager.vue')), 'order');
// 个人中心
const personal = r => require.ensure([], () => r(require('@/pages/personalCenterPage/index')), 'personalCenterPage');
const account = r => require.ensure([], () => r(require('@/pages/personalCenterPage/children/personal-account.vue')), 'personalCenterPage');
const business = r => require.ensure([], () => r(require('@/pages/personalCenterPage/children/personal-business.vue')), 'personalCenterPage');
const buy = r => require.ensure([], () => r(require('@/pages/personalCenterPage/children/personal-buy.vue')), 'personalCenterPage');
const flower = r => require.ensure([], () => r(require('@/pages/personalCenterPage/children/personal-flower.vue')), 'personalCenterPage');
const list = r => require.ensure([], () => r(require('@/pages/personalCenterPage/children/personal-list.vue')), 'personalCenterPage');
const message = r => require.ensure([], () => r(require('@/pages/personalCenterPage/children/personal-message.vue')), 'personalCenterPage');
const mobile = r => require.ensure([], () => r(require('@/pages/personalCenterPage/children/personal-mobile.vue')), 'personalCenterPage');
const password = r => require.ensure([], () => r(require('@/pages/personalCenterPage/children/personal-password.vue')), 'personalCenterPage');
const supply = r => require.ensure([], () => r(require('@/pages/personalCenterPage/children/personal-supply.vue')), 'personalCenterPage');
const releaseBuy = r => require.ensure([], () => r(require('@/pages/personalCenterPage/children/releaseBuy.vue')), 'personalCenterPage');
const releaseSupply = r => require.ensure([], () => r(require('@/pages/personalCenterPage/children/releaseSupply.vue')), 'personalCenterPage');
// =============
const productAdd = r => require.ensure([], () => r(require('@/pages/homePage/addProductPage/addProduct.vue')), 'productAdd');
const flowerDetail = r => require.ensure([], () => r(require('@/pages/homePage/flowerDetailPage/flowerDetailPage.vue')), 'flowerDetail');
const flowerDetailContent = r => require.ensure([], () => r(require('@/pages/homePage/flowerDetailPage/index.vue')), 'flowerDetail');
const search = r => require.ensure([], () => r(require('@/pages/homePage/searchResultPage/index.vue')), 'search');
const textSearch = r => require.ensure([], () => r(require('@/pages/homePage/searchResultPage/children/textSearch.vue')), 'search');
const imgSearch = r => require.ensure([], () => r(require('@/pages/homePage/searchResultPage/children/imgSearch.vue')), 'search');
const equipmentSearch = r => require.ensure([], () => r(require('@/pages/homePage/searchResultPage/children/equipmentSearch.vue')), 'search');
// =============
// 3D
const clause = r => require.ensure([], () => r(require('@/pages/clause/')), 'clause');
const threeDDress = r => require.ensure([], () => r(require('@/pages/3DDress/')), 'threeDDress');
// 店铺访问
const shopVisiting = r => require.ensure([], () => r(require('@/pages/shopVisiting/')), 'shopVisiting');
const shopAllMeterials = r => require.ensure([], () => r(require('@/pages/shopVisiting/children/allmeterial')), 'shopVisiting');
const shopCompanyIntro = r => require.ensure([], () => r(require('@/pages/shopVisiting/children/companyintro')), 'shopVisiting');
const shopModels = r => require.ensure([], () => r(require('@/pages/shopVisiting/children/models')), 'shopVisiting');
const shopProductIndex = r => require.ensure([], () => r(require('@/pages/shopVisiting/children/productindex')), 'shopVisiting');
const shopSupplies = r => require.ensure([], () => r(require('@/pages/shopVisiting/children/supplies')), 'shopVisiting');
const shopExclusive = r => require.ensure([], () => r(require('@/pages/shopVisiting/children/exclusive')), 'shopExclusive');
const shopCatagoryProduct = r => require.ensure([], () => r(require('@/pages/shopVisiting/children/catagoryProduct')), 'shopVisiting');
// =============
// 发现模块
const find = r => require.ensure([], () => r(require('@/pages/find/')), 'find');
const findIndex = r => require.ensure([], () => r(require('@/pages/find/children/find')), 'find');
const findEveryLooking = r => require.ensure([], () => r(require('@/pages/find/children/everyLooking')), 'find');
const findFactoryUpdate = r => require.ensure([], () => r(require('@/pages/find/children/factoryUpdate')), 'find');
const findTopSearch = r => require.ensure([], () => r(require('@/pages/find/children/topSearch')), 'find');
const findUpdateResult = r => require.ensure([], () => r(require('@/pages/find/children/updateResult')), 'find');
const findLookingResult = r => require.ensure([], () => r(require('@/pages/find/children/lookingResult')), 'find');
// =========
// 店铺管理
const shopManager = r => require.ensure([], () => r(require('@/pages/shopManager/')), 'shopManager');
const shopMirco = r => require.ensure([], () => r(require('@/pages/shopManager/children/mircoSite')), 'shopMirco');
const shopManagerMaterial = r => require.ensure([], () => r(require('@/pages/shopManager/children/material')), 'shopManagerMaterial');
const materialAdd = r => require.ensure([], () => r(require('@/pages/shopManager/children/material/add')), 'materialAdd');
const shopManagerWareHouse = r => require.ensure([], () => r(require('@/pages/shopManager/children/warehouses')), 'shopManagerWareHouse');
const wareHouseAdd = r => require.ensure([], () => r(require('@/pages/shopManager/children/warehouse/add')), 'wareHouseAdd');
const shopManagerSupply = r => require.ensure([], () => r(require('@/pages/shopManager/children/supply')), 'shopManagerSupply');
const supplyAdd = r => require.ensure([], () => r(require('@/pages/shopManager/children/supply/add')), 'supplyAdd');
const shopManagerEnquiry = r => require.ensure([], () => r(require('@/pages/shopManager/children/enquiry')), 'shopManagerEnquiry');
const shopManagerSearch = r => require.ensure([], () => r(require('@/pages/shopManager/children/search')), 'shopManagerSearch');
const shopManagerEquipment = r => require.ensure([], () => r(require('@/pages/shopManager/children/equipment')), 'shopManagerEquipment');
const shopManagerSetting = r => require.ensure([], () => r(require('@/pages/shopManager/children/setting')), 'shopManagerSetting');
const shopManagerCooperation = r => require.ensure([], () => r(require('@/pages/shopManager/children/cooperation')), 'shopManager');
const shopManagerClassification = r => require.ensure([], () => r(require('@/pages/shopManager/children/classification')), 'shopManager');
const shopManagerAptitude = r => require.ensure([], () => r(require('@/pages/shopManager/children/aptitude')), 'shopManager');
const releasePurchasePage = r => require.ensure([], () => r(require('@/pages/homePage/releasePurchasePage/releasePurchasePage')), 'shopManager');
const releaseSupplyPage = r => require.ensure([], () => r(require('@/pages/homePage/releaseSupplyPage/releaseSupplyPage')), 'shopManager');
const entryListPage = r => require.ensure([], () => r(require('@/pages/homePage/entryListPage/entryListPage')), 'shopManager');
// ========
// totalPage
const promptDown = r => require.ensure([], () => r(require('@/pages/totalPages/promptDown')), 'totalPages');
const aboutUs = r => require.ensure([], () => r(require('@/pages/totalPages/aboutUs')), 'totalPages');
const activity0724 = r => require.ensure([], () => r(require('@/pages/totalPages/activity/0724')), 'totalPages');
const aboutLace = r => require.ensure([], () => r(require('@/pages/totalPages/aboutLace.vue')), 'aboutLace');
const productExplain = r => require.ensure([], () => r(require('@/pages/homePage/productExplainPage/productExplainPage.vue')), 'productExplain');
// ========
// 订单详情
const orderDeatil = r => require.ensure([], () => r(require('@/pages/orderDetail/index.vue')), 'orderDetail');
const orderDeatilBulk = r => require.ensure([], () => r(require('@/pages/orderDetail/children/bulkDetail.vue')), 'orderDeatilBulk');
// ========
// demo
const demo = r => require.ensure([], () => r(require('@/pages/demo/index.vue')), 'demo');
const routes = [{
    path: '/',
    redirect: '/homePage'
  }, {
    path: '/clause',
    component: clause,
    name: '条款'
  }, {
    path: '/demo',
    component: demo
  }, {
    path: '/productExplain',
    component: productExplain,
    name: '产品说明'
  }, {
    path: '/product',
    component: productAdd,
    children: [{
      path: 'add',
      meta: {
        needAuth: true
      },
      component: wareHouseAdd
    }]
  }, {
    path: '/homePage',
    component: homePage,
    name: '首页'
    // beforeEnter: async(to, from, next) => {
    // const host = window.location.host;
    // if (host.indexOf('.lacewang.cn') >= 0) {
    //   try {
    //     // 1.先获取
    //     var { data } = await websiteGetId({
    //       indexName: host.split('.')[0]
    //     });
    //     if (Device.isPc) {
    //     next(`/shop/${data.data}`);
    //     } else {
    //       try {
    //         let { data } = await getWebsiteTemplate({companyId: data.data});
    //         next(`/static/websiteHTML/template_${data.data}.html`);
    //       } catch (e) {
    //         console.error('获取微官网模板失败');
    //       }
    //     }
    //   } catch (e) {
    //     console.error('根据ID获取indexName失败');
    //   }
    // } else {
    //   next();
    // }
    // }
  },
  // 搜索
  {
    path: '/search',
    component: search,
    children: [{
      // 文本搜索
      path: 'text',
      component: textSearch
    }, {
      // 设备搜索
      path: 'equipment',
      component: equipmentSearch,
      meta: {
        companyAuth: true
      }
    }, {
      // 图片搜索
      path: 'image',
      component: imgSearch
    }]
  }, {
    path: '/order',
    component: order,
    redirect: 'order/cargo',
    children: [{
      path: 'cargo',
      component: cargo,
      name: '大货订单'
    }, {
      path: 'cutVersion',
      component: cutVersion,
      name: '剪版订单'
    }, {
      path: 'cuttings',
      component: cuttings,
      name: '剪样订单'
    }]
  }, {
    path: '/find',
    redirect: '/find/index',
    component: find,
    children: [{
      path: 'index',
      component: findIndex,
      name: '发现'
    }, {
      path: '/catagory/:id', // 查找结果
      meta: {
        needAuth: true
      },
      component: findLookingResult,
      name: 'findLookingResult'
    }, {
      path: 'everyLooking',
      component: findEveryLooking,
      meta: {
        needAuth: true
      },
      name: '大家在找'
    }, {
      path: 'factoryupdate',
      component: findFactoryUpdate,
      meta: {
        needAuth: true
      },
      name: '厂家上新'
    }, {
      path: 'rank/:id',
      component: findUpdateResult,
      meta: {
        needAuth: true
      },
      name: 'updateResult'
    }, {
      path: 'topSearch',
      component: findTopSearch,
      meta: {
        needAuth: true
      },
      name: '爆款热搜'
    }]
  }, {
    path: '/orderDetail',
    component: orderDeatil,
    meta: {
      needAuth: true
    },
    name: 'orderDeatil',
    children: [{
      path: 'bulk/:id', // 大货订单详情
      meta: {
        needAuth: true
      },
      component: orderDeatilBulk
    }]
  },
  // 个人中心
  {
    path: '/personal',
    redirect: '/personal/index',
    component: personal,
    meta: {
      needAuth: true
    },
    children: [{
      path: 'index',
      component: account,
      name: '个人信息'
    }, {
      path: 'business',
      component: business,
      name: '商家收藏'
    }, {
      path: 'buy',
      component: buy,
      name: '我的求购'
    }, {
      path: 'flower',
      component: flower,
      name: '花型收藏'
    }, {
      path: 'list',
      component: list,
      name: '我的接单'
    }, {
      path: 'message',
      component: message,
      name: '短信设置'
    }, {
      path: 'mobile',
      component: mobile
    }, {
      path: 'password',
      component: password,
      name: '密码修改'
    }, {
      path: 'supply',
      component: supply,
      name: '供应收藏'
    }, {
      path: 'releaseBuy',
      component: releaseBuy,
      name: '个人中心发布求购'
    }, {
      path: 'releaseSupply',
      component: releaseSupply,
      name: '个人中心发布供应'
    }]
  }, {
    path: '/threeDDressPage',
    component: threeDDress,
    meta: {
      needAuth: true,
      companyAuth: true
    },
    name: '3D试衣'
  },
  // 首页--3D试衣
  {
    path: '/supplyOrBuy',
    component: supplyOrBuy,
    meta: {
      needAuth: true
    },
    name: '供应求购'
  }, {
    path: '/releasePurchasePage', // 发布求购
    component: releasePurchasePage,
    meta: {
      needAuth: true
    }
  }, {
    path: '/purchaseListPage', // 求购列表
    meta: {
      needAuth: true
    },
    component: purchaseListPage
  }, {
    path: '/purchaseDetailPage', // 求购详情
    component: purchaseDetailPage,
    meta: {
      needAuth: true
    }
  }, {
    path: '/product/:id', // 花型详情
    component: flowerDetail,
    name: 'flowerDetail',
    redirect: '/product/:id/detail',
    children: [{
        path: 'detail',
        component: flowerDetailContent,
        name: '花型内容'
      },
      {
        path: 'index',
        component: shopProductIndex,
        name: '店铺首页'
      }, {
        path: 'allProducts',
        component: shopAllMeterials,
        name: '所有花型'
      }, {
        path: 'searchtext',
        component: textSearch,
        name: '文本搜索'
      }, {
        path: 'exclusive',
        component: shopExclusive,
        name: '独家花型'
      }, {
        path: 'searchimage',
        component: imgSearch,
        name: '搜图'
      }, {
        path: 'supplies',
        component: shopSupplies,
        name: '店铺-厂家供应'
      }, {
        path: 'models',
        component: shopModels,
        name: '模特试衣'
      }, {
        path: 'intro',
        component: shopCompanyIntro,
        name: '公司介绍'
      }, {
        path: 'catagory',
        component: shopCatagoryProduct,
        name: '产品'
      }
    ]
  }, {
    path: '/releaseSupplyPage', // 发布供应
    component: releaseSupplyPage,
    meta: {
      needAuth: true
    }
  }, {
    path: '/supplyListPage', // 供应列表
    component: supplyListPage,
    meta: {
      needAuth: true
    }
  }, {
    path: '/supplyDetailPage', // 供应详情
    component: supplyDetailPage
  }, {
    path: '/hotListpage', // 新增热搜
    component: hotListpage,
    meta: {
      needAuth: true,
      companyAuth: true
    }
  }, {
    path: '/entryListPage', // 厂家列表
    meta: {
      needAuth: true
    },
    component: entryListPage
  }, {
    path: '/loginPage',
    component: loginPage
  }, {
    path: '/autologin',
    component: autoLogin
  }, {
    path: '/registerPage',
    component: registerPage
  }, {
    path: '/forgotPasswordPage',
    component: forgotPasswordPage
  }, {
    path: '/promptDown',
    component: promptDown
  }, {
    path: '/aboutLace',
    component: aboutLace
  }, {
    path: '/aboutUs',
    component: aboutUs
  }, {
    path: '/shop/:id',
    name: 'shop',
    redirect: '/shop/:id/index',
    component: shopVisiting,
    children: [{
      path: 'index',
      component: shopProductIndex
    }, {
      path: 'allProducts',
      component: shopAllMeterials
    }, {
      path: 'searchtext',
      component: textSearch
    }, {
      path: 'exclusive',
      component: shopExclusive
    }, {
      path: 'equipmentSearch',
      component: equipmentSearch
    }, {
      path: 'searchimage',
      component: imgSearch
    }, {
      path: 'supplies',
      component: shopSupplies
    }, {
      path: 'models',
      component: shopModels
    }, {
      path: 'intro',
      component: shopCompanyIntro
    }, {
      path: 'catagory',
      component: shopCatagoryProduct
    }]
  }, {
    path: '/warehouseManage',
    redirect: '/warehouseManage/warehouse',
    component: shopManager,
    meta: {
      needAuth: true
    },
    children: [
      // 仓库管理
      {
        path: 'warehouse',
        meta: {
          needAuth: true
        },
        component: shopManagerWareHouse,
        name: '仓库花型管理'
      },
      // 仓库管理 => 新增花型
      {
        path: 'addwarehouse',
        meta: {
          needAuth: true
        },
        component: wareHouseAdd,
        name: '新增花型'
      },
      // 中转仓管理
      {
        path: 'material',
        component: shopManagerMaterial,
        name: '中转仓管理',
        meta: {
          needAuth: true
        }
      },
      // 中转仓 => 素材管理
      {
        path: 'folder:id',
        meta: {
          needAuth: true
        },
        component: materialAdd,
        name: 'material'
      },
      // 厂家供应
      {
        path: 'supply',
        meta: {
          needAuth: true
        },
        component: shopManagerSupply,
        name: '厂家供应'
      },
      // 厂家供应 => 发布供应
      {
        path: 'supplyAdd',
        meta: {
          needAuth: true
        },
        component: supplyAdd,
        name: '发布供应'
      },
      // 分类管理
      {
        path: 'classification',
        meta: {
          needAuth: true
        },
        component: shopManagerClassification,
        name: '花型分类管理'
      }
    ]
  }, {
    path: '/shopManagePage',
    redirect: '/shopManagePage/enquiry',
    component: shopManager,
    meta: {
      needAuth: true
    },
    children: [
      // 微官网
      {
        path: 'mircoSetting',
        component: shopMirco,
        meta: {
          needAuth: true
        },
        name: '微官网设置'
      },
      // 询价列表
      {
        path: 'enquiry',
        meta: {
          needAuth: true
        },
        component: shopManagerEnquiry,
        name: '买家采购列表'
      },
      // 公司设备
      {
        path: 'equipment',
        meta: {
          needAuth: true
        },
        component: shopManagerEquipment,
        name: '公司设备'
      },

      // 店铺设置
      {
        path: 'setting',
        meta: {
          needAuth: true
        },
        component: shopManagerSetting,
        name: '店铺设置'
      },
      // 合作厂家
      {
        path: 'cooperation',
        meta: {
          needAuth: true
        },
        component: shopManagerCooperation,
        name: '合作厂家'
      },
      // 企业资质
      {
        path: 'aptitude',
        meta: {
          needAuth: true
        },
        component: shopManagerAptitude,
        name: '企业资质'
      },
      {
        path: 'search',
        meta: {
          needAuth: true
        },
        component: shopManagerSearch,
        name: '买家查看记录'
      }
    ]
  },
  // 活动页面
  {
    path: '/activity0724',
    component: activity0724,
    name: '致歉信'
  }
];

const router = new Router({
  mode: 'history', // 后端未配置
  // 每进去一个新页面翻到顶部
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
  linkActiveClass: 'active',
  routes
});

function msg(next) {
  MessageBox({
    title: '你无此权限',
    message: '成为会员，请联系热线电话：4008013357',
    confirmButtonText: '知道了'
  }).then(() => {
    // next('/');
  });
};

function getUser(to, next) {
  // 2.有token => 下一步
  if (!store.state.user.userInfo.id) {
    store.dispatch('getUserInfo');
  }
  if (!store.state.user.isMemeber) {
    store.dispatch('memberChecklimit').then(isMemeber => {
      if (!isMemeber && to.matched.some(record => record.meta.companyAuth)) {
        msg(next);
        return;
      }
      next();
    });
  } else {
    next();
  }
};
// 路由钩子，判断进入的页面是否需要登录 (needAuth)
router.beforeEach(async(to, from, next) => {
  // 1.该路由 => 需要登录权限
  if (to.matched.some(record => record.meta.needAuth)) {
    if (store.state.token.token && location.pathname !== '/autologin') {
      getUser(to, next);
    } else {
      // 没token => 跳回去登录页面 将跳转的路由path作为参数，登录成功后跳转到该路由
      next({
        path: '/loginPage',
        query: {
          redirect: to.fullPath
        }
      });
    }
  } else {
    if (store.state.token.token) {
      if (to.path === '/loginPage') {
        next('/');
        return;
      }
      getUser(to, next);
    } else {
      next();
    }
  }
});
Vue.use(Router);
export default router;
