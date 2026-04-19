import { createContext, useContext } from "react";

export const ColorLayerContext = createContext({
    layer: 0,
});

const bgColors = [
    "bg-slate-50 dark:bg-slate-900",
    "bg-slate-100 dark:bg-slate-800",
    "bg-slate-200 dark:bg-slate-700",
    "bg-slate-300 dark:bg-slate-600",
];
const hoverBgColors = [
    "hover:bg-slate-100 dark:hover:bg-slate-800",
    "hover:bg-slate-200 dark:hover:bg-slate-700",
    "hover:bg-slate-300 dark:hover:bg-slate-600",
    "hover:bg-slate-400 dark:hover:bg-slate-500",
];
const borderColors = [
    "border-slate-100 dark:border-slate-800",
    "border-slate-200 dark:border-slate-700",
    "border-slate-300 dark:border-slate-600",
    "border-slate-400 dark:border-slate-500",
];
const textColors = [
    "text-gray-600 dark:text-gray-500",
    "text-gray-700 dark:text-gray-400",
    "text-gray-800 dark:text-gray-300",
    "text-gray-900 dark:text-gray-200",
];

export const useColorLayer = (layerStep = 1) => {
    const layer = useContext(ColorLayerContext).layer + layerStep;
    const index = Math.min(bgColors.length - 1, Math.max(0, layer));

    if (index !== layer) console.warn("We are out of ColorLayers!!!", "Layer:", layer, "Index:", index);
    return {
        layer,
        bgColor: bgColors[index],
        hoverBgColor: hoverBgColors[index],
        borderColor: borderColors[index],
        textColor: textColors[index],
        textHighlightColor: "text-slate-800 dark:text-slate-50",
        hoverTextHighlightColor: "hover:text-slate-800 hover:dark:text-slate-50",
    };
};
