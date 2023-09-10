<template>
  <div>
    <div ref="target" class="w-full h-full"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from "vue";
import * as echarts from "echarts";
import echartColor from "../utils/color.js";
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

let mChart = null;
const target = ref(null);
onMounted(() => {
  mChart = echarts.init(target.value);
  initChart();
  updateDataChart();
  window.addEventListener("resize", screenAdapterChart);
  screenAdapterChart();
});
onUnmounted(() => {
  window.removeEventListener("resize", screenAdapterChart);
});
watch(
  () => props.data,
  () => {
    updateDataChart();
  }
);
// 初始配置设置，包括位置、样式
const initChart = () => {
  /** @type EChartsOption */
  const initOptions = {
    // 标题的设置
    title: {},
    // 图表绘制的位置，对应上下左右
    grid: {},
    // X 轴展示数据
    xAxis: {},
    // Y 轴展示数据
    yAxis: {},

    //核心配置
    series: [],
  };
  mChart.setOption(initOptions);
};

// 数据配置设置，包括数据
const updateDataChart = () => {
  const dataOption = {};
  mChart.setOption(dataOption);
};
// 屏幕配置设置
const screenAdapterChart = () => {
   const titleFontSize = (target.value.offsetWidth / 100) * 4;
  const labelSize = (target.value.offsetWidth / 100) * 3.6
  console.log('labelSize ' + labelSize)
  console.log('titleFontSize ' + titleFontSize)
  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize,
      },
    },
    series: [],
  };
  mChart.setOption(adapterOption);
  mChart.resize();
};
</script>
<style scoped lang="less"></style>
