import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface PowerComponent {
  id: number;
  title: string;
  isActive: boolean;
  image: string;
  tdp_up: number;
  tdp_typical: number;
  quantity: number;
}

export interface Power {
  powerId: number;
  status: string;
  upTotal: number;
  typicalTotal: number;
  efficiency: number;
  recommendedPower: number;
  description?: string;
  componentsCount: number;
  components: PowerComponent[];
}

export interface PowerListItem {
  powerId: number;
  status: string;
  upTotal: number;
  typicalTotal: number;
  efficiency: number;
  recommendedPower: number;
  componentsCount: number;
  createdAt?: string; // важно для фильтра
}

interface PowerState {
  power: Power | null;
  powers: PowerListItem[];
  loading: boolean;
  error: string | null;
}

const initialState: PowerState = {
  power: null,
  powers: [],
  loading: false,
  error: null,
};

export const fetchPowerById = createAsyncThunk<
  Power,
  number,
  { rejectValue: number }
>(
  "power/fetchById",
  async (powerId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/powers/${powerId}`, {
        withCredentials: true,
      });

      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.status);
    }
  }
);

export const fetchPowers = createAsyncThunk<
  PowerListItem[],
  {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  creatorId?: string;
  silent?: boolean; 
},
  { rejectValue: number }
>("power/fetchAll", async (filters, { rejectWithValue }) => {
  try {
    const params: any = {};

    if (filters.status) params.status = filters.status;
    if (filters.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters.dateTo) params.dateTo = filters.dateTo;
    if (filters.creatorId) params.creatorId = filters.creatorId;

    const res = await axios.get(`/api/powers`, {
      params,
      withCredentials: true,
    });

    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.status);
  }
});

export const deleteComponentFromPower = createAsyncThunk<
  number,
  number,
  { rejectValue: number }
>(
  "power/deleteComponent",
  async (componentId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/components-powers/${componentId}`, {
        withCredentials: true,
      });

      return componentId;
    } catch (err: any) {
      return rejectWithValue(err.response?.status);
    }
  }
);

export const updatePower = createAsyncThunk<
  { powerId: number; efficiency: number; description: string },
  { powerId: number; efficiency: number; description: string },
  { rejectValue: number }
>(
  "power/updatePower",
  async ({ powerId, efficiency, description }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `/api/powers/${powerId}`,
        { efficiency, description },
        { withCredentials: true }
      );

      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.status);
    }
  }
);

export const updateComponentQuantity = createAsyncThunk<
  { componentId: number; quantity: number },
  { componentId: number; quantity: number },
  { rejectValue: number }
>(
  "power/updateComponentQuantity",
  async ({ componentId, quantity }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `/api/components-powers/${componentId}`,
        { quantity },
        { withCredentials: true }
      );

      return {
        componentId,
        quantity: res.data.quantity ?? quantity,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.status);
    }
  }
);

export const addComponent = createAsyncThunk<
  { componentId: number; quantity: number },
  { componentId: number; quantity: number },
  { rejectValue: number }
>(
  "power/addComponent",
  async ({ componentId, quantity }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `/api/components-powers/${componentId}`,
        { withCredentials: true }
      );

      return {
        componentId,
        quantity: res.data.quantity ?? quantity,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.status);
    }
  }
);



export const formPower = createAsyncThunk<
  void,
  number,
  { rejectValue: number }
>(
  "power/form",
  async (powerId, { rejectWithValue }) => {
    try {
      await axios.put(
        `/api/powers/${powerId}/form`,
        {},
        { withCredentials: true }
      );
    } catch (err: any) {
      return rejectWithValue(err.response?.status);
    }
  }
);

export const deletePower = createAsyncThunk<
  void,
  number,
  { rejectValue: number }
>(
  "power/delete",
  async (powerId, { rejectWithValue }) => {
    try {
      await axios.delete(
        `/api/powers/${powerId}`,
        { withCredentials: true }
      );
    } catch (err: any) {
      return rejectWithValue(err.response?.status);
    }
  }
);

const powerSlice = createSlice({
  name: "power",
  initialState,
  reducers: {
  clearPower: (state) => {
      state.power = null;
    },
    clearPowers: (state) => {
      state.powers = [];
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPowerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPowerById.fulfilled, (state, action) => {
        state.loading = false;
        state.power = action.payload;
      })
      .addCase(fetchPowerById.rejected, (state, action) => {
        state.loading = false;

        if (action.payload === 403) {
          state.error = "FORBIDDEN";
        } else if (action.payload === 404) {
          state.error = "NOT_FOUND";
        } else {
          state.error = "ERROR";
        }
      })
      .addCase(fetchPowers.pending, (state, action) => {
        if (!action.meta.arg?.silent) {
          state.loading = true;
        }
      })
      .addCase(fetchPowers.fulfilled, (state, action) => {
        state.loading = false;
        state.powers = action.payload;
      })
      .addCase(fetchPowers.rejected, (state) => {
        state.loading = false;
        state.error = "ERROR";
      })
      .addCase(updatePower.fulfilled, (state, action) => {
      if (!state.power) return;

      state.power.efficiency = action.payload.efficiency;
      state.power.description = action.payload.description;
    })
      .addCase(updateComponentQuantity.fulfilled, (state, action) => {
      if (!state.power) return;

      const item = state.power.components.find(
        c => c.id === action.payload.componentId
      );

      if (item) {
        item.quantity = action.payload.quantity;
      }
    })
    .addCase(formPower.fulfilled, (state) => {
  if (state.power) {
    state.power.status = "FORMED";
  }
})
.addCase(deletePower.fulfilled, (state) => {
  state.power = null;
})
      .addCase(deleteComponentFromPower.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComponentFromPower.fulfilled, (state, action) => {
      if (state.power) {
        state.power.components =
          state.power.components.filter(c => c.id !== action.payload);

        state.power.componentsCount -= 1;
      }
    })
      .addCase(deleteComponentFromPower.rejected, (state, action) => {
        state.loading = false;
        state.error = "ERROR";
      });
  },
});

export const updatePowerStatus = createAsyncThunk(
  "power/updateStatus",
  async (
    {
      powerId,
      status,
    }: {
      powerId: number;
      status: "COMPLETED" | "DECLINED";
    },
    thunkAPI
  ) => {
    try {
      const response = await axios.put(
        `/api/powers/${powerId}/status`,
        { status },
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(
        e.response?.data || "Ошибка смены статуса"
      );
    }
  }
);

export const { clearPower, clearPowers } = powerSlice.actions;
export default powerSlice.reducer;