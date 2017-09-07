<template lang="html">
	<div class="supply-list-page-box">
		<div style="background:#fff">
			<ts-filter title="供应分类">
				<ts-radio-group v-model="Filter.sort" @change="hanleFilterSort">
					<ts-radio label="null">全部</ts-radio>
					<ts-radio label="100010">面料</ts-radio>
					<ts-radio label="100011">大边</ts-radio>
					<ts-radio label="100012">小边</ts-radio>
					<ts-radio label="100013">睫毛</ts-radio>
				</ts-radio-group>
			</ts-filter>
			<ts-filter title="供应布样">
				<ts-radio-group v-model="Filter.fabricType" @change="hanleFilterFabric">
					<ts-radio label="null">全部</ts-radio>
					<ts-radio label="200011">成品</ts-radio>
					<ts-radio label="200010">胚布</ts-radio>
				</ts-radio-group>
			</ts-filter>
		</div>
		<!-- 列表 -->
		<div class="supply-list-item-wrapper clearfix">
			<div class="item-wrapper" v-for="(obj, index) in items">
				<supply-item :item="obj" @clickMethod="goDetail(index)"></supply-item>
			</div>
		</div>
		<pagination :page="pageData" @selectedPageNum="selectedPageNum1"></pagination>
	</div>
</template>

<script>
	import {
		pagination
	} from '@/components/';
	import supplyItem from '../supplyItem.vue';
	import {
		mapGetters
	} from 'vuex';
	import {
		listCompanySupplys
	} from '@/common/api/api';
	export default {
		data() {
			return {
				Filter: {
					sort: 'null',
					fabricType: 'null'
				},
				param: {
					supplyShapes: null,
					supplyStatus: 1,
					supplyTypes: null,
					pageNo: 1,
					pageSize: 25
				},
				pageData: {
					pageNumArr: [],
					maxNum: 1,
					pageNO: 1
				},
				items: []
			};
		},
		components: {
			pagination,
			supplyItem
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		created() {
			if (this.$route.query.pageData) {
				this.param = this.$route.query.pageData;
			}
			this.listCompanySupplysMethod();
			this.Filter.sort = this.param.supplyTypes + '' || 'null';
			this.Filter.fabricType = this.param.supplyShapes + '' || 'null';
		},
		methods: {
			listCompanySupplysMethod() {
				listCompanySupplys(this.param).then((res) => {
					if (res.data.code === 0) {
						this.items = res.data.data.list;
						this.pageData.maxNum = res.data.data.totalPage;
						this.pageData.pageNO = res.data.data.pageNO;
					}
				}).catch();
			},
			hanleFilterSort(e) {
				if (e === 'null') {
					this.param.supplyTypes = null;
				} else {
					this.param.supplyTypes = parseInt(e);
				}
				this.param.pageNo = 1;
				this.listCompanySupplysMethod();
			},
			hanleFilterFabric(e) {
				if (e === 'null') {
					this.param.supplyShapes = null;
				} else {
					this.param.supplyShapes = parseInt(e);
				}
				this.param.pageNo = 1;
				this.listCompanySupplysMethod();
			},
			selectedPageNum1(e) {
				this.param.pageNo = e;
				this.listCompanySupplysMethod();
			},
			// 跳转详情页
			goDetail(e) {
				if (this.userInfo.userType === 1) {
					this.$messagebox.alert('为了保密，该供应信息仅对贸易商公开');
					return;
				}
				this.$router.push({
					path: '/supplyDetailPage',
					query: {
						supplyId: this.items[e].id,
						pageData: this.param
					}
				});
			}
		}
	};
</script>
<style lang="stylus" scoped>
    .supply-list-page-box
      width 1200px
      margin 0 auto
      padding 16px 0
      .filter-container
        .filter-list
          display flex
          width 100%
          height 40px
          line-height 40px
          font-size 16px
          border-top 1px solid #d8d8d8
          &:last-child
            border-bottom 1px solid #d8d8d8
          .filter-title
            flex 0 0 200px
            box-sizing border-box
            width 200px
            height 40px
            text-align center
            background #e5e5e5
            color #666
            border-left 1px solid #d8d8d8
          .filter-detail
            flex 1
            box-sizing border-box
            height 40px
            background #fff
            border-right 1px solid #d8d8d8
            .item
              display inline-block
              height 40px
              line-height 40px
              width 80px
              text-align center
              cursor pointer
              &:hover
                color #4c93fd
              &.active
                color #4c93fd
      .supply-list-item-wrapper
        margin-top 10px
        .item-wrapper
          float left
          margin-left 10px
          margin-top 10px
          &:nth-of-type(5n + 1)
            margin-left 0
</style>
