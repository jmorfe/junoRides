import { StyleSheet } from 'react-native';
import colors from '../../../styles/colors';
import {
    moderateScale,
    moderateScaleVertical
} from '../../../styles/responsiveSize';

export default ({ themeColors, fontFamily }) => {
    const styles = StyleSheet.create({
        container: {
            borderRadius: moderateScale(16),
            height: moderateScaleVertical(149),
            width: moderateScale(166),
            backgroundColor: colors.green,
            marginLeft: moderateScale(16),

        },
        menuView: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: moderateScale(4),
            borderWidth: 0.3,
            borderColor: colors.textGreyB,
            width: moderateScale(100),
            height: moderateScale(30)
        },
    });

    return styles;
};
