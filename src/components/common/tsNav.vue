<template>
	<div class="ts-nav">
        <router-link to="/homePage" v-show="showIndex">首页 > </router-link> 
        <span v-if="data.type !== 2">
        	<router-link :to="{path: data.path, query: data.query}" v-if="data.query">{{data.parentName}}</router-link>
        	<router-link :to="{path: data.path}" v-else>{{data.parentName}}</router-link>
        </span>
        <span class="link" @click="goto" v-else>{{data.parentName}}</span> >
        <span>{{data.childName}}</span>
    </div>
</template>

<script>
	export default {
		props: {
			data: {
				type: Object
			},
            showIndex: {
                type: Boolean,
                default: true
            }
		},
		methods: {
			goto() {
				this.$emit('goto');
			}
		}
	};
</script>

<style lang="scss" scoped>
.ts-nav {
    padding: 30px 0;
    a,
    span {
        font-size: 16px;
        color: #999;
    }
    a:hover,
    .link:hover {
        color: #4C93FD;
    }
    .link {
    	cursor: pointer;
    }
    
}
</style>
