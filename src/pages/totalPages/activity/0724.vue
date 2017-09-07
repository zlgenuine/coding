<template>
	<div class="wrap">
		<v-header>
			<search></search>
		</v-header>
		<v-nav></v-nav>
		<div class="content-wrap">
			<div class="nav">
				<router-link to="homePage">首页</router-link> > 致歉信
			</div>
			<h4>致歉了，我们不再免费了！</h4>
			<p>致歉了，我们不再免费了！也许您们不认可这是蕾丝行业的福音，但是，我们承诺，您们会享受到会员的尊贵体验。</p>
			<p>为了营造用户更极致的体验环境，推动蕾丝行业稳健发展，四年来，坐视布管不断攻克搜花难题，在纹理识别技术、3D试衣技术等领域做出了不可磨灭的贡献，更为广大用户优化了供求信息匹配度、在线担保交易服务、企业信息查询、设备信息查找、行业动态走向、产业链配套服务等实用功能。</p>
			<p>我们凭什么收费，因为我们能给您别人给不了的！每天有数万的用户活跃在统搜57平台，这里汇集了全球2800多家蕾丝厂商，6000多家专业贸易商，140多万张花型数据。未来，这个数据还将一涨再涨！我们不仅有强大的数据库基础、稳定的搜花群体、精准的搜花结果，还有雄厚的技术支持、安全的交易机制、便捷的仓库管理以及物齐工艺、蕾丝产业、物齐快递等齐全的配套服务。除此之外，作为长乐重点跟进上市的企业，我们还是一个极具潜力的互联网公司！</p>
			<br />
			<p>会员形式：<span style="text-decoration: underline;">普通会员年费：首年普通会员3000/年，次年仅收取平台维护费用888/年。</span></p>
			<p style="text-indent: 7em;"><span style="text-decoration: underline;">黄金会员年费：首年普通会员6000/年，次年仅收取平台维护费用888/年。</span></p>
			<br />
			<p>除此之外，这个八月，还有更加优惠的会员开通方式嗨翻这个夏天！凡是转发我们的活动推文到微信朋友圈集赞，就有机会获得会员获得会员费减免资格以及上海国际面辅料展招商折扣券。</p>
			<br />
			<p>活动规则：</p>
			<p style="text-indent: 2em;"><span style="text-decoration: underline;">1. 转发微信朋友圈集赞超过30个，截图给统搜57搜花客服（微信号：Ts57-lin）。原价3000的会员仅需2500；超过50个赞，原价3000的会员仅需2000。</span></p>
			<p style="text-indent: 2em;"><span style="text-decoration: underline;">2. 成为会员后立即报名参加上海国际面辅料展招商活动，立即获得2000-3000折扣券。更多优惠活动详情，关注公众号统搜57，欢迎来电咨询。(以上活动解释权归坐视布管所有）</span></p>
			<br />
			<p>成为我们的会员，您即可领取我们为您献上的9大会员特权：</p>
			<p><span class="blod">1.传图搜花：</span>无限次数！通过搜索数据库，检索所需的花型，满足客户寻找花型需求。</p>
			<p><span class="blod">2.新增热搜：</span>获取实时上传花型数据和常搜的花型数据，了解各个花型的爆款程度，不再盲目开发新花型。</p>
			<p><span class="blod">3.供应求购：</span>工厂通过发布供应，让贸易商看到供应的花型，从而促进交易达成。反之，贸易商发布求购，工厂可以看到求购的花型后联系贸易商。</p>
			<p><span class="blod">4.大家在找：</span>可以直观地查看到用户搜花的历史记录，帮助用户精准定位蕾丝市场发展趋势，分析花型爆款周期，制定合理的营销策略。</p>
			<p><span class="blod">5.入驻信息：</span>包括优质厂家、入驻厂家、入驻贸易商三个子版块排名，提升商家品牌、宣传力度，以及登入官网查看更多花型。</p>
			<p><span class="blod">6.库内搜花：</span>用户使用仓库管理，上传花型建立用户私密数据库，方便用户进行花型库内检索、分类等管理，它就是您的移动小型仓库。</p>
			<p><span class="blod">7.我的网店：</span>用户将仓库内花型上传网店，并进行分类管理后，花型将被商户检索，同时，也可以通过分享我的网店，向客户展示热销花型蕾丝。</p>
			<p><span class="blod">8.3D试衣：</span>提供在线模特试衣体验，三个角度全方位定制专属蕾丝服装。</p>
			<p><span class="blod">9.开通企业专属微官网：</span>升级我的网店，让我的网店功能更齐全，展示效果更加“高大上”。帮助企业获取更多业务订单。【黄金会员专属】</p>
		</div>
	</div>
</template>

<script>
	import { header, nav, search } from '@/components';
	export default {
		components: {
			'vHeader': header,
			'vNav': nav,
			search
		}
	};
</script>

<style lang="scss" scoped>
.wrap {
	min-height: 1100px;
	background: #fff;
	.content-wrap {
		margin: 0 auto;
		width: 1200px;
		.nav {
			margin: 20px 0;
			color: #999999;
			font-size: 15px;
			a {
				color: #999999;
				font-size: 15px;
				&:hover {
					color: #4C93FD;
				}
			}
		}
		h4 {
			margin-bottom: 30px;
			text-align: center;
			color: #333333;
			font-size: 18px;
		}
		p {
			text-indent: 2em;
			font-size: 16px;
			color: #666666;
			line-height: 26px;
		}
		img {
			width: 100%;
			padding: 20px 0;
		}
		.blod {
			color: #000000;
			font-weight: 600;
		}
	}
}
</style>
