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
        // 最小值和最大值的设置
        min:0,
        max:100,
      },
      yAxis: {
        show: false,
        // 在y轴均分
        type: "category",
      },
      // 系列
      series: [
        {
          type: "bar",
          data: [78],
          legendHoverLink:true,
          color:'purple',
          // 设置柱状图的宽度
          barWidth:'20px',
          //  背景颜色
          showBackground :true,
          backgroundStyle:{
            color:'#eee'
          },
          //文本标签
          label:{
            show:true,
            // 改变文本内容 
            formatter:'|',
            // 文本标签位置
            position:'right'
          }
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