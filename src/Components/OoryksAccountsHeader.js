import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  I18nManager,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import {
  StatusBarHeight,
  moderateScale,
  textScale,
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { getColorSchema } from '../utils/utils';

const OoryksAccountsHeader = ({
  leftIcon = imagePath.back,
  centerTitle,
  textStyle = {},
  leftTitle,
  lefticonTitle,
  horizontLine = true,
  rightIcon = '',
  onPressLeft,
  onPressRight,
  customRight,
  hideRight = true,
  headerStyle,
  noLeftIcon = false,
  rightViewStyle = {},
  customLeft,
  rightIconStyle = {},
  showImageAlongwithTitle = false,
  imageAlongwithTitle = imagePath.dropDownSingle,
  imageAlongwithTitleStyle = { tintColor: colors.black },
  onPressImageAlongwithTitle,
  onPressCenterTitle,
  leftIconStyle,
  isRightText = false,
  onPressRightTxt = () => { },
  rightTxt = strings.CLEAR_CART2,
  rightTxtContainerStyle = {},
  rightTxtStyle = {},
  isShareIcon,
  onShare,
  shareIconStyle = {},
  centerTitleViewStyle = {},
}) => {
  const { appStyle, themeColors, themeToggle, themeColor, redirectedFrom } =
    useSelector(state => state?.initBoot);

  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ fontFamily });
  const navigation = useNavigation();
  return (
    <>
      <View
        style={{
          ...styles.headerStyle,
          ...headerStyle,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            alignItems: 'flex-start',
            flex: 0.4,
            ...rightViewStyle,
          }}>
          {leftTitle ? (
            <Text
              onPress={onPressCenterTitle}
              numberOfLines={1}
              style={{
                ...styles.textStyle,
                ...textStyle,
                color: isDarkMode ? colors.white : colors.headingBlack,
              }}>
              {leftTitle}
            </Text>
          ) : null}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {!noLeftIcon &&
              (customLeft ? (
                customLeft()
              ) : (
                <TouchableOpacity
                  hitSlop={{
                    top: 50,
                    right: 50,
                    left: 50,
                    bottom: 50,
                  }}
                  activeOpacity={0.7}
                  onPress={
                    !!onPressLeft ? onPressLeft : () => navigation.goBack()
                  }>
                  <Image
                    resizeMode="contain"
                    source={leftIcon}
                    style={{
                      ...leftIconStyle,
                      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                      tintColor: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    }}
                  />
                </TouchableOpacity>
              ))}
            {lefticonTitle ? (
              <Text
                numberOfLines={1}
                style={{
                  ...styles.textStyle,
                  marginLeft: moderateScale(15),
                  fontSize: textScale(18),
                  width: moderateScale(300),
                  color: isDarkMode ? colors.white : colors.headingBlack,
                }}>
                {lefticonTitle}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
          {isRightText ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onPressRightTxt}
              style={{ ...rightTxtContainerStyle }}>
              <Text
                style={{
                  fontFamily: fontFamily.medium,
                  color: themeColors.primary_color,
                  fontSize: textScale(12),
                  ...rightTxtStyle,
                  color: isDarkMode ? colors.white : colors.black,
                }}>
                {rightTxt}
              </Text>
            </TouchableOpacity>
          ) : !!rightIcon ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={onPressRight}>
                <Image
                  style={
                    isDarkMode
                      ? {
                        transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                        ...leftIconStyle,
                        tintColor: MyDarkTheme.colors.text,
                      }
                      : rightIconStyle
                  }
                  source={rightIcon}
                />
              </TouchableOpacity>
              {!!isShareIcon ? (
                <TouchableOpacity
                  onPress={onShare}
                  activeOpacity={0.8}
                //  hitSlop={{
                //   top: 50,
                //   right: 50,
                //   left: 50,
                //   bottom: 50,
                // }}
                >
                  <Image
                    style={{
                      ...shareIconStyle,
                      tintColor: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                      marginLeft: moderateScale(16),
                    }}
                    source={isShareIcon}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          ) : !!customRight ? (
            customRight()
          ) : hideRight ? (
            <View style={{ width: 25 }} />
          ) : (
            <Image source={imagePath.cartShop} />
          )}
        </View>
      </View>
    </>
  );
};

export function stylesFunc({ fontFamily }) {
  const styles = StyleSheet.create({
    headerStyle: {
      // padding: moderateScaleVertical(16),
      paddingHorizontal: moderateScale(16),
      height: StatusBarHeight,
    },

    textStyle: {
      color: colors.black2Color,
      fontSize: textScale(18),
      lineHeight: textScale(28),

      fontFamily: fontFamily.medium,
    },
  });
  return styles;
}
export default React.memo(OoryksAccountsHeader);
