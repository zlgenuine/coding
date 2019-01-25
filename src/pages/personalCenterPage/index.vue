<template>
	<div class="personal">
		<v-header>
			<search></search>
		</v-header>
		<v-nav/>
		<!--personal-conent-->
		<div class="personal-container  clearfix">
			<div class="personal-nav">
				<h1>个人中心</h1>
				<!--<ul>-->
					<!--<li v-for="(navItem,index) in navItems" :class="{ 'personal-nav-b':navItem.isBorder }" v-if="!navItem.isShow">-->
						<!--<router-link :to="navItem.path">-->
							<!--<span>-->
							<!--{{ navItem.context }}-->
							<!--</span>-->
						<!--</router-link>-->
					<!--</li>-->
				<!--</ul>-->
        <div class="navList">
          <tree :navItems="navItems" :select="select"></tree>
        </div>

			</div>
			<div class="personal-item">
				<!--<div class="title clearfix">
					<h2>{{ title }}</h2>
					<router-link class="fr" to="releaseBuy" v-if="userInfo.userType === 2">发布求购</router-link>
					<router-link class="fr" to="releaseSupply" v-if="userInfo.userType === 1">发布供应</router-link>
				</div>-->
				<div class="personal-item-box">
					<router-view></router-view>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
	import {
		header,
		nav,
		search
	} from '@/components';
	import {
		mapGetters
	} from 'vuex';
	import Vue from 'vue';
	// 递归组件
	Vue.component('tree', {
      name: 'tree',
      template: `<ul>
                    <template v-for="(navItem,index) in navItems" >
                       <li  :class="{'active': $route.path.indexOf(navItem.path) > 0}" class="navItem" v-if="!navItem.isShow"
                          :style="{border: navItem.parentId ? 'none' : '' ,'padding-left': ((navItem.id.split('-').length) - 1) * 18 + 12 + 'px'}" @click = "select(navItem)">
                          <span class="navText" >{{navItem.context }}</span>
                          <span class="arrow" v-show="navItem.children && !navItem.showChildren" ><img src="/static/images/arrow_down.png"></span>
                          <span class="arrow" v-show="navItem.children && navItem.showChildren"><img src="/static/images/arrow_up.png"></span>
                       </li>
                       <tree v-show="navItem.children && navItem.showChildren" v-if = "navItem.children" :navItems = "navItem.children" :select="select"></tree>
                    </template>
                 </ul>`,
      props:['navItems', 'select'],
  });

	export default {
		data() {
			return {
				title: '账户信息',
        showChildren: false,
				navItems: [
				  {
						context: '账户信息',
						path: 'index',
            id: '1'
					},
					{
						context: '变更手机号',
						path: 'mobile',
            id: '2'
					},
          // {
          //   context: '主营认证',
          //   path: 'auth',
          //   isShow: false,
          //   id: '3',
          // },
          {
            context: '推荐厂家',
            path: 'applyBest',
            isShow: false,
            id: '4',
          },
          {
						context: '广告投放',
						path: 'Adv',
            id: '5',
            showChildren: false,
            children: [
              {
                context: '首页banner',
                path: 'bannerAdv',
                id: '5-1',
                parentId: '3',
              },
              {
                context: '搜索加载页',
                path: 'loadingAdv',
                id: '5-2',
                parentId: '3'
              }
            ]
					},
					{
						context: '修改密码',
						path: 'password',
            id: '6',
					},
					{
						context: '短信设置',
						path: 'message',
            id: '7',
					},
					{
						context: '我的求购',
						path: 'buy',
						isShow: false,
						isBorder: 'ok',
            id: '8',
					},
					{
						context: '我的接单',
						path: 'list',
						isShow: false,
						isBorder: 'ok',
            id: '9',
					},
					{
						context: '花型收藏',
						path: 'flower',
						isBorder: 'ok',
            id: '10',
					},
					{
						context: '商家收藏',
						path: 'business',
            id: '11',
					},
					{
						context: '供应收藏',
						path: 'supply',
						isShow: false,
            id: '12',
					}
				]
			};
		},
		components: {
			'vHeader': header,
			'vNav': nav,
			search
		},
		computed: {
			...mapGetters(['userInfo'])
		},
    methods: {
      select (data) {
        data.children && (data.showChildren = !data.showChildren); // 显示子选项
        if (data.path === 'Adv'){
          this.$router.push(data.children[0].path); //二级导航跳转，默认跳转第一个
        } else {
          this.$router.push(data.path); //导航跳转
        }
      }
    },
		mounted () {
		  // userType = 1 时为厂家，userType = 2 时为贸易商；厂家有主营验证、推荐厂家、我的接单；贸易商有我的求购、供应收藏
      this.$nextTick( () => {
        this.navItems.map(item => {
          if (this.userInfo.userType === 1) {
            if (item.path === 'buy'  || item.path === 'supply') {
              item.isShow = true;
            }
          } else {
            if (item.path === 'auth' || item.path === 'applyBest' || item.path === 'list') {
              item.isShow = true;
            }
          }
        });
      });
		}
	};
