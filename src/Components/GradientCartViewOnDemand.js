import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {MaterialIndicator} from 'react-native-indicators';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import commonStylesFun from '../styles/commonStyles';
import {moderateScale, width} from '../styles/responsiveSize';
import {getColorCodeWithOpactiyNumber} from '../utils/helperFunctions';
import BrowseMenuButton from './BrowseMenuButton';

const GradientCartViewOnDemand = ({
  containerStyle,
  btnStyle = {},
  //colorsArray = [themeColors?.primary_color, themeColors?.primary_color],
  borderRadius = 13,
  onPress,
  btnText,
  marginTop = 0,
  marginBottom = 0,
  textStyle = {},
  indicator = false,
  endcolor = {},
  startcolor = {},
  colorsArray = null,
  indicatorColor = '#0000ff',
  disabled = false,
  onMenuTap,
  ifCartShow,
  isMenuBtnShow,
  isLoading = false,
  sectionListData = [],
  isCategoryExist = false,
  btnText2 = '',
  textStyle2,
}) => {
  const {appStyle, themeColors} = useSelector(state => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const buttonTextColor = themeColors;

  const commonStyles = commonStylesFun({fontFamily, buttonTextColor});
  const [zoomIn, setZoomIn] = useState(true);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // setTimeout(() => {
    //   setZoomIn(false)
    // }, 1000);

    // setTimeout(() => {
    //   setShowText(true)
    // }, 1500);
    setTimeout(() => {
      setZoomIn(false);
    }, 100);

    setTimeout(() => {
      setShowText(true);
    }, 300);
  }, []);

  const zoomOut = {
    0: {
      opacity: 0,
      scale: 0,
    },
    0.5: {
      opacity: 1,
      scale: 0.3,
    },
    1: {
      opacity: 1,
      scale: 1,
    },
  };

  const expand = {
    0: {
      opacity: 1,
      scale: 1,
      width: 58,
    },
    0.5: {
      opacity: 1,
      scale: 1,
      width: 200,
    },
    1: {
      opacity: 1,
      scale: 1,
      width: width,
    },
  };

  const textOpacity = {
    0: {
      marginLeft: -100,
    },
    0.5: {
      marginLeft: -70,
    },
    1: {
      marginLeft: 20,
    },
  };

  const menuBtnAnimation = {
    0: {
      marginBottom: -70,
    },
    0.5: {
      marginBottom: -40,
    },
    1: {
      marginBottom: 0,
    },
  };

  const menuBtnAnimationReverse = {
    0: {
      marginBottom: 80,
    },
    0.5: {
      marginBottom: 40,
    },
    1: {
      marginBottom: 0,
    },
  };

  const themePrimaryColor = !!themeColors?.primary_color
    ? themeColors?.primary_color
    : '	#00FFFF';

  return (
    <View>
      {isMenuBtnShow ? (
        <Animatable.View
          duration={400}
          animation={ifCartShow ? menuBtnAnimation : menuBtnAnimationReverse}>
          {sectionListData.length > 1 ? (
            <BrowseMenuButton
              fontFamily={fontFamily}
              onMenuTap={onMenuTap}
              // containerStyle={{ marginBottom: moderateScale(-58) }}
            />
          ) : null}
        </Animatable.View>
      ) : null}

      {ifCartShow && (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
          <Animatable.View
            style={{
              ...commonStyles.buttonRect,
              borderWidth: 0,
              marginTop,
              marginBottom,
              height: moderateScale(60),
              width: moderateScale(65),
              borderRadius: 0,
              ...containerStyle,
            }}
            animation={zoomIn ? zoomOut : expand}
            duration={500}>
            <LinearGradient
              start={{x: 0.0, y: -1.5}}
              end={{x: 0.5, y: 1.0}}
              // end={endcolor}
              style={{
                height: '100%',
                alignItems: 'center',
                // justifyContent: 'space-between',
                flexDirection: 'row',
                width: '100%',
                marginBottom: moderateScale(40),
                paddingRight: moderateScale(4),
                // paddingLeft: moderateScale(20),
                // borderRadius: 100,
                ...btnStyle,
              }}
              colors={
                colorsArray
                  ? colorsArray
                  : [
                      themePrimaryColor,
                      getColorCodeWithOpactiyNumber(
                        themePrimaryColor.substr(1),
                        70,
                      ),
                    ]
              }>
              {showText && (
                <Animatable.View>
                  <Animatable.Text
                    duration={500}
                    animation={showText ? textOpacity : null}
                    style={{
                      ...commonStyles.buttonTextWhite,
                      color: colors.white,
                      ...textStyle,
                    }}>
                    {btnText}
                  </Animatable.Text>
                  <Animatable.Text
                    duration={500}
                    animation={showText ? textOpacity : null}
                    style={{
                      ...commonStyles.buttonTextWhite,
                      color: colors.blackOpacity43,
                      fontFamily: fontFamily.regular,
                      textTransform: 'capitalize',
                      fontSize: 12,
                      ...textStyle2,
                    }}>
                    {btnText2}
                  </Animatable.Text>
                </Animatable.View>
              )}
              <Animatable.View
                animation={zoomOut}
                duration={500}
                style={{
                  width: moderateScale(180),
                  height: moderateScale(50),
                  // borderRadius: moderateScale(50),
                  backgroundColor: 'black',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  right: showText ? moderateScale(10) : 0,
                }}>
                {isLoading && (
                  <MaterialIndicator
                    color="#fff"
                    style={{position: 'absolute', opacity: 0.8}}
                    size={moderateScale(55)}
                    trackWidth={moderateScale(4.5)}
                  />
                )}
                <Text
                  style={{
                    fontFamily: fontFamily.regular,
                    fontSize: 14,
                    color: colors.white,
                  }}>
                  Go to Cart
                </Text>
                {/* <Image source={imagePath.cartIcon} /> */}
              </Animatable.View>
            </LinearGradient>
          </Animatable.View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default React.memo(GradientCartViewOnDemand);
