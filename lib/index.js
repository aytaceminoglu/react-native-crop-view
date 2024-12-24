"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CropView = void 0;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var react_native_svg_1 = __importStar(require("react-native-svg"));
var CropView = function (props) {
    var children = props.children, onCropChange = props.onCropChange, areaStyle = props.areaStyle, handleStyle = props.handleStyle, highlightArea = props.highlightArea;
    var _a = (0, react_1.useState)({ width: 0, height: 0 }), containerSize = _a[0], setContainerSize = _a[1];
    var _b = (0, react_1.useState)({
        x: 50,
        y: 50,
        width: 200,
        height: 200,
    }), cropArea = _b[0], setCropArea = _b[1];
    var _c = (0, react_1.useState)(null), activeHandle = _c[0], setActiveHandle = _c[1];
    (0, react_1.useEffect)(function () {
        if (onCropChange) {
            onCropChange(cropArea);
        }
    }, [cropArea]);
    function applyCornerResize(prev, dx, dy, containerSize, corner) {
        var x = prev.x, y = prev.y, width = prev.width, height = prev.height;
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
            x: x,
            y: y,
            width: width,
            height: height,
        };
    }
    var resizeOnPanResponderMove = function (evt, gestureState) {
        if (!activeHandle)
            return;
        var dx = gestureState.dx, dy = gestureState.dy;
        switch (activeHandle) {
            case "top-left":
            case "top-right":
            case "bottom-left":
            case "bottom-right":
                setCropArea(function (prev) {
                    return applyCornerResize(prev, dx, dy, containerSize, activeHandle);
                });
                break;
            default:
                break;
        }
    };
    var resizePanResponder = react_native_1.PanResponder.create({
        onStartShouldSetPanResponder: function () { return true; },
        onPanResponderMove: resizeOnPanResponderMove,
        onPanResponderRelease: function () { return setActiveHandle(null); },
    });
    var handleResizeStart = function (handle) {
        setActiveHandle(handle);
    };
    var dragOnPanResponderMove = function (evt, gestureState) {
        var dx = gestureState.dx, dy = gestureState.dy;
        setCropArea(function (prev) {
            var newX = Math.max(0, Math.min(prev.x + dx, containerSize.width - prev.width));
            var newY = Math.max(0, Math.min(prev.y + dy, containerSize.height - prev.height));
            return __assign(__assign({}, prev), { x: newX, y: newY });
        });
    };
    var dragPanResponder = react_native_1.PanResponder.create({
        onStartShouldSetPanResponder: function () { return true; },
        onPanResponderMove: dragOnPanResponderMove,
        onPanResponderRelease: function () { },
    });
    return (<react_native_1.View style={styles.container} onLayout={function (e) {
            var _a = e.nativeEvent.layout, width = _a.width, height = _a.height;
            console.log({ width: width, height: height });
            setContainerSize({ width: width, height: height });
            setCropArea({
                x: 0,
                y: height / 2 - 100,
                width: width,
                height: 200,
            });
        }}>
      {children}

      {highlightArea && (<react_native_svg_1.default height={containerSize.height} width={containerSize.width} style={react_native_1.StyleSheet.absoluteFill}>
          <react_native_svg_1.Defs>
            <react_native_svg_1.Mask id="mask" x="0" y="0" width={containerSize.width} height={containerSize.height}>
              <react_native_svg_1.Rect width={containerSize.width} height={containerSize.height} fill="white"/>
              <react_native_svg_1.Rect x={cropArea.x} y={cropArea.y} width={cropArea.width} height={cropArea.height} fill="black"/>
            </react_native_svg_1.Mask>
          </react_native_svg_1.Defs>

          <react_native_svg_1.Rect width={containerSize.width} height={containerSize.height} fill="rgba(0, 0, 0, 0.7)" mask="url(#mask)"/>
        </react_native_svg_1.default>)}

      <react_native_1.View style={[
            styles.cropArea,
            {
                left: cropArea.x,
                top: cropArea.y,
                width: cropArea.width,
                height: cropArea.height,
            },
            areaStyle,
        ]} {...dragPanResponder.panHandlers}>
        {["top-left", "top-right", "bottom-left", "bottom-right"].map(function (corner) { return (<react_native_1.View key={corner} {...resizePanResponder.panHandlers} onTouchStart={function () { return handleResizeStart(corner); }} style={[styles.handle, $corners[corner], handleStyle]}/>); })}
      </react_native_1.View>
    </react_native_1.View>);
};
exports.CropView = CropView;
var $corners = {
    "top-left": { top: -10, left: -10 },
    "top-right": { top: -10, right: -10 },
    "bottom-left": { bottom: -10, left: -10 },
    "bottom-right": { bottom: -10, right: -10 },
};
var styles = react_native_1.StyleSheet.create({
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
exports.default = exports.CropView;
