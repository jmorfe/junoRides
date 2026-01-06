import { getBundleId } from "react-native-device-info";
import { appIds, shortCodes } from "../../utils/constants/DynamicAppKeys";

export const getAppCode = () => {
    switch (getBundleId()) {
        case appIds.junoRide: return shortCodes.junoRide;
       
        default: return '2d98b5'
    }
}