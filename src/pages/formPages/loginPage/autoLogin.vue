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
      this.$store.commit('LOGIN', this.$route.query.token);
      checkOauth(this.$route.query.token).then(res => {
        if (res.data && !res.data.code) {
           this.$store.commit('LOGIN', this.$route.query.token);
           this.$store.commit('GET_USERINFO', res.data.data);
           this.$router.push('/homePage');
        }
      });

    }
  },
  async mounted() {
    await this.$store.dispatch('memberChecklimit');
  }
};
</script>

<style lang="css">
</style>
