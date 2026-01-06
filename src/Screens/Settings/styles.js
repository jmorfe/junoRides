import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';

export default ({fontFamily,themeColors, isDarkMode, MyDarkTheme}) => {
  const styles = StyleSheet.create({
    currency: {
      color: colors.blackB,
      // textAlign: 'center',
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
      color: isDarkMode ? MyDarkTheme.colors.text : colors.blackB,
    },
    darkAppearanceTextStyle: {
      lineHeight: 24,
      color: colors.blackB,
      // textAlign: 'center',
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
    },
    dropDownTouch: {
      marginHorizontal: moderateScale(20),
      paddingVertical: moderateScaleVertical(10),
      paddingHorizontal: moderateScale(15),
      justifyContent: 'space-between',

      borderWidth: 0.5,

      borderRadius: moderateScale(5),
    },

    touchAbleLoginVIew: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loginLogoutText: {
      fontSize: textScale(14),
      color: themeColors?.primary_color,
      fontFamily: fontFamily?.medium,
      textAlign: 'left',
      marginRight: moderateScale(8)
    },
    dropDownView: {
      borderTopWidth: 0.7,
      borderBottomWidth: 0.7,
      paddingVertical: moderateScaleVertical(20),
      paddingHorizontal: moderateScale(16),
      backgroundColor: isDarkMode
      ? MyDarkTheme.colors.lightDark
      : colors.white,
    borderColor: isDarkMode
      ? MyDarkTheme.colors.text
      : colors.blackOpacity20,
    },
    flexHorizView: {
      flexDirection: 'row',
      marginHorizontal: moderateScale(20),
    },
    dropDownStyle: {
      backgroundColor: isDarkMode
      ? MyDarkTheme.colors.lightDark
      : colors.greyColor1,
    height: moderateScale(120),
    alignSelf: 'center',
    zIndex: 5000,
    }
  });
  return styles;
};
