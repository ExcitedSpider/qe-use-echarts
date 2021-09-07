import { EChartsOption, ECharts, init, getInstanceByDom } from "echarts";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import throttle from "lodash/throttle";
import once from "lodash/once";
import identity from "lodash/identity";

import { deepEqual } from "./utils";

export interface UseEchartsOptions {
  /**
   * rendor root element ref
   * 
   * div or canavs
   */
  renderRootRef: React.RefObject<HTMLDivElement | HTMLCanvasElement>;
  /**
   * `setOption` 1st param object
   */
  echartsOption: EChartsOption;
  /**
   * `setOption` 2nd param object
   */
  echartsSetOptionOpt?: any;
  /**
   * echarts event listeners
   */
  on?: {
    [eventName: string]: (...params: any[]) => void;
  };
  debug?: boolean;
  /**
   * responsive container size change
   */
  responsive?: boolean;
  /**
   * size change observer throttle
   */
  responsiveThrottle?: number;
}

export const useEcharts = (
  options: UseEchartsOptions
): { chartInsRef: React.RefObject<ECharts | undefined> } => {
  const {
    renderRootRef,
    responsive = true,
    echartsOption,
    echartsSetOptionOpt,
    debug,
    responsiveThrottle = 100,
    on: onEventMap,
  } = options;

  const chartInsRef = useRef<ECharts>();

  /**
   * 初始化 echarts
   * 在组件生命周期内只会执行一次，清理一次
   */
  useLayoutEffect(() => {
    if (renderRootRef.current) {
      // 如果已经有一个 echarts instance，先 dispose 掉
      if (getInstanceByDom(renderRootRef.current)) {
        console.warn(
          "Element already has a chart instance! Check if there is memory leak."
        );
        getInstanceByDom(renderRootRef.current).dispose();
      }
      chartInsRef.current = init(renderRootRef.current);
    }

    return () => {
      chartInsRef.current?.dispose();
    };
  }, []);

  const oldOption = useRef<any>();

  // 响应式 option
  useEffect(() => {
    if (echartsOption && !deepEqual(oldOption.current, echartsOption)) {
      oldOption.current = echartsOption;
      if (debug) {
        console.log("set chart option", echartsOption);
      }
      chartInsRef.current?.clear();
      chartInsRef.current?.setOption(echartsOption, echartsSetOptionOpt);
    }
  }, [echartsOption]);

  /**
   * redraw on resize
   */
  useEffect(() => {
    const echoOnce = once(identity);
    const redraw = throttle(() => {
      const time = Date.now();
      // 避免初始化绘制
      if (echoOnce(time) === time) {
        return;
      }
      chartInsRef.current?.resize();
    }, responsiveThrottle);

    const observer = new ResizeObserver(redraw);

    if (responsive && renderRootRef.current) {
      observer.observe(renderRootRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [responsive]);

  /** refresh event listeners */
  useEffect(() => {
    if (onEventMap) {
      Object.keys(onEventMap).forEach((name) => {
        chartInsRef.current?.off(name);
        chartInsRef.current?.on(name, onEventMap[name]);
      });
    }
  }, [onEventMap]);

  return { chartInsRef };
};
