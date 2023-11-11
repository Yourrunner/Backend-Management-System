<template>
  <!-- 准备一个容器 -->
  <!-- 注意外面不要加div -->
  <div class="charts" ref="charts"></div>
</template>

<script>
// 引入echarts
import echarts from "echarts";
export default {
  mounted() {
    // 初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts);
    let option = {
      xAxis: {
        show: false,
        // 隐藏x轴
        type: "category",
        // 添加折线效果
      },
      yAxis: {
        show: false,
      },
      // 系列
      series: [
        {
          type: "bar",
          data: [21, 53, 33, 12, 88, 26,56,25,44,67],
          legendHoverLink:true,
          color:'skyblue'
        },
      ],
      // 布局格式
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    //  添加提示信息
    tooltip:{}
    };
    lineCharts.setOption(option);
  },
};
</script>

<style>
.charts {
  width: 100%;
  height: 100%;
}
</style>