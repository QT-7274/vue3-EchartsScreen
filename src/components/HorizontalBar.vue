<template>
  <div>
    <!-- <div>大区数据信息</div> -->
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
      text: "大区数据信息",
      textStyle: {
        color: echartColor.labelColor,
      },
    },
    // 图表绘制的位置，对应上下左右
    grid: {
      top: "15%",
      right: 0,
      bottom: 0,
      left: 0,
      containLabel: true,
    },
    // X 轴展示数据
    xAxis: {
      show: false,
      type: "value",
    },
    // Y 轴展示数据
    yAxis: {
      type: "category",
      inverse: true,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: echartColor.axisLabelColor,
      },
    },

    //核心配置
    series: [
      {
        type: "bar",
        showBackground: true,
        backgroundStyle: {
          color: echartColor.dataBackgroundColor,
        },
        itemStyle: {
          color: echartColor.barColor,
          borderRadius: 5,
          shadowColor: echartColor.dataShadowColor,
          shadowBlur: 5,
        },
        label: {
          show: true,
          color: echartColor.labelColor,
          position: "right",
        },
      },
    ],
  };
  mChart.setOption(initOptions);
};

// 数据配置设置，包括数据
const updateDataChart = () => {
  const seriesData = props.data.regions.map((item) => ({
    name: item.name,
    value: item.value,
  }));
  const dataOption = {
    xAxis: {
      max: function (value) {
        return parseInt(value.max * 1.2);
      },
    },
    yAxis: {
      data: props.data.regions.map((item) => item.name),
    },
    series: [
      {
        data: seriesData,
      },
    ],
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
    yAxis: {
      axisLabel: {
        fontSize: labelSize , // 设置字体大小为 12px
      },
    },
    series: [
      {
        label: {
          fontSize: labelSize,
        },
        barWidth: titleFontSize,
        itemStyle: {
          borderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0],
        },
      },
    ],
  };
  mChart.setOption(adapterOption);
  mChart.resize();
};
</script>
<style scoped lang="less"></style>
