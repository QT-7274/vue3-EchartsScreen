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
  mChart = echarts.init(target.value);
  /** @type EChartsOption */
  const initOptions = {
    // 标题的设置
    title: {
      text: "云端报警风险",
      textStyle: {
        color: echartColor.labelColor,
      },
    },
    grid: {
      // 添加一个空的grid组件
      top: "50%", // 调整距离顶部的距离
    },
    radar: {
      axisName: {
        color: echartColor.radarLabelColor,
        fontSize: 14, //做响应式
      },
      shape: "polygon",
      center: ["50%", "55%"],
      radius: "80%",
      startAngle: 120,
      axisLine: {
        lineStyle: {
          color: echartColor.axisLineColor,
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          width: 1,
          color: echartColor.axisSplitColor,
        },
      },
      splitArea: {
        show: false,
      },
    },
    // 极坐标系配置
    polar: {
      center: ["50%", "50%"],
      radius: "0%",
    },
    // 角度轴
    angleAxis: {
      min: 0,
      interval: 5,
      clockwise: false,
    },
    // 半径轴
    radiusAxis: {
      min: 0,
      interval: 20,
      splitLine: {
        show: false,
      },
    },
    //核心配置
    series: {
      type: "radar",
      symbol: "circle",
      symbolSize: 10,
      itemStyle: {
        color: echartColor.radarLabelColor,
        opacity: 0.5,
      },
      areaStyle: {
        color: echartColor.radarLabelColor,
        opacity: 0.5,
      },
      lineStyle: {
        width: 2,
        color: echartColor.radarLabelColor,
      },
      label: {
        show: true,
        
        color: echartColor.labelColor,
      },
    },
  };
  mChart.setOption(initOptions);
};

// 数据配置设置，包括数据
const updateDataChart = () => {
  const dataOption = {
    radar: {
      indicator: props.data.risks.map((item) => ({
        name: item.name,
        max: 100,
      })),
    },
    series: {
      data: [props.data.risks.map((item) => item.value)],
    },
  };
  mChart.setOption(dataOption);
};
// 屏幕配置设置
const screenAdapterChart = () => {
  const titleFontSize = (target.value.offsetWidth / 100) * 4;
  const labelSize = (target.value.offsetWidth / 100) * 3.6
  

  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize,
      },
    },
    radar: {
      axisName: {
        fontSize: labelSize,
      },
    },
    series: {
      label:{
          fontSize:labelSize ,
      }
    },
  };
  mChart.setOption(adapterOption);
  mChart.resize();
};
</script>
<style scoped lang="less"></style>
