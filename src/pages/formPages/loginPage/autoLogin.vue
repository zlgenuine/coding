<template lang="html">
</template>

<script>
import {
  checkOauth
} from '@/common/api/api';
export default {
  async beforeCreate() {
    this.$store.commit('LOGIN_OUT');
    if (this.$route.query.token) {
      let res = await checkOauth(this.$route.query.token);
      if (!res.data.code) {
        await this.$store.commit('LOGIN', this.$route.query.token);
        await this.$store.commit('GET_USERINFO', res.data.data);
        await this.$router.push('/homePage');
      }
    }
  },
  async mounted() {
    await this.$store.dispatch('memberChecklimit');
  }
};
</script>

<style lang="css">
</style>
