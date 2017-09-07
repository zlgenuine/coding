<template lang="html">
  <div class="shop">
    <v-header>
    	<search :globalLook="search.isGlobal"></search>
    </v-header>
    <v-nav></v-nav>
    <section class="shopManager-container">
        <div class="shopManager-container-left">
          <shop-manager-nav></shop-manager-nav>
        </div>
        <div class="shopManager-container-right">
          <router-view></router-view>
        </div>
    </section>
  </div>
</template>

<script>
	import { header, nav, search } from '@/components';
  import { mapGetters } from 'vuex';
  import shopManagerNav from './children/nav';
export default {
  computed: {
    ...mapGetters(['search'])
  },
  components: {
    'vHeader': header,
    'vNav': nav,
    search,
    shopManagerNav
  }
};
</script>

<style lang="css" scoped>
:root{
  --navBg:#F8F8F8;
  --bg:#fff;
}
  @component-namespace shopManager{
    @component container{
      margin-top: 1em;
      display: flex;
      max-width: 1200px;
      margin: 1em auto 0;
      @descendent left{
        background: var(--navBg);
        width: 220px;
      }
      @descendent right{
        @neat-span-columns 10;
        padding: 12px;
        background: var(--bg);
      }
    }
  }
</style>
