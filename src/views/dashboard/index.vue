<template>
  <div class="main">
    <div class="dashboard-container">
      <button @click="write">11</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {
    write() {
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.table {
  margin: 30px;
}
</style>