</script>
<style lang="css">
	@import '../../common/css/personal.css';
</style>
<style lang="scss" scoped="scoped">
	.personal {}
	.personal-container {
		width: 1200px;
		margin: 50px auto;
	}
	.personal-nav {
		float: left;
		width: 256px;
		min-height: 728px;
		background: #f8f8f8;
		text-align: center;
		h1 {
			margin: 50px 0;
			font-size: 24px;
			font-weight: 400;
			color: #333;
			&::after {
				content: '';
				display: block;
				margin: 15px auto 30px;
				width: 85%;
				height: 1px;
				background: #eaeaea;
			}
		}
		li {
			margin-bottom: 20px;
			font-size: 16px;
			color: #333;
			cursor: pointer;
			text-align: left;
			.active {
				span {
					position: relative;
					color: #5296fd;
					&::after {
						content: '';
						display: block;
						position: absolute;
						left: -16px;
						top: -2px;
						width: 4px;
						height: 20px;
						background: #5296fd;
					}
				}
			}
			span {
				margin-left: 86px;
				&.active {
					/*position: relative;
                color: #5296fd;
                &::after {
                    content: '';
                    display: block;
                    position: absolute;
                    left: -16px;
                    top: -2px;
                    width: 4px;
                    height: 20px;
                    background: #5296fd;
                }*/
				}
				&:hover {
					color: #5296fd;
				}
			}
		}
		.personal-nav-b {
			/*&::after {
            content: '';
            display: block;
            margin: 28px auto;
            height: 1px;
            width: 112px;
            background: #eaeaea;
        }*/
			&::before {
				content: '';
				display: block;
				margin: 28px auto;
				height: 1px;
				width: 112px;
				background: #eaeaea;
			}
		}
	}

	.personal-item {
		float: left;
		width: 944px;
		min-height: 728px;
		background: #fff;
		/*.title {
			margin-bottom: 30px;
			border-bottom: 1px solid #eaeaea;
			h2 {
				display: inline-block;
				padding: 0 15px;
				margin-top: 50px;
				margin-bottom: 15px;
				width: 200px;
				font-size: 24px;
				font-zaweight: 400;
				color: #333;
			}
			a {
				margin: 50px 50px 0 0;
				padding: 5px 16px;
				color: #fff;
				border: 1px solid #4C93FD;
				background: rgba(76, 147, 253, .9);
				&:hover {
					background: rgba(76, 147, 253, 1);
				}
			}
		}*/
	}
</style>
<style lang="scss">
  .personal-nav{
    .navList{
     margin-left: 78px;
      .navItem{
        margin: 8px 0;
        font-size: 15px;
        cursor: pointer;
        position: relative;
        &.active{
          border-left: 3px solid #20a0ff;
          color: #20a0ff;
        }
        .navText{
          display: inline-block;
          width: 100%;
          margin: 0 auto;
          text-align: left;
        }
        .arrow{
          position: absolute;
          top: -2px;
          left: 76px;
          img{
            width: 20px;
          }
        }
      }
    }
  }
</style>
