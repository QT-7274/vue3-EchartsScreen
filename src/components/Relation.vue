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
    initChart();
  }
);
// 初始配置设置，包括位置、样式
const initChart = () => {
  
  /** @type EChartsOption */
  const initOptions = {
    // 标题的设置
    title: {
      text: "数据传递信息",
      textStyle: {
        color: echartColor.labelColor,
      },
    },
    // X 轴展示数据
    xAxis: {
      show: false,
      type: "value",
    },
    // Y 轴展示数据
    yAxis: {
      show: false,
      type: "value",
    },
    //核心配置
    series: [
      // 圆
      {
        type: "graph",
        layout: "none",
        coordinateSystem: "cartesian2d",
        // symbolSize: 30,
        z: 3,
        edgeLabel: {
          show: true,
          color: echartColor.labelColor,
          // fontSize: 10,
          formatter: function (params) {
            return params.data.speed;
          },
        },
        label: {
          show: true,
          position: "bottom",
          color: echartColor.labelColor,
          
        },
        edgeSymbol: ["none", "arrow"],
        // edgeSymbolSize: 8,
      },
      // 动态的线
      {
        type: "lines",
        coordinateSystem: "cartesian2d",
        z: 1,
        // 线特效
        effect: {
          show: true,
          smooth: false,
          trailLength: 0,
          symbol: "arrow",
          color: echartColor.relationEffectColor,
          // symbolSize: 12,
        },
        lineStyle: {
          curveness: 0.2,
        },
      },
    ],
  };
  mChart.setOption(initOptions);
};

// 数据配置设置，包括数据
const updateDataChart = () => {
  const dataOption = {
    series: [
      {
       
        // 连接线
        links: props.data.relations.map((item, index) => ({
          source: item.source,
          target: item.target,
          speed: `${item.speed}kb/s`,
          lineStyle: {
            color: echartColor.relationLineColor,
            curveness: 0.2,
          },
          label: {
            show: true,
            position: "middle",
            offset: [10, 0], // 偏移
          },
        })),
      },
      {
        data: [
          {
            coords: [
              [0, 300],
              [50, 200],
            ],
          },
          {
            coords: [
              [0, 100],
              [50, 200],
            ],
          },
          {
            coords: [
              [50, 200],
              [100, 100],
            ],
          },
          {
            coords: [
              [50, 200],
              [100, 300],
            ],
          },
        ],
      },
    ],
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

    series: [
      {
        symbolSize: labelSize * 3,
        edgeSymbolSize: labelSize,
        edgeLabel:{
          fontSize: labelSize
        },
         data: props.data.relations.map((item) => {
          if (item.id != 0) {
            return {
              name: item.name,
              category: 0,
              active: true,
              speed: `${item.speed}kb/s`,
              value: item.value,
              label: {
                fontSize: labelSize / 1.5,
              },
            };
          } else {
            return {
              name: item.name,
              value: item.value,
              symbolSize: labelSize * 6,
              itemStyle: {
                color: {
                  colorStops: [
                    {
                      offset: 0,
                      color: echartColor.relationDataColor1,
                    },
                    {
                      offset: 1,
                      color: echartColor.relationDataColor2,
                    },
                  ],
                },
              },
              label: {
                fontSize: titleFontSize,
              },
            };
          }
        }),
      },
      {
        effect:{
          symbolSize: labelSize,
        }
      }
    ],
  };
  mChart.setOption(adapterOption);
  mChart.resize();
};
</script>
<style scoped lang="less"></style>
