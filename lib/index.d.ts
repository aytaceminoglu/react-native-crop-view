import { FC } from "react";
import { ViewProps, ViewStyle } from "react-native";
export interface CropViewProps extends ViewProps {
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
export declare const CropView: FC<CropViewProps>;
export default CropView;
