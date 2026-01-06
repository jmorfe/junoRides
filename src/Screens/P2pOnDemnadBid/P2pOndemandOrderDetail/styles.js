import { StyleSheet } from 'react-native';
import colors from '../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';
import { width, height } from '../../../styles/responsiveSize';

export default ({ fontFamily, themeColors }) => {
  const styles = StyleSheet.create({

    emptyContainer: {
      height: height / 1.5,
      alignItems: "center",
      justifyContent: "center"
    },
    titleTxt: {
      fontFamily: fontFamily?.medium,
      fontSize: textScale(16),
      color: colors.black,
      marginBottom: moderateScaleVertical(12),
      paddingLeft: moderateScale(16),
    },
    priceContainer: {
      borderWidth: 1,
      borderColor: colors.borderColorB,
      borderRadius: moderateScale(4),
      padding: moderateScale(16),
      marginTop: moderateScaleVertical(16),
      marginHorizontal: moderateScale(16)
    },
    leftRightText: {
      fontFamily: fontFamily?.regular,
      color: colors.black,
      fontSize: textScale(14)
    },
    sectionTitle: {
      marginTop: moderateScaleVertical(16),
      marginBottom: moderateScaleVertical(8),
      fontFamily: fontFamily?.medium,
      fontSize: textScale(14),
      color: colors.blackOpacity40,
      marginHorizontal: moderateScale(16)
    },
  });
  // export default styles;
  return styles;
};
