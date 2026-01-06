import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { getColorSchema } from '../utils/utils';
import ButtonImage from './ImageComp';
const OoryksHeader = ({
  leftIcon = imagePath.ic_backarrow,
  headerContainerStyle = {},
  leftIconStyle = {},
  leftTitle = "Header",
  onPressLeft = () => { },
  rightIcon = imagePath.icSearchNew,
  isRight = false,
  onPressRight = () => { },
  titleStyle = {},
  isCustomLeftPress = false, rightText = '',
  isRightText = false,
  rightTxtStyle = {},
  disabled = false,
  rightIcon2 = imagePath.icSearchNew,
  isRight2 = false,
  isRightText2 = false,
  onPressRight2 = () => { },
  rightImgStyle = {},
  rightImgStyle2 = {}
}) => {
  const { appStyle, themeToggle, themeColor } = useSelector((state) => state?.initBoot || {});
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ fontFamily });
  const navigation = useNavigation();
  return (
    <View style={{ ...styles.headerContainerStyle, ...headerContainerStyle }}>
      <View style={{
        flexDirection: "row",
        alignItems: "center",
      }}>
        <ButtonImage onPress={isCustomLeftPress ? onPressLeft : () => navigation.goBack()} image={leftIcon} btnStyle={{
          ...styles.leftIcon, backgroundColor: colors.white,
          ...leftIconStyle
        }} />
        <Text style={{ ...styles.titleStyle, color: isDarkMode ? MyDarkTheme.colors.text : colors.black, ...titleStyle }}>{leftTitle}</Text>
      </View>
      <View style={{
        flexDirection: "row",
        alignItems: "center"
      }}>
        {isRight ? <View >
          {!isRightText ? <ButtonImage image={rightIcon} onPress={onPressRight} imgStyle={{
            ...rightImgStyle
          }} /> : <TouchableOpacity disabled={disabled} onPress={onPressRight}><Text style={{ ...styles.rightTxt, color: isDarkMode ? MyDarkTheme.colors.text : colors.redB, ...rightTxtStyle }}>{rightText}</Text></TouchableOpacity>}
        </View>

          : <React.Fragment />}
        {isRight2 ? <View style={{
          marginLeft: moderateScale(12)
        }} >
          {!isRightText2 ? <ButtonImage image={rightIcon2} onPress={onPressRight2} imgStyle={{
            height: moderateScale(24),
            width: moderateScale(24),
            ...rightImgStyle2
          }} /> : <TouchableOpacity disabled={disabled} onPress={onPressRight2}><Text style={{ ...styles.rightTxt, color: isDarkMode ? MyDarkTheme.colors.text : colors.redB, ...rightTxtStyle }}>{rightText}</Text></TouchableOpacity>}
        </View>
          : <React.Fragment />}
      </View>
    </View>
  );
};

export function stylesFunc({ fontFamily }) {
  const styles = StyleSheet.create({
    leftIcon: {
      height: moderateScale(36),
      width: moderateScale(36),
      borderRadius: moderateScale(4),
      elevation: 1,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,

      alignItems: "center",
      justifyContent: "center"
    },
    headerContainerStyle: {
      paddingVertical: moderateScaleVertical(10),
      paddingHorizontal: moderateScale(16),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",

    },
    titleStyle: {
      fontFamily: fontFamily?.regular,
      fontSize: textScale(16),
      color: colors.black,
      marginLeft: moderateScale(16)
    },
    rightTxt: {
      fontFamily: fontFamily?.regular,
      fontSize: textScale(12),
      color: colors.redB,

    }
  });
  return styles;
}
export default React.memo(OoryksHeader);
