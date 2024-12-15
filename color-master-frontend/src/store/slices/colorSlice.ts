import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ColorCollection {
  id: string;
  name: string;
  colors: string[];
  tags: string[];
}

interface ColorState {
  recentColors: string[];
  selectedColor: string | null;
  colorCollections: ColorCollection[];
  isWebSocketConnected: boolean;
}

const sampleCollections = [
  {
    id: '1',
    name: '经典配色',
    colors: ['#FF0000', '#00FF00', '#0000FF'],
    tags: ['基础', '经典'],
  },
  {
    id: '2',
    name: '自然色彩',
    colors: ['#8B4513', '#228B22', '#4682B4'],
    tags: ['自然', '舒适'],
  },
];

const initialState: ColorState = {
  recentColors: [],
  selectedColor: null,
  colorCollections: sampleCollections,
  isWebSocketConnected: false,
};

const colorSlice = createSlice({
  name: 'color',
  initialState,
  reducers: {
    addRecentColor: (state, action: PayloadAction<string>) => {
      if (!state.recentColors.includes(action.payload)) {
        state.recentColors = [action.payload, ...state.recentColors.slice(0, 19)];
      }
    },
    setSelectedColor: (state, action: PayloadAction<string | null>) => {
      state.selectedColor = action.payload;
    },
    addColorCollection: (state, action: PayloadAction<ColorCollection>) => {
      state.colorCollections.push(action.payload);
    },
    addColorToCollection: (state, action: PayloadAction<{ collectionId: string; color: string }>) => {
      const collection = state.colorCollections.find(c => c.id === action.payload.collectionId);
      if (collection && !collection.colors.includes(action.payload.color)) {
        collection.colors.push(action.payload.color);
      }
    },
    setWebSocketConnected: (state, action: PayloadAction<boolean>) => {
      state.isWebSocketConnected = action.payload;
    },
    updateColorCollections: (state, action: PayloadAction<ColorState['colorCollections']>) => {
      state.colorCollections = action.payload;
    },
  },
});

export const {
  addRecentColor,
  setSelectedColor,
  addColorCollection,
  addColorToCollection,
  setWebSocketConnected,
  updateColorCollections,
} = colorSlice.actions;

export default colorSlice.reducer;
