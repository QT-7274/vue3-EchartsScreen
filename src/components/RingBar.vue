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
const getSeriesData = () => {
  const series = [];
  props.data.abnormals.forEach((item, index) => {
    // 上层
    series.push({
      name: item.name,
      type: "pie",
      clockwise: false,
      emphasis:{
        scale:0
      },
      radius: [73 - index * 15 + "%", 68 - index * 15 + "%"],
      center: ["55%", "55%"],
      label: {
        show: false,
      },
      data: [
        {
          value: item.value,
          name: item.name,
        },
        {
          value: 1000,
          itemStyle: {
            color: echartColor.dataShadowColor,
            borderWidth: 0,
          },
          tooltip: {
            show: false,
          },
          emphasis:{
        scale:0
      },
        },
      ],
    });
    // 底层
    series.push({
      name: item.name,
      type: "pie",
      silent: true,
      z: 1,
      clockwise: false,
      emphasis:{
        scale:0
      },
      radius: [73 - index * 15 + "%", 68 - index * 15 + "%"],
      center: ["55%", "55%"],
      label: {
        show: false,
      },
      data: [
        {
          value: 7.5,
          itemStyle: {
            color: echartColor.dataItemColor,
            borderWidth: 0,
          },
          tooltip: {
            show: false,
          },
          emphasis:{
        scale:0
      },
        },
        {
          value: 2.5,
          itemStyle: {
            color: echartColor.dataShadowColor,
            borderWidth: 0,
          },
          tooltip: {
            show: false,
          },
          emphasis:{
        scale:0
      },
        },
      ],
    });
  });
  return series;
};
// 初始配置设置，包括位置、样式
const initChart = () => {
  /** @type EChartsOption */
  const initOptions = {
    // 标题的设置
    title: {
      text: "大区异常处理",
      textStyle: {
        color: echartColor.labelColor,
      },
    },
    legend: {
      show: true,
      icon: "circle",
      top: "14%",
      left: "60%",
      width: -5,
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 6,
      textStyle: {
        color: echartColor.labelColor,
      },
    },
     // 提示层
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: '{a}<br>{b}:{c}({d}%)'
      },
    // 图表绘制的位置，对应上下左右
    grid: {},
    // X 轴展示数据
    xAxis: [{
        show: false
      }],
    // Y 轴展示数据
    yAxis: [{
        type: 'category',
        inverse: true,
        axisLine: {
          show: false
        }
      }],
  };
  mChart.setOption(initOptions);
};

// 数据配置设置，包括数据
const updateDataChart = () => {
  const dataOption = {
    legend:{
      data: props.data.abnormals.map((item) => item.name),
    },
    series: getSeriesData()
    
  };
  mChart.setOption(dataOption);
};
// 屏幕配置设置
const screenAdapterChart = () => {
  const titleFontSize = (target.value.offsetWidth / 100) * 4;
  const labelSize = (target.value.offsetWidth / 100) * 3.6;
  console.log('窗口变化')
  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize,
      }
    },
     legend:{
       textStyle: {
        fontSize: labelSize / 1.5,
        lineHeight: 5,
      },
      
    }
   
  };
  mChart.setOption(adapterOption);
  mChart.resize();
};
</script>
<style scoped lang="less"></style>
