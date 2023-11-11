<template>
  <div>
        <div class="card-header">
            <span>{{title}}</span>
            <i class="el-icon-info"></i>
        </div>
        <div class="card-content">{{count}}</div>
        <div class="card-charts">
            <slot name="chart"></slot>
        </div>
        <div class="card-foot">
            <slot name="footer"></slot>
        </div>
  </div>
</template>

<script>
export default {
    props:['title','count']
}
</script>

<style scoped>
.card-header{
    display: flex;
    justify-content: space-between;
    color: #d9d9d9;
    font-style: 16px;
}
.card-content{
    font-size: 30px;
    padding: 10px 0px;
}
.card-charts{
    height: 50px;
}
.card-foot{
    border-top: 1px solid #eee;
    padding-top:10px;
}
</style>