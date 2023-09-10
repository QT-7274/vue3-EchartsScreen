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
      text: "服务资源占用比",
      textStyle: {
        color: echartColor.labelColor,
      },
    },
    // X 轴展示数据
    xAxis: {
      type: "category",
      axisLabel: {
        color: echartColor.axisLabelColor,
      },
    },
    // Y 轴展示数据
    yAxis: {
      show: false,
      type: "value",
    },
    // 图表绘制的位置，对应上下左右
    // 图表绘制的位置，对应 上下左右
    grid: {
      top: 16,
      right: 1,
      bottom: 46,
      left: 1,
    },

    //核心配置
    series: {
      type: "bar",
      // 每个柱的样式
      itemStyle: {
        color: echartColor.barColor, // 柱颜色
        borderRadius: 5, // 圆角
        shadowColor: echartColor.dataShadowColor, // 阴影
        shadowBluer: 5, // 阴影模糊
      },
      // 柱宽
      barWidth: '60%',
      barMinWidth: '30%',
      // 轴上文字
          label: {
            show: true,
            position: 'top',
            color: echartColor.labelColor,
            formatter: '{c}%'
          },
    },
  };
  mChart.setOption(initOptions);
};

// 数据配置设置，包括数据
const updateDataChart = () => {
  const dataOption = {
    xAxis: {
      data: props.data.servers.map((item) => item.name),
    },
    yAxis: {
      max: function (value) {
        // 最大值 ，value 是X轴的数据
        return parseInt(value.max * 1.2);
      },
    },
    series: {
      data: props.data.servers.map((item) => ({
        name: item.name,
        value: item.value,
      })),
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
    series: {
      label:{
        fontSize: labelSize
      }
    },
  };
  mChart.setOption(adapterOption);
  mChart.resize();
};
</script>
<style scoped lang="less"></style>
