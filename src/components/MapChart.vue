<template>
  <div>
    <div ref="target" class="w-full h-full"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from "vue";
import * as echarts from "echarts";
import echartColor from "../utils/color.js";
import mapJson from "@/assets/mapData/china.json";
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

let mChart = null;
const target = ref(null);
onMounted(() => {
  echarts.registerMap("china", mapJson);
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
    initChart();
    updateDataChart();
  }
);
// 初始配置设置，包括位置、样式
const initChart = () => {
  /** @type EChartsOption */
  const initOptions = {
    // 时间轴配置
    timeline: {
      data: props.data.voltageLevel,
      axisType: "category",
      autoPlay: true,
      playInterval: 3000,
      left: "10%",
      right: "10%",
      bottom: "0%",
      width: "80%",
      label: {
        color: echartColor.labelColor,
      },
      emphasis: {
        label: {
          color: echartColor.labelColor,
        },
        controlStyle: {
          color: echartColor.labelDarkColor,
          borderColor: echartColor.labelDarkColor,
        },
      },
      symbolSize: 10,
      lineStyle: {
        color: echartColor.labelDarkColor,
      },
      checkpointStyle: {
        borderColor: echartColor.labelDarkColor,
        borderWidth: 2,
      },
      controlStyle: {
        showNextBtn: true,
        showPrevBtn: true,
        color: echartColor.labelDarkColor,
        borderColor: echartColor.labelDarkColor,
      },
    },
    // 基础配置
    baseOption: {
      grid: {
        top: "15%",
        right: "2%",
        bottom: "10%",
        width: "20%",
      },
      // 地图配置
      geo: {
        show: true,
        map: "china",
        roam: true,
        zoom: 0.8,
        center: [113.83531246, 34.0267395887],
        label:{
          fontSize:8
        },
        itemStyle: {
          borderColor: echartColor.mapBorderColor,
          borderWidth: 1,
          areaColor: {
            type: "radial",
            x: 0.5,
            y: 0.5,
            r: 0.5,
            colorStops: [
              {
                offset: 0,
                color: echartColor.dataBackgroundColor,
              },
              {
                offset: 1,
                color: "rgba(147,235,248,.2)",
              },
            ],
          },
        },
        emphasis: {
          itemStyle: {
            areaColor: echartColor.radarLabelColor,
            borderWidth: 0,
          },
        },
      },
    },
    // 动态配置
    options: [],
  };

  //遍历年份
  /** @type EChartsOption */
  props.data.voltageLevel.forEach((item, index) => {
    initOptions.options.push({
      backgroundColor: echartColor.dataItemColor,
      title: [
        {
          text: "2019-2023 年度数据统计",
          left: "0%",
          top: "0%",
          textStyle: {
            color: echartColor.labelColor,
            fontSize: 20, //响应式
          },
        },
        {
          id: "statistic",
          text: item + "年度数据统计情况",
          right: "0%",
          top: "4%",
          textStyle: {
            color: echartColor.labelColor,
            fontSize: 15, //响应式
          },
        },
      ],
      xAxis: {
        type: "value",
        scale: true,
        position: "top",
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          fontSize:8,
          margin: 2,
          color: echartColor.labelColor,
        },
      },
      yAxis: {
        type: "category",
        axisLine: {
          show: true,
          lineStyle: {
            color: echartColor.labelColor,
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          fontSize:8,
          interval: 0,
          color: echartColor.labelColor,
        },
        data: props.data.categoryData[item].map((item) => item.name), //数据
      },
      series: [
        {
          type: "bar",
          zlevel: 1.5,
          itemStyle: {
            color: props.data.colors[index],
          },
          data: props.data.categoryData[item].map((item) => item.value), //数据
        },
        {
          type: "effectScatter",
          coordinateSystem: "geo",
          data: props.data.topData[item],
          symbolSize: function (val) {
            return val[2] / 4;
          },
          showEffectOn: "render",
          rippleEffect: {
            brushType: "stroke",
          },
          label: {
            show: true,
            fontSize:10,
            formatter: "{b}",
            position: "right",
          },
          itemStyle: {
            color: props.data.colors[index],
            shadowBlue: 5,
            shadowColor: props.data.colors[index],
          },
        },
      ],
    });
  });

  mChart.setOption(initOptions);
};

// 数据配置设置，包括数据
const updateDataChart = () => {
  const dataOption = {};
  mChart.setOption(dataOption);
};
// 屏幕配置设置
const screenAdapterChart = () => {
  
  mChart.resize();
};
</script>
<style scoped lang="less"></style>
