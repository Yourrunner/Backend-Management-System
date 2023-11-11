<template>
  <div class="dashboard-container">
    <!-- 顶部区域组件 -->
    <Card></Card>   
    <Sale style="margin-top:20px;"></Sale>
    <!-- <Obersve style="margin-top:20px;"></Obersve> -->
  </div>
</template>

<script>
import Card from './Card'
import Sale from './sale'
import Obersve from './observe'
export default {
  name: 'Dashboard',
  components:{
    Card,
    Sale,
    Obersve
  }
}
</script>

<style lang="scss" scoped>

</style>
