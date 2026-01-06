//import liraries
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { getColorSchema } from '../utils/utils';
import GradientButton from './GradientButton';

// create a component
const AtlanticBottom = ({
  Totalprice,
  total,
  Pricedetails,
  details,
  btnText,
  textStyle,
    onPress,
  buttonLoader=false
}) => {
  const {themeColor, themeToggle,themeColors} = useSelector(state => state?.initBoot || {});

  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  return (
    
    <View style={[styles.buttonview,{backgroundColor:isDarkMode?MyDarkTheme.colors.lightDark:colors.white}]}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between',marginBottom:moderateScaleVertical(10)}}>
        <Text
          style={{fontSize: textScale(16), fontFamily: fontFamily.semiBold,color:isDarkMode?MyDarkTheme.colors.text:colors.black}}>
          {Totalprice}
        </Text>
        <Text
          style={{
            fontSize: textScale(16),
            color: themeColors?.primary_color,
            fontFamily: fontFamily.semiBold,
            
          }}>
          {total}
        </Text>
      </View>
      <GradientButton
        onPress={onPress}
        btnStyle={styles.button}
        btnText={btnText}
        textStyle={textStyle}
        disabled={!!buttonLoader?true:false}
        indicator={buttonLoader}
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  buttonview: {
    padding: moderateScale(16),
    // height: moderateScaleVertical(120),
    width: width,
    position: 'absolute',
    bottom: 0,
    backgroundColor: colors.white,
  },
  button: {
    height: moderateScaleVertical(40),
    borderRadius: moderateScale(4),
    marginBottom: moderateScaleVertical(16),
  },
});

//make this component available to the app
export default AtlanticBottom;
