<template>
  <!-- 准备一个容器 -->
  <!-- 注意外面不要加div -->
  <div class="charts" ref="charts"></div>
</template>

<script>
// 引入echarts
import echarts from "echarts";
export default {
  name:'lineChart',
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
          type: "line",
          data: [10, 7, 33, 12, 88, 9,56,25,44,67],
          // 设置拐点样式
          itemStyle: {
            opacity: 0,
          },
          //线条的样式
          lineStyle: {
            color: "orange",
          },
          // 填充颜色
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "orange", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "white", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
            // 变圆滑
            smooth:true
        },
      ],
      // 布局格式
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    };
    lineCharts.setOption(option);
  },
};
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>