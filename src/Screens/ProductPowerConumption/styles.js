import { Platform, StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import commonStyles from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  StatusBarHeight,
  textScale,
  width,
} from '../../styles/responsiveSize';

export default ({ themeColors, fontFamily, isDarkMode, MyDarkTheme }) =>
  StyleSheet.create({
    filterElctConsumpView: {
        width: width - 30,
        alignSelf: 'center',
        height:width/1.4,
        padding: moderateScale(16),
        borderRadius: moderateScale(10)
    },
    calculationResultHeading:{
      alignSelf: 'center',
      fontFamily: fontFamily.bold,
      color: isDarkMode ? colors.white : colors.black,
      fontSize: textScale(16),
      marginBottom: moderateScaleVertical(20),
  },
  textInputStyle:{
    fontFamily: fontFamily.regular,
    fontSize: textScale(12),
    height: moderateScaleVertical(40),
    backgroundColor: isDarkMode ? colors.greyA : colors.white,
    paddingHorizontal: moderateScale(6),
  },
  labelText:{
    marginBottom: moderateScaleVertical(5),
    fontFamily: fontFamily.medium,
    color: isDarkMode ? colors.white : colors.black,
    fontSize: textScale(12)
},
HeadertextStyle: {
  color: colors.black2Color,
  fontSize: textScale(16),
  lineHeight: textScale(28),
  textAlign: 'center',
  fontFamily: fontFamily.medium,
},
headerContainer:{
  flexDirection: 'row', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  paddingHorizontal:moderateScale(16),
  marginVertical:moderateScaleVertical(5) ,
},
btnWrapper:{ 
  marginTop: moderateScaleVertical(5), 
  justifyContent: 'space-between', 
  flexDirection: 'row', 
  alignItems: 'center', 
  width: '100%', }
    
  });
