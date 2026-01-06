import { StyleSheet } from 'react-native';
import colors from '../../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';

export default ({ fontFamily, themeColors }) => {
  const styles = StyleSheet.create({
    containerStyle: {
      // flex: 1,
    },
    renderItemStyle: {
      borderBottomWidth: 1,
      borderColor: colors.borderColorB,

      marginHorizontal: moderateScale(3),
      paddingVertical: moderateScaleVertical(10),
    },
    textStyle: {
      alignSelf: 'center',
      marginStart: moderateScale(12),
      fontFamily: fontFamily.reguler,
    },
    imageStyle: {
      alignSelf: 'center',
    },
    flat1View: {
      marginTop: moderateScaleVertical(32),
      marginHorizontal: moderateScale(8),
    },
    flat1Img: {
      height: moderateScaleVertical(159),
      width: moderateScale(288),
      borderRadius: moderateScale(8),
      overflow: "hidden"
    },
    underView1: { marginHorizontal: moderateScale(16) },
    underView2: { marginVertical: moderateScaleVertical(20) },
    leftText: {
      color: colors.greyD,
      fontSize: textScale(14),
      fontFamily: fontFamily?.medium
    },
    rightText: {
      color: colors.topBarOrange,
      fontSize: textScale(14),
      fontFamily: fontFamily?.medium
    },
    flat2View1: {
      height: moderateScaleVertical(72),
      borderBottomWidth: 1,
      borderBottomColor: colors.greyMedium,
      backgroundColor: colors.white
    },
    flat2View2: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: moderateScale(9),
    },
    flat2Img: {
      width: moderateScale(40),
      height: moderateScaleVertical(40),
      // borderWidth: 1,
      // borderColor: colors.borderColorB,
      // borderRadius: moderateScale(4),

    },
    flat2View3: { marginLeft: moderateScale(14) },
    flat2txt1: { fontSize: textScale(13), fontFamily: fontFamily?.medium },
    flat2txt2: {
      marginTop: moderateScaleVertical(10),
      color: colors.lightGreyText,
      width: moderateScale(182),
      fontSize: textScale(12),
      fontFamily: fontFamily?.medium
    },
    textContainer: {
      marginTop: moderateScaleVertical(16),
      marginLeft: moderateScale(11),
    },
    text3: {
      marginLeft: moderateScale(10),
      color: themeColors?.primary_color,
      fontSize: textScale(13),
      fontFamily: fontFamily?.medium
    },
  });
  return styles;
};
