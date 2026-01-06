import { StyleSheet } from 'react-native';
import { getColorCodeWithOpactiyNumber } from '../utils/helperFunctions';
import colors from './colors';
import { moderateScaleVertical, textScale } from './responsiveSize';
import fontFamily from './fontFamily';

export const hitSlopProp = {
  top: 15,
  right: 15,
  left: 15,
  bottom: 15,
};

export const hitSlopProp7 = {
  top: 7,
  right: 7,
  left: 7,
  bottom: 7,
};


interface MyComponentProps {
  fontFamily: Record<string, string>;
  buttonTextColor: Record<string, string>; // Assuming buttonTextColor is a valid color code like "#FFFFFF"
}




export default ({ fontFamily, buttonTextColor }:MyComponentProps) => {
  const styles = StyleSheet.create({
    loader: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    mediumFont14Normal: {
      fontSize: textScale(14),
      color: colors.textGrey,
      fontFamily: fontFamily?.medium,
      opacity: 1,
      textAlign: 'left',
    },

    futuraBtHeavyFont16: {
      fontSize: textScale(16),
      color: colors.black,
      fontFamily: fontFamily?.bold,
      textAlign: 'left',
    },
    futuraBtHeavyFont18: {
      fontSize: textScale(18),
      color: colors.black,
      fontFamily: fontFamily?.bold,
      textAlign: 'left',
    },
    futuraBtHeavyFont20: {
      fontSize: textScale(20),
      color: colors.black,
      fontFamily: fontFamily?.bold,
      textAlign: 'left',
    },
    futuraBtHeavyFont14: {
      fontSize: textScale(14),
      color: colors.black,
      fontFamily: fontFamily?.bold,
      textAlign: 'left',
    },
    futuraHeavyBt: {
      fontSize: textScale(16),
      color: colors.black,
      fontFamily: fontFamily?.bold,
      textAlign: 'left',
    },
    buttonRect: {
      height: moderateScaleVertical(46),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 13,
    },
    buttonRectTransparent: {
      height: moderateScaleVertical(46),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: getColorCodeWithOpactiyNumber('1E2428', 20),
      borderRadius: 13,
    },

    buttonRectCommonButton: {
      height: moderateScaleVertical(46),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(67,162,231,0.3)',
      borderWidth: 0,
      borderColor: getColorCodeWithOpactiyNumber('1E2428', 20),
      borderRadius: 13,
    },

    shadowStyle: {
      backgroundColor: colors.white,
      borderRadius: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,

    },
    buttonTextWhite: {
      fontFamily: fontFamily?.bold ? fontFamily?.bold : 'SFProText-Bold',
      textTransform: 'uppercase',
      color: !!buttonTextColor?.secondary_color
        ? buttonTextColor?.secondary_color
        : colors.white,
      textAlign: 'center',
    },

    buttonTextBlue: {
      fontFamily: fontFamily?.bold,
      textTransform: 'uppercase',
      color: colors.textBlue,
      textAlign: 'center',
    },
    buttonTextBlack: {
      fontFamily: fontFamily?.medium,
      textTransform: 'uppercase',
      color: colors.textGrey,
      textAlign: 'center',
    },
    imgOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    headerTopLine: {
      height: 1,
      backgroundColor: colors.lightGreyBgColor,
      opacity: 0.26,
    },
    mediumTxtGreyD14: {
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
      color: colors.textGreyD,
    },
    regularFont11: {
      fontSize: textScale(11),
      color: colors.textGrey,
      fontFamily: fontFamily?.regular,
      opacity: 0.7,
      textAlign: 'left',
    }, regularFont12: {
      fontFamily: fontFamily.regular,
      fontSize: textScale(12),
    },
    regularFont14: {
      fontFamily: fontFamily.regular,
      fontSize: textScale(12),
  },
    flexRowJustifyConten: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },



    alignJustifyCenter: {
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',
    },
    flexRowCenter: {
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
    },
    flexRowSpaceBtwn: {
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      justifyContent: 'space-between' as 'space-between',
    },
    flex1AlignJustifyCenter: {
      flex: 1,
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',
    },
    flexRowJustifySpaceBtwn: {
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',
    },
    font10: {
      fontSize: textScale(10),
      color: colors?.black,
      fontFamily: fontFamily?.regular,
      textAlign: 'left',
    },
    mediumFont10: {
      fontSize: textScale(10),
      color: colors?.black,
      fontFamily: fontFamily?.medium,
      textAlign: 'left',
    },
    boldFont10: {
      fontSize: textScale(10),
      color: colors?.black,
      fontFamily: fontFamily?.bold,
      textAlign: 'left',
    },
    font11: {
      fontSize: textScale(11),
      color: colors?.black,
      fontFamily: fontFamily?.regular,
      textAlign: 'left',
    },
    mediumFont11: {
      fontSize: textScale(11),
      color: colors?.black,
      fontFamily: fontFamily?.medium,
      textAlign: 'left',
    },
  
    boldFont11: {
      fontSize: textScale(11),
      color: colors?.black,
      fontFamily: fontFamily?.bold,
      textAlign: 'left',
    },
    font12: {
      fontSize: textScale(12),
      color: colors?.black,
      fontFamily: fontFamily?.regular,
      textAlign: 'left',
    },
    mediumFont12: {
      fontSize: textScale(12),
      color: colors?.black,
      fontFamily: fontFamily?.medium,
      textAlign: 'left',
    },
  
    boldFont12: {
      fontSize: textScale(12),
      color: colors?.black,
      fontFamily: fontFamily?.bold,
      textAlign: 'left',
    },
  
    font13: {
      fontSize: textScale(13),
      color: colors?.black,
      fontFamily: fontFamily?.regular,
      textAlign: 'left',
    },
    mediumFont13: {
      fontSize: textScale(13),
      color: colors?.black,
      fontFamily: fontFamily?.medium,
      textAlign: 'left',
    },
  
    boldFont13: {
      fontSize: textScale(13),
      color: colors?.black,
      fontFamily: fontFamily?.bold,
      textAlign: 'left',
    },
  
    font14: {
      fontSize: textScale(14),
      color: colors?.black,
      fontFamily: fontFamily?.regular,
      textAlign: 'left',
    },
    mediumFont14: {
      fontSize: textScale(14),
      color: colors?.black,
      fontFamily: fontFamily?.medium,
      textAlign: 'left',
    },
  
    boldFont14: {
      fontSize: textScale(14),
      color: colors?.black,
      fontFamily: fontFamily?.bold,
      textAlign: 'left',
    },
    font15: {
      fontSize: textScale(15),
      color: colors?.black,
      fontFamily: fontFamily?.regular,
      textAlign: 'left',
    },
    mediumFont15: {
      fontSize: textScale(15),
      color: colors?.black,
      fontFamily: fontFamily?.medium,
      textAlign: 'left',
    },
  
    boldFont15: {
      fontSize: textScale(15),
      color: colors?.black,
      fontFamily: fontFamily?.bold,
      textAlign: 'left',
    },
    font16: {
      fontSize: textScale(16),
      color: colors?.black,
      fontFamily: fontFamily?.regular,
      textAlign: 'left',
    },
    mediumFont16: {
      fontSize: textScale(16),
      color: colors?.black,
      fontFamily: fontFamily?.medium,
      textAlign: 'left',
    },
  
    boldFont16: {
      fontSize: textScale(16),
      color: colors?.black,
      fontFamily: fontFamily?.bold,
      textAlign: 'left',
    },
    font17: {
      fontSize: textScale(17),
      color: colors?.black,
      fontFamily: fontFamily?.regular,
      textAlign: 'left',
    },
    mediumFont17: {
      fontSize: textScale(17),
      color: colors?.black,
      fontFamily: fontFamily?.medium,
      textAlign: 'left',
    },
  
    boldFont17: {
      fontSize: textScale(17),
      color: colors?.black,
      fontFamily: fontFamily?.bold,
      textAlign: 'left',
    },
  
    font18: {
      fontSize: textScale(18),
      color: colors?.black,
      fontFamily: fontFamily?.regular,
      textAlign: 'left',
    },
    mediumFont18: {
      fontSize: textScale(18),
      color: colors?.black,
      fontFamily: fontFamily?.medium,
      textAlign: 'left',
    },
  
    boldFont18: {
      fontSize: textScale(18),
      color: colors?.black,
      fontFamily: fontFamily?.bold,
      textAlign: 'left',
    },
  
    font20: {
      fontSize: textScale(20),
      color: colors?.black,
      fontFamily: fontFamily?.regular,
      textAlign: 'left',
    },
    mediumFont20: {
      fontSize: textScale(20),
      color: colors?.black,
      fontFamily: fontFamily?.medium,
      textAlign: 'left',
    },
  
    boldFont20: {
      fontSize: textScale(20),
      color: colors?.black,
      fontFamily: fontFamily?.bold,
      textAlign: 'left',
    },
    font24: {
      fontSize: textScale(24),
      color: colors?.black,
      fontFamily: fontFamily?.regular,
      textAlign: 'left',
    },
    mediumFont24: {
      fontSize: textScale(24),
      color: colors?.black,
      fontFamily: fontFamily?.medium,
      textAlign: 'left',
    },
  
    boldFont24: {
      fontSize: textScale(24),
      color: colors?.black,
      fontFamily: fontFamily?.bold,
      textAlign: 'left',
    },
    font28: {
      fontSize: textScale(28),
      color: colors?.black,
      fontFamily: fontFamily?.regular,
      textAlign: 'left',
    },
    mediumFont28: {
      fontSize: textScale(28),
      color: colors?.black,
      fontFamily: fontFamily?.medium,
      textAlign: 'left',
    },
  
    boldFont28: {
      fontSize: textScale(28),
      color: colors?.black,
      fontFamily: fontFamily?.bold,
      textAlign: 'left',
    },

  });
  return styles;
};
