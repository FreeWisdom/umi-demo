import moment from 'moment';
import { isDatesBetween } from '@/utils/processDateFormat';

/**
 * js获取url参数
 * @param {*} key 参数名
 */
export const getUrlParam = (key) => {
  let reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)'); //构造一个含有目标参数的正则表达式对象
  let r = window.location.search.substr(1).match(reg); //匹配目标参数
  if (r != null) return unescape(r[2]);
  return null; //返回参数值
};

/**
 * 修改url参数
 * @param {*} key 参数名
 * @param {*} value 参数值
 */
export const replaceParamVal = (key, value) => {
  let oUrl = window.location.href.toString();
  let re = eval('/(' + key + '=)([^&]*)/gi');
  let nUrl = oUrl.replace(re, key + '=' + value);
  return nUrl;
};

/**
 * 修改页面url指定参数,并跳转(单个参数)
 * @param {*} key 参数名
 * @param {*} value 参数值
 */
export const setParamVal = (key, value) => {
  let url = window.location.href;
  if (getUrlParam(key) != null) {
    window.location.href = replaceParamVal(key, value);
  } else {
    if (url.indexOf('?') == -1) {
      window.location.href = url + '?' + key + '=' + value;
    } else {
      window.location.href = url + '&' + key + '=' + value;
    }
  }
};

export const isTimeLater = (compared, compare, addOneDay) => {
  const comparedArr = compared.split(':');
  const compareArr = compare.split(':');
  if (
    comparedArr[0] < compareArr[0] ||
    (comparedArr[0] === compareArr[0] && comparedArr[1] <= compareArr[1])
  ) {
    return true;
  }
  if (addOneDay.indexOf('(+1)') !== -1) {
    return true;
  }
  return false;
};

export const formateMonitorList = (monitorList) => {
  monitorList.map((item, index) => {
    item.index = index;
    for (const key in item) {
      let tempObj = {};
      if (key !== 'time' && key !== 'index') {
        tempObj.isClicked = false;
        tempObj.name = item[key];
        item[key] = tempObj;
      }
    }
  });
  return monitorList;
};

/**
 * 表格操作方案2：模拟excel鼠标移动选中表格,未使用
 */
export const formateimitateExcellData = (monitorList, seat, time, count) => {
  monitorList.map((item) => {
    if (!item[seat]) {
      if (item.time === time) {
        let tempObj = {
          isClicked: true,
          name: {
            name: '',
          },
        };
        item[seat] = tempObj;
      }
    }

    if (count === 0) {
      for (let key in item) {
        if (key !== 'time') {
          item[key].isClicked = false;
        }
      }
    }

    if (item.time === time) {
      item[seat].isClicked = true;
    }
  });
  sessionStorage.setItem('imitateExcellData', JSON.stringify(monitorList));
  return monitorList;
};
export const formateDataClick = (monitorList, seat, time) => {
  monitorList.map((item) => {
    if (!item[seat]) {
      if (item.time === time) {
        let tempObj = {
          isClicked: true,
          name: {
            name: '',
          },
        };
        item[seat] = tempObj;
      }
    }

    for (let key in item) {
      if (key !== 'time') {
        item[key].isClicked = false;
      }
    }

    if (item.time === time) {
      item[seat].isClicked = true;
    }
  });
  return monitorList;
};

/**
 *  表格操作方案3：鼠标框选表格，使用中
 * @param {*} monitorList
 * @param {*} seat 框选的席位
 * @param {*} mouseDownIndex 鼠标落下的index
 * @param {*} mouseUpIndex 鼠标抬起的index
 */
export const formatRectSelectData = (
  monitorList,
  seat,
  mouseDownIndex,
  mouseUpIndex,
) => {
  let selectStartIndex =
    mouseDownIndex < mouseUpIndex ? mouseDownIndex : mouseUpIndex;
  let selectEndIndex =
    mouseDownIndex < mouseUpIndex ? mouseUpIndex : mouseDownIndex;
  monitorList.map((item) => {
    if (item[seat]) {
      if (selectStartIndex <= item.index && item.index <= selectEndIndex) {
        // 重复选择时候，已选中的取消选中，未选中的选中
        item[seat].isClicked = !item[seat].isClicked;
      }
    } else {
      let tempObj = {
        isClicked: false,
        name: {
          name: '',
        },
      };
      item[seat] = tempObj;

      if (selectStartIndex <= item.index && item.index <= selectEndIndex) {
        item[seat].isClicked = true;
      }
    }
  });
  return monitorList;
};
export const initRectSelectData = (monitorList, seat) => {
  monitorList.map((item) => {
    if (item[seat]) {
      item[seat].isClicked = false;
    }
  });
  return monitorList;
};

