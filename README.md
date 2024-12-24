# React Native CropViewer

## Installation

```bash
npm install react-native-crop-viewer
```

or

```bash
yarn add react-native-crop-viewer
```

## Basic Usage

```jsx
import CropViewer from "react-native-crop-viewer"

...
  <CropViewer
    highlightArea={true}
    areaStyle={{ borderColor: "white", borderWidth: 4 }}
    handleStyle={{ backgroundColor: "red", borderRadius: 50 }}
    onCropChange={(cropArea) => console.log(cropArea)}
  >
    <Image source={{ uri: photo?.path }} style={{ flex: 1 }} />
  </CropViewer>
...
```
