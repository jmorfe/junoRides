//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {color} from 'react-native-reanimated';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';

export default ({themeColors, isDarkMode}) =>
  StyleSheet.create({
    container: {
      marginHorizontal: moderateScale(24),
      flex: 0.98,
    },
    textView: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: moderateScaleVertical(26),
    },
    sortView: {
      height: moderateScale(32),
      // width: moderateScale(74),
      borderWidth: 0.5,
      borderColor: colors.greyA,
      paddingHorizontal: moderateScale(18),
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: moderateScale(4),
    },
    sortTextStyle: {
      marginRight: moderateScale(8),
    },
    timeServiceStyle: {
      fontSize: textScale(16),
      fontFamily: fontFamily.bold,
      color: colors.lightGray,
    },
    renderView: {
      height: moderateScaleVertical(100),
      backgroundColor: colors.white,
      // width: moderateScale(339),
      borderRadius: moderateScale(4),
      flexDirection: 'row',
      padding: moderateScale(14),
    },
    nameStyle: {
      fontSize: textScale(16),
      fontFamily: fontFamily.bold,
    },
    jobPercentage: {
      fontSize: textScale(12),
      fontFamily: fontFamily.circularRegular,
      color: colors.lightTextGrey,
      marginTop: moderateScaleVertical(2),
    },
    priceStyle: {
      fontSize: textScale(16),
      fontFamily: fontFamily.bold,
      marginTop: moderateScaleVertical(2),
    },
    imgStyle: {
      height: moderateScale(55),
      width: moderateScale(50),
      borderRadius: moderateScale(3),
    },
    pickerView: {
      width: moderateScale(80),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: moderateScale(4),
      borderWidth: 0.5,
      borderColor: colors.textGreyB,
      padding: moderateScale(6),
    },
    textStyleTime: {
      fontSize: textScale(12),
      marginHorizontal: moderateScale(5),
      fontFamily: fontFamily.medium,
      color: colors.black,
    },
    imageStyle: {
      height: moderateScaleVertical(12),
      width: moderateScale(12),
      tintColor: themeColors.primary_color,
    },
    imageStyle2: {
      height: moderateScaleVertical(16),
      width: moderateScale(16),
      tintColor: themeColors.primary_color,
    },
    borderOption: {
      borderBottomWidth: 1,
      borderBottomColor: colors.greyColor,
    },
    addressview: {
      backgroundColor: colors.whiteSmokeColor,
      padding: moderateScale(12),
      borderRadius: moderateScale(18),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: moderateScale(12),
    },
    addressheading: {
      fontFamily: fontFamily.semiBold,
      fontSize: 12,
      width: width / 7,
    },
    modalContainer: {
      marginHorizontal: 0,
      marginBottom: 0,
      marginTop: 'auto',
      backgroundColor: colors.white,
    },
    mainView: {
      marginTop: moderateScale(30),
      paddingHorizontal: moderateScale(24),
      marginBottom: moderateScaleVertical(9),
      flexDirection: 'row',
    },
    timeView: {
      marginBottom: moderateScaleVertical(16),
      flexDirection: 'row',
    },
    dateView: {
      backgroundColor: colors.lightGray,
      padding: moderateScale(24),
      marginHorizontal: moderateScale(24),
      marginTop: moderateScaleVertical(18),
    },
    datePickerView: {
      backgroundColor: colors.backgroundGrey,
      paddingLeft: moderateScale(24),
      paddingRight: moderateScale(10),
      paddingVertical: moderateScale(14),
      paddingHorizontal: moderateScale(24),
      marginHorizontal: moderateScale(24),
      marginTop: moderateScaleVertical(18),
      borderRadius:8,

    },
    pickerStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    pickerView: {
      width: moderateScale(180),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: moderateScale(4),
      borderWidth: 0.5,
      borderColor: colors.textGreyB,
      padding: moderateScale(6),
    },
    secondPicker: {
      borderColor: colors.black,
      height: moderateScaleVertical(38),
      width: moderateScale(116),
      borderWidth: 0.3,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      justifyContent: 'space-evenly',
    },
    birthText: {
      marginLeft: textScale(12),
    },
    timePickerView: {
      flexDirection: 'row',

      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: moderateScale(14),
    },
    btnStyle: {
      marginHorizontal: moderateScale(24),
      marginTop: moderateScale(20),
      marginBottom: moderateScale(5),
    },
    calenderView: {
      flex: 1,
      backgroundColor: colors.white,
      padding: 32,
      paddingHorizontal: moderateScale(20),
    },
    selectDate: {
      width: moderateScale(32),
      height: moderateScale(32),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: moderateScale(16),
    },
    monthView: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    yearView: {
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
      color: colors.black,
    },
    calenderBtn: {
      marginTop: moderateScale(24),
    },
    addressStyle: {
      borderColor: colors.black,
      flex: 0.6,
      height: moderateScaleVertical(38),
      borderWidth: 0.5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      justifyContent: 'space-evenly',
    },
    addressView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: moderateScale(14),
    },
    timeStyle: {
      borderColor: colors.black,
      height: moderateScaleVertical(38),
      width: moderateScale(90),
      borderWidth: 0.5,
      flexDirection: 'row',

      alignItems: 'center',
      justifyContent: 'center',
      justifyContent: 'space-evenly',
      flexDirection: 'row',
    },
    textStyleTime: {
      fontSize: textScale(11),
      marginHorizontal: moderateScale(5),
      fontFamily: fontFamily.medium,
      color: colors.black,
    },
    imageStyle: {
      height: moderateScaleVertical(12),
      width: moderateScale(12),
      tintColor: themeColors.primary_color,
    },
    experienceview: {
      alignItems: 'center',
      width: width / 3,
      borderColor: colors.borderColor,
      borderRightWidth: 1,
    },
    exptitle: {
      marginBottom: moderateScale(8),
      fontWeight:'bold',
      color:colors.blackOpacity43
    },
    prfiletopview: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: moderateScale(12),
      marginVertical: moderateScale(36),
    },
  });