/**
 * list 页得到鼠标框选后的时间段
 * @param {*} monitorList 鼠标款选后，前端展示的即时数据
 */
export const getSelectedTimeSlot = (monitorList) => {
  let selectedTimeSlotList = [];
  monitorList.map((item) => {
    for (const key in item) {
      if (key !== 'index' && key !== 'time') {
        if (item[key].isClicked) {
          selectedTimeSlotList.push(item.time);
        }
      }
    }
  });

  return selectedTimeSlotList;
};

/**
 * 席位gantt 页得到鼠标框选后的时间段
 * @param {*} seatMap
 */
export const getSelectedTimeSlotOfSeatGantt = (seatMap) => {
  let selectedTimeSlotList = [];
  for (const iterator in seatMap) {
    seatMap[iterator].map((seatItem) => {
      if (seatItem.children.length !== 0) {
        seatItem.children.map((timeItem) => {
          if (timeItem.isSelected && timeItem.startTime !== timeItem.endTime) {
            let startTime = timeItem.startTime; // xxx-xx-xx xx:xx
            let endTime = timeItem.endTime.split(' ')[1]; // xx:xx
            selectedTimeSlotList.push(startTime + '-' + endTime);
          }
        });
      } else {
        if (seatItem.isSelected) {
          let startTime = seatItem.startTime; // xxx-xx-xx xx:xx
          let endTime = seatItem.endTime.split(' ')[1]; // xx:xx
          selectedTimeSlotList.push(startTime + '-' + endTime);
        }
      }
    });
  }

  return selectedTimeSlotList;
};

/**
 * 人员gantt 页得到鼠标框选后的时间段
 * @param {*} seatMap
 */
export const getSelectedTimeSlotOfStaffGantt = (listMap) => {
  let selectedTimeSlotList = [];

  for (const key in listMap) {
    listMap[key].map((item) => {
      if (item.isSelected) {
        let startTime = item.startTime; // xxx-xx-xx xx:xx
        let endTime = item.endTime.split(' ')[1]; // xx:xx
        selectedTimeSlotList.push(startTime + '-' + endTime);
      }
    });
  }

  return selectedTimeSlotList;
};

/**
 * 席位--甘特图框选后的数据改变
 * @param {*} seatMap
 * @param {*} startTime
 * @param {*} endTime
 * @param {*} indexes
 * @param {*} altKey
 */
export const formatGantSelectedSeatMap = (
  seatMap,
  startTime,
  endTime,
  seat,
  altKey,
  isChangeSlectedSeat,
) => {
  let startDateString = moment(startTime).format('YYYY-MM-DD HH:mm');
  let endDateString = moment(endTime).format('YYYY-MM-DD HH:mm');

  // 换行后取消上一行的选择
  if (isChangeSlectedSeat) {
    for (const key in seatMap) {
      seatMap[key]?.map((seatItem) => {
        if (seatItem.children.length > 0) {
          seatItem.children.map((timeItem) => {
            if (timeItem.isSelected === true) {
              timeItem.isSelected = false;
            }
          });
        }

        if (seatItem.isSelected === true) {
          seatItem.isSelected = false;
        }
      });
    }
  }

  seatMap[seat]?.map((seatItem) => {
    if (seatItem.children.length > 0) {
      seatItem.children.map((timeItem) => {
        if (
          isDatesBetween(
            startDateString,
            endDateString,
            timeItem.startTime,
            timeItem.endTime,
          )
        ) {
          if (timeItem.isSelected === true) {
            timeItem.isSelected = false;
          } else {
            if (timeItem.isHandOver !== true) {
              timeItem.isSelected = true;
            }
          }
        }
      });
    }

    if (seatItem.children.length === 0) {
      if (
        isDatesBetween(
          startDateString,
          endDateString,
          seatItem.startTime,
          seatItem.endTime,
        )
      ) {
        if (seatItem.isSelected === true) {
          seatItem.isSelected = false;
        } else {
          seatItem.isSelected = true;
        }
      }
    }
  });

  return seatMap;
};

