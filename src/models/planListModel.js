import {
  // 计划列表
  getPlanList,
  startCalculate,
  stopCalculate,
  handleCopyPlan,
  handleDeletePlan,
  handleAddPlan,
  handleDownloadPlan,
} from '@/services/planList';

const planListModel = {
  namespace: 'planListModel',

  state: {
    // 计划列表
    planList: [],
    planListTotal: 0,
    isPlanListLoading: false,
  },

  effects: {
    // 计划列表
    *getPlanList({ payload }, { call, put }) {
      const response = yield call(getPlanList, payload);
      yield put({
        type: 'savePlanList',
        payload: {
          data: response,
        },
      });
      return response;
    },
    *startCalculate({ payload }, { call, put }) {
      const response = yield call(startCalculate, payload);
    },
    *stopCalculate({ payload }, { call, put }) {
      const response = yield call(stopCalculate, payload);
    },
    *handleCopyPlan({ payload }, { call, put }) {
      const response = yield call(handleCopyPlan, payload);
    },
    *handleDeletePlan({ payload }, { call, put }) {
      const response = yield call(handleDeletePlan, payload);
    },
    *handleAddPlan({ payload }, { call, put }) {
      const response = yield call(handleAddPlan, payload);
    },
    *handleDownloadPlan({ payload }, { call, put }) {
      const response = yield call(handleDownloadPlan, payload);
    },
  },

  reducers: {
    // 计划列表
    savePlanList(state, action) {
      const { data } = action.payload;

      return {
        ...state,
        planList: data.list.concat() || [],
        planListTotal: data.total || 0,
        isPlanListLoading: false,
      };
    },
    startCalculate(state, action) {
      return {
        ...state,
        isPlanListLoading: true,
      };
    },
    stopCalculate(state, action) {
      return {
        ...state,
        isPlanListLoading: true,
      };
    },
    handleCopyPlan(state, action) {
      return {
        ...state,
        isPlanListLoading: true,
      };
    },
    handleDeletePlan(state, action) {
      return {
        ...state,
        isPlanListLoading: true,
      };
    },
    handleAddPlan(state, action) {
      return {
        ...state,
        isPlanListLoading: true,
      };
    },
    handleSearchPlan(state, action) {
      return {
        ...state,
        isPlanListLoading: true,
      };
    },
  },
};

export default planListModel;
