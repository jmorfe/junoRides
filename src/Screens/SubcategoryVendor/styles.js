import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale
} from '../../styles/responsiveSize';

export default ({themeColors, fontFamily}) => {
  const styles = StyleSheet.create({
    viewAllVeiw: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: moderateScale(16),
      marginBottom: moderateScaleVertical(24),
      marginTop: moderateScaleVertical(15),
    },
    menuView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: moderateScale(4),
      borderWidth: 0.3,
      borderColor: colors.textGreyB,
      padding: moderateScale(6),
    },
    exploreStoresTxt: {
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
      textAlign: 'left',
    },

    viewAllText: {
      color: themeColors.primary_color,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
    },
  });

  return styles;
};