/**
 * 人员--甘特图框选后的数据改变
 * @param {*} listMap
 * @param {*} startTime
 * @param {*} endTime
 * @param {*} indexes
 * @param {*} altKey
 * @param {*} taskId
 */
export const formatGantSelectedListMap = (
  listMap,
  startTime,
  endTime,
  name,
  altKey,
  isChangeSlectedName,
  taskId,
) => {
  // 换行后取消上一行的选择
  if (isChangeSlectedName || altKey === false) {
    for (const key in listMap) {
      listMap[key]?.map((nameItem) => {
        if (nameItem.isSelected === true) {
          nameItem.isSelected = false;
        }
      });
    }
  }

  if (taskId) {
    listMap[name]?.map((item) => {
      if (item.id === taskId) {
        item.isSelected = true;
      }
    });
    return listMap;
  } else {
    let startDateString = moment(startTime).format('YYYY-MM-DD HH:mm');
    let endDateString = moment(endTime).format('YYYY-MM-DD HH:mm');

    listMap[name]?.map((nameItem) => {
      if (
        isDatesBetween(
          startDateString,
          endDateString,
          nameItem.startTime,
          nameItem.endTime,
        )
      ) {
        if (nameItem.isSelected === true) {
          nameItem.isSelected = false;
        } else {
          nameItem.isSelected = true;
        }
      }
    });

    return listMap;
  }
};

export const getNameGanttTaskId = (
  listMap,
  name,
  startTime,
  endTime,
  indexes,
) => {
  let startDateString = moment(startTime).format('YYYY-MM-DD HH:mm');
  let endDateString = moment(endTime).format('YYYY-MM-DD HH:mm');
  let nameGanttTaskId = [];

  listMap[name]?.map((nameItem) => {
    if (
      isDatesBetween(
        startDateString,
        endDateString,
        nameItem.startTime,
        nameItem.endTime,
      )
    ) {
      nameGanttTaskId.push(nameItem.id);
    }
  });
  return nameGanttTaskId;
};

/**
 * 时间段数组的排序['09:30-10:00', '12:00-12:30', '10:00-10:30', '14:00-14:30']
 * @param {*} timeSlotList
 */
export const sortTimeSlot = (timeSlotList) => {
  timeSlotList.sort((curr, next) => {
    let currValue = curr;
    let nextValue = next;
    // 没有日期的情况下
    if (curr.indexOf(' ') !== -1) {
      let slotFirstList = currValue.split(' ');
      let slotFirstDate = slotFirstList[0];
      let slotFirstTime = slotFirstList[1]?.split('-')[0];

      let slotSecondList = nextValue.split(' ');
      let slotSecondDate = slotSecondList[0];
      let slotSecondTime = slotSecondList[1].split('-')[0];

      return moment(slotFirstDate + ' ' + slotFirstTime).diff(
        slotSecondDate + ' ' + slotSecondTime,
      );
    }
  });
  return timeSlotList;
};

/**
 * 选中时间段的合并
 * @param {*} treeSelect
 * @returns
 */
export const mergeTimeSlot = (treeSelect) => {
  let res = [];
  let newTreeSlect = [];

  if (treeSelect[0]?.indexOf(' ') === -1) {
    let time = treeSelect[treeSelect.length - 1].replace(/\(\+1\)/, '');
    res[0] = time;
  } else {
    newTreeSlect = treeSelect.filter((treeSelectItem, index) => {
      if (treeSelectItem.indexOf(' ') !== -1) {
        let treeSelectItemTemp = treeSelectItem;

        if (treeSelectItem.indexOf('-00:00') !== -1) {
          treeSelectItemTemp = treeSelectItem.replace(/-00:00/, '-24:00');
        }

        let currentTempList = treeSelectItemTemp.split(' ');
        let currentDate = currentTempList[0];
        let currentTimeList = currentTempList
          ? currentTempList[1]?.split('-')
          : [];

        let nextTempList = treeSelect[index + 1]?.split(' ');
        let nextDate = nextTempList ? nextTempList[0] : '';
        let nextTimeList = nextTempList ? nextTempList[1]?.split('-') : [];

        if (
          moment(currentDate + ' ' + currentTimeList[1]).diff(
            nextDate + ' ' + nextTimeList[0],
          ) !== 0
        ) {
          return true;
        }
      }
    });

    newTreeSlect.map((item) => {
      res.push(item.split(' ')[1]);
    });
  }

  return res;
};

