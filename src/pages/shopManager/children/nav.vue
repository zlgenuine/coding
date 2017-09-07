<template lang="html">
	<div class="shopManager-nav">
		<p class="shopManager-nav-title">
			{{title}}
			<i class="icon-dangkou store" @click="gotoStore"></i>
		</p>
		<ul>
			<router-link :to="item.path" tag="li" exact active-class="active" v-for="item in navItem" class="shopManager-nav-menu" :key="item.path" v-if="item.show">{{item.name}}</router-link>
		</ul>
	</div>
</template>

<script>
import nav from '../nav';
import {
  mapGetters
} from 'vuex';
export default {
  data() {
    return {
      navItem: [],
      title: ''
    };
  },
  watch: {
    $route(val) {
      this.loadNav();
    }
  },
  created() {
    this.loadNav();
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    loadNav() {
			this.navItem = this.$route.path.indexOf('warehouseManage') >= 0 ? nav.warehouse : nav.shop;
      this.title = this.$route.path.indexOf('warehouseManage') >= 0 ? '仓库管理' : '网店管理';
      // 根据userInfo判断
      // 如果用户类型为2（档口）=> 厂家供应隐藏
      this.navItem.forEach(item => {
        item.show = true;
        if (this.userInfo.userType === 2 && item.path === 'supply') {
          item.show = false;
        }
        if (!this.userInfo.hasWebsite && item.path === 'mircoSetting') {
          item.show = false;
        }
      });
    },
    gotoStore() {
      this.goto(`/shop/${this.userInfo.companyId}`);
    }
  }
};
</script>

<style lang="css" scoped>
	@import '../../../common/css/_var.css';
	@component-namespace shopManager {
		@component nav {
			/*店铺标题*/
			@descendent title {
				position: relative;
				font-size: 24px;
				margin: 50px 0 24px 0;
				text-align: center;
			}
			/*导航条*/
			@descendent menu {
				line-height: 40px;
				transition: 0.3s;
				cursor: pointer;
				padding-left: 60px;
				&:hover {
					color: var(--navHoverColor) var(--navHoverBg)
				}
			}
		}
	}

	.active {
		color: var(--navHoverColor) var(--navHoverBg)
	}

</style>
<style lang="scss" scoped>
.store{
	font-size: 21px;
	cursor: pointer;
	transition:all .3s;
	display: inline-block;
	&:hover{
		transform: scale(1.2);
	}
	&:hover:before{
		color:#4C93FD;
	}
}

</style>
