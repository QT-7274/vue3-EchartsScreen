<template>
  <div>
    <div ref="target" class="w-full h-full"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from "vue";
import * as echarts from "echarts";
import echartColor from "../utils/color.js";
 import 'echarts-wordcloud'
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

let mChart = null;
const target = ref(null);
onMounted(() => {
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
const randomRGB = () => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgb(${r},${g},${b})`;
};
// 初始配置设置，包括位置、样式
const initChart = () => {
  mChart = echarts.init(target.value);
  /** @type EChartsOption */
  const initOptions = {
    // 标题的设置
    title: {
      text: "关键词条",
      textStyle: {
        color: echartColor.labelColor,
      },
    },
    //核心配置
    series: {
      type: "wordCloud",
      sizeRange: [8, 46],
      rotationRange: [0, 0],
      gridSize: 0,
      layoutAnimation: true,
      textStyle: {
        color: randomRGB,
      },
      data: props.data.datas,
      emphasis: {
        textStyle: {
          fontWeight: "bold",
          color: echartColor.textEmphasisColor,
        },
      },
    },
  };
  mChart.setOption(initOptions);
};

// 数据配置设置，包括数据
const updateDataChart = () => {
  const dataOption = {
    series: {
      
    },
  };
  mChart.setOption(dataOption);
};
// 屏幕配置设置
const screenAdapterChart = () => {
  const titleFontSize = (target.value.offsetWidth / 100) * 4;
  const labelSize = (target.value.offsetWidth / 100) * 3.6;
  
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