export const getTimeSlotRange = (sortTimeSlot) => {
  let isHaveSpace = sortTimeSlot[0]?.indexOf(' ') !== -1;

  let timeSlotRangeList = [];
  let arr = [];
  let startTime = '';
  let endTime = '';

  let current = '';
  let next = '';
  let currentDate = '';
  let nextDate = '';
  let currentTime = '';
  let nextTime = '';
  let currentItem = '';
  let nextItem = '';

  for (let index = 0; index < sortTimeSlot.length; index++) {
    current = sortTimeSlot[index];
    next = sortTimeSlot[index + 1] || '';

    currentTime = isHaveSpace
      ? current.split(' ')[1]
      : current.split('-')[1] === '00:00(+1)'
      ? current.replace(/00:00\(\+1\)/, '24:00')
      : current;
    nextTime = isHaveSpace
      ? next.split(' ')[1] || ''
      : next.indexOf('00:00(+1)') !== -1
      ? next.replace(/00:00\(\+1\)/, '24:00')
      : next;

    let isCurrentAdd1 = currentTime.indexOf('(+1)') !== -1;
    let isNextAdd1 = nextTime.indexOf('(+1)') !== -1;
    let isAdd1Same = isCurrentAdd1 === isNextAdd1;

    currentItem = currentTime.split('-')[1].replace(/\(\+1\)/, '');
    nextItem = nextTime.split('-')[0] || '';

    currentDate = isHaveSpace ? current.split(' ')[0] : '2021-10-11';
    nextDate = isHaveSpace
      ? next.split(' ')[0]
      : isAdd1Same
      ? '2021-10-11'
      : '2021-10-12';

    if (
      moment(currentDate + ' ' + currentItem).diff(
        nextDate + ' ' + nextItem,
      ) === 0
    ) {
      arr.push(currentTime);
      arr.push(nextTime);
      arr = Array.from(new Set(arr));
    } else {
      if (arr.length > 0) {
        startTime = arr[0].split('-')[0];
        endTime = arr[arr.length - 1].split('-')[1];
        timeSlotRangeList.push(startTime + '-' + endTime);
        arr = [];
      }

      if (
        timeSlotRangeList[timeSlotRangeList.length - 1]?.split('-')[1] !==
        currentTime.split('-')[1]
      ) {
        timeSlotRangeList.push(currentTime);
      }
    }
  }

  return timeSlotRangeList;
};

export const getShiftTimeList = (timeSlotMergeListLast) => {
  let shiftTimeList = [];
  timeSlotMergeListLast.map((item) => {
    shiftTimeList.push(item.split('-')[0]);
  });

  return shiftTimeList;
};

/**
 * 月计划选择高亮
 * @param {*} timeItem
 * @param {*} listMap
 */
export const selectedMonthPlanGant = (timeItem, listMap, type) => {
  for (const key in listMap) {
    listMap[key].map((item) => {
      // if(item.id !== timeItem.id) {
      item.isDaySelected = false;
      item.isNightSelected = false;
      // }
    });
  }

  listMap[timeItem.name].map((item) => {
    if (item.id === timeItem.id) {
      if (type === 'nightWork') {
        item.isNightSelected = true;
      } else {
        item.isDaySelected = true;
      }
    }
  });

  return listMap;
};

/**
 *防抖函数
 *@param fn 事件触发的操作
 *@param delay 多少毫秒内连续触发事件，不会执行
 *@returns {Function}
 */
