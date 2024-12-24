import React, { FC, useEffect, useState } from "react";
import {
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";

import Svg, { Defs, Mask, Rect } from "react-native-svg";

export interface CropViewerProps extends ViewProps {
  onCropChange?: (cropArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void;
  areaStyle?: ViewStyle;
  handleStyle?: ViewStyle;
  highlightArea?: boolean;
}

export const CropViewer: FC<CropViewerProps> = (props) => {
  const { children, onCropChange, areaStyle, handleStyle, highlightArea } =
    props;

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [cropArea, setCropArea] = useState({
    x: 50,
    y: 50,
    width: 200,
    height: 200,
  });
  const [activeHandle, setActiveHandle] = useState<string | null>(null);

  useEffect(() => {
    if (onCropChange) {
      onCropChange(cropArea);
    }
  }, [cropArea]);

  function applyCornerResize(
    prev: { x: number; y: number; width: number; height: number },
    dx: number,
    dy: number,
    containerSize: { width: number; height: number },
    corner: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  ) {
    let { x, y, width, height } = prev;

    // Calculate initial new values based on corner
    switch (corner) {
      case "top-left":
        x += dx;
        y += dy;
        width -= dx;
        height -= dy;
        break;
      case "top-right":
        y += dy;
        width += dx;
        height -= dy;
        break;
      case "bottom-left":
        x += dx;
        width -= dx;
        height += dy;
        break;
      case "bottom-right":
        width += dx;
        height += dy;
        break;
    }

    // Enforce minimum size
    width = Math.max(50, width);
    height = Math.max(50, height);

    // Clamp X, Y so they won't go negative
    if (x < 0) {
      width += x;
      x = 0;
    }
    if (y < 0) {
      height += y;
      y = 0;
    }

    // Clamp right/bottom. If x + width goes beyond container, shift or shrink.
    if (x + width > containerSize.width) {
      width = containerSize.width - x;
    }
    if (y + height > containerSize.height) {
      height = containerSize.height - y;
    }

    // Ensure minimum size after clamping
    width = Math.max(50, width);
    height = Math.max(50, height);

    return {
      x,
      y,
      width,
      height,
    };
  }

  const resizeOnPanResponderMove = (
    evt: GestureResponderEvent,
    gestureState: PanResponderGestureState
  ) => {
    if (!activeHandle) return;

    let { dx, dy } = gestureState;

    switch (activeHandle) {
      case "top-left":
      case "top-right":
      case "bottom-left":
      case "bottom-right":
        setCropArea((prev) =>
          applyCornerResize(prev, dx, dy, containerSize, activeHandle)
        );
        break;
      default:
        break;
    }
  };

  const resizePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: resizeOnPanResponderMove,
    onPanResponderRelease: () => setActiveHandle(null),
  });

  const handleResizeStart = (handle: string) => {
    setActiveHandle(handle);
  };

  const dragOnPanResponderMove = (
    evt: GestureResponderEvent,
    gestureState: PanResponderGestureState
  ) => {
    const { dx, dy } = gestureState;
    setCropArea((prev) => {
      const newX = Math.max(
        0,
        Math.min(prev.x + dx, containerSize.width - prev.width)
      );
      const newY = Math.max(
        0,
        Math.min(prev.y + dy, containerSize.height - prev.height)
      );
      return {
        ...prev,
        x: newX,
        y: newY,
      };
    });
  };

  const dragPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: dragOnPanResponderMove,
    onPanResponderRelease: () => {},
  });

  return (
    <View
      style={styles.container}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        console.log({ width, height });

        setContainerSize({ width, height });
        setCropArea({
          x: 0,
          y: height / 2 - 100,
          width: width,
          height: 200,
        });
      }}
    >
      {children}

      {highlightArea && (
        <Svg
          height={containerSize.height}
          width={containerSize.width}
          style={StyleSheet.absoluteFill}
        >
          <Defs>
            <Mask
              id="mask"
              x="0"
              y="0"
              width={containerSize.width}
              height={containerSize.height}
            >
              <Rect
                width={containerSize.width}
                height={containerSize.height}
                fill="white"
              />
              <Rect
                x={cropArea.x}
                y={cropArea.y}
                width={cropArea.width}
                height={cropArea.height}
                fill="black"
              />
            </Mask>
          </Defs>

          <Rect
            width={containerSize.width}
            height={containerSize.height}
            fill="rgba(0, 0, 0, 0.7)"
            mask="url(#mask)"
          />
        </Svg>
      )}

      <View
        style={[
          styles.cropArea,
          {
            left: cropArea.x,
            top: cropArea.y,
            width: cropArea.width,
            height: cropArea.height,
          },
          areaStyle,
        ]}
        {...dragPanResponder.panHandlers}
      >
        {["top-left", "top-right", "bottom-left", "bottom-right"].map(
          (corner) => (
            <View
              key={corner}
              {...resizePanResponder.panHandlers}
              onTouchStart={() => handleResizeStart(corner)}
              style={[styles.handle, $corners[corner], handleStyle]}
            />
          )
        )}
      </View>
    </View>
  );
};

const $corners: Record<string, ViewStyle> = {
  "top-left": { top: -10, left: -10 },
  "top-right": { top: -10, right: -10 },
  "bottom-left": { bottom: -10, left: -10 },
  "bottom-right": { bottom: -10, right: -10 },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cropArea: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "red",
    zIndex: 2,
  },
  handle: {
    position: "absolute",
    width: 20,
    height: 20,
    backgroundColor: "blue",
  },
});

export default CropViewer;