export const debounce = (fn, delay) => {
  let timer = null; //借助闭包
  return function () {
    let context = this,
      args = arguments;
    timer && clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
};

/**
 * 获取当前月的第一天
 */
export const getYearMonthMonthFirst = (yearMonth) => {
  var date = new Date(yearMonth);
  date.setDate(1);
  var month = parseInt(date.getMonth() + 1);
  var day = date.getDate();
  if (month < 10) {
    month = '0' + month;
  }
  if (day < 10) {
    day = '0' + day;
  }
  return date.getFullYear() + '-' + month + '-' + day;
};

/**
 * 获取月份最后一天
 */
export const getYearMonthMonthLast = (yearMonth) => {
  var date = new Date(yearMonth);
  var currentMonth = date.getMonth();
  var nextMonth = ++currentMonth;
  var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
  var oneDay = 1000 * 60 * 60 * 24;
  var lastTime = new Date(nextMonthFirstDay - oneDay);
  var month = parseInt(lastTime.getMonth() + 1);
  var day = lastTime.getDate();
  if (month < 10) {
    month = '0' + month;
  }
  if (day < 10) {
    day = '0' + day;
  }
  return date.getFullYear() + '-' + month + '-' + day;
};

/**
 * 基本KPI数据获取后格式化
 * 日
 */
export const formateDayBaseKPIList = (shiftBaseKpi) => {
  const res = [];
  for (const key in shiftBaseKpi) {
    if (key !== 'seatWorkTimeList') {
      let item = {
        indexName: '',
        workTime: 0,
        key: '',
      };

      switch (key) {
        case 'averageWorkerTime': {
          item.indexName = '平均工作时间';
          item.workTime = shiftBaseKpi[key];
          item.key = 'averageWorkerTime';
          res.push(item);
          break;
        }
        case 'continuousMinWorkerTime': {
          item.indexName = '持续最小工作时间';
          item.workTime = shiftBaseKpi[key];
          item.key = 'continuousMinWorkerTime';
          res.push(item);
          break;
        }
        case 'continuousMaxWorkerTime': {
          item.indexName = '持续最大工作时间';
          item.workTime = shiftBaseKpi[key];
          item.key = 'continuousMaxWorkerTime';
          res.push(item);
          break;
        }
      }

      // 睡眠kpi没有最小、最大工作时间
      if (shiftBaseKpi[key]) {
        switch (key) {
          case 'minWorkerTime': {
            item.indexName = '最小工作时间';
            item.workTime = shiftBaseKpi[key];
            item.key = 'minWorkerTime';
            res.push(item);
            break;
          }
          case 'maxWorkerTime': {
            item.indexName = '最大工作时间';
            item.workTime = shiftBaseKpi[key];
            item.key = 'maxWorkerTime';
            res.push(item);
            break;
          }
        }
      }
    } else {
      if (shiftBaseKpi.seatWorkTimeList) {
        shiftBaseKpi.seatWorkTimeList.map((seatItem) => {
          let item = {
            indexName: '',
            workTime: 0,
            key: '',
          };
          item.indexName = seatItem.seatName;
          item.workTime = seatItem.time;
          item.key = seatItem.seatName;
          res.push(item);
        });
      }
    }
  }
  return res;
};

/**
 * 基本KPI数据获取后格式化
 * 月
 */
export const formateMonthBaseKPIList = (shiftBaseKpi) => {
  const res = [];
  for (const key in shiftBaseKpi) {
    let item = {
      indexName: '',
      workTime: 0,
      key: '',
    };
    switch (key) {
      case 'averageNumber': {
        item.indexName = '平均工作时间';
        item.workTime = shiftBaseKpi[key];
        item.key = 'averageNumber';
        res.push(item);
        break;
      }
      case 'minNumber': {
        item.indexName = '最小工作时间';
        item.workTime = shiftBaseKpi[key];
        item.key = 'minNumber';
        res.push(item);
        break;
      }
      case 'maxNumber': {
        item.indexName = '最大工作时间';
        item.workTime = shiftBaseKpi[key];
        item.key = 'maxNumber';
        res.push(item);
        break;
      }
    }
  }
  return res;
};

/**
 * 基本KPI数据获取后格式化
 * 日/对比/day
 */
export const formateCompareBaseKPIList = (compareList, keyType, monthOrDay) => {
  let res = [];
  res =
    monthOrDay === 'day'
      ? formateDayBaseKPIList(compareList[0]?.[keyType])
      : formateMonthBaseKPIList(compareList[0]?.[keyType]);
  res.map((item) => {
    compareList.map((itemA) => {
      if (item.key !== item.indexName) {
        item[itemA.planName] = itemA[keyType][item.key];
      } else {
        item[itemA.planName] = itemA[keyType].seatWorkTimeList?.find((x) => {
          return x.seatName === item.key;
        })?.time;
      }
    });
  });
  return res;
};

/**
 * 鼠标相对浏览器窗口的位置
 */
export const getMousePos = (event) => {
  let e = event || window.event;
  return {
    x: e.clientX,
    Y: e.clientY,
  };
};

/**
 * 人员调整勾选时间出路数据函数
 * @param {*} timeList
 * @returns
 */
export const formateTreeData = (timeList) => {
  let timeListChildren = [];
  timeList.map((item) => {
    let itemObj = {
      title: item,
      value: item,
      key: item,
    };

    timeListChildren.push(itemObj);
  });

  return timeListChildren;
};
