import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import colors from '../../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../../styles/responsiveSize';
import { getColorCodeWithOpactiyNumber, getImageUrl } from '../../../../utils/helperFunctions';
import { SvgUri } from 'react-native-svg';
import { MyDarkTheme } from '../../../../styles/theme';
import navigationStrings from '../../../../navigation/navigationStrings';
import strings from '../../../../constants/lang';
import imagePath from '../../../../constants/imagePath';
import { getColorSchema } from '../../../../utils/utils';

const HomeCategoryCard11 = ({
  data = {},
  onPress = () => { },
  isLoading = false,
  index = 0,
  navigation,
  priceType = "vendor"
}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const { appStyle, themeColors } = useSelector((state) => state?.initBoot || {});
  const fontFamily = appStyle?.fontSizeData;

  const imageURI = getImageUrl(
    data?.icon?.image_fit,
    data?.icon?.image_path,
    '160/160',
  );

  const isSVG = imageURI ? imageURI.includes('.svg') : null;

  const onLoad = (evl) => { };

  let imgHeight = moderateScale(60);
  let imgWidth = moderateScale(60);
  let imgRadius = moderateScale(30);

  

  if (index == 4) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.navigate(navigationStrings.CATEGORY, {
          data: {
            priceType: priceType
          }
        })}
        style={{
          // width: (width - moderateScale(16)) / 3,
        }}
      >
        <View style={{
          ...styles.boxStyle,
          backgroundColor: isDarkMode ? colors.whiteOpacity22 : colors.grey5,
        }}>
          <Image style={{
            tintColor: isDarkMode? colors.white: colors.black
          }} source={imagePath.icArrow2} />
        </View>
        <Text
            style={{
              ...styles.textStyle,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              fontFamily: fontFamily.regular,

            }}>
            {strings.SE_ALL_SERVICES}
          </Text>

      </TouchableOpacity>
    )
  }
  if (index < 4) {
    if (index == 0 || index == 1) {
      return (
          <TouchableOpacity
           onPress={onPress}
           activeOpacity={0.9}
            style={{
              ...styles.boxStyle,
              backgroundColor: isDarkMode ? colors.whiteOpacity22 : colors.grey5,
              flexDirection: 'row',
              paddingLeft:moderateScale(16),
              paddingRight:moderateScale(8)
            }}>
            <View style={{flex:0.6,alignItems:'flex-start'}}>
            <Text
              style={{
                ...styles.textStyle,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                fontFamily: fontFamily.regular,
                textAlign: 'left',
              }}
              numberOfLines={3}
              >
              {data.name}
            </Text>
            </View>
            <View style={{flex:0.4,alignItems:'flex-end'}}>
            {isSVG ? (
              <SvgUri
                height={imgHeight}
                width={imgWidth}
                uri={imageURI}
                style={{}}
              />
            ) : (
              <View>
                <FastImage
                  style={{
                    height: imgHeight,
                    width: imgWidth,
                    borderRadius: imgRadius,
                  }}
                  source={{
                    uri: imageURI,
                    cache: FastImage.cacheControl.immutable,
                    priority: FastImage.priority.high,
                  }}
                  resizeMode="cover"
                  onLoad={onLoad}
                />
              </View>
            )}
            </View>
        </TouchableOpacity>
      )
    }
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View
          style={{
            ...styles.boxStyle,
            backgroundColor: isDarkMode ? colors.whiteOpacity22 : colors.grey5
          }}>
          {isSVG ? (
            <SvgUri
              height={imgHeight}
              width={imgWidth}
              uri={imageURI}
              style={{}}
            />
          ) : (
            <View>
              <FastImage
                style={{
                  height: imgHeight,
                  width: imgWidth,
                  borderRadius: imgRadius,
                }}
                source={{
                  uri: imageURI,
                  cache: FastImage.cacheControl.immutable,
                  priority: FastImage.priority.high,
                }}
                resizeMode="cover"
                onLoad={onLoad}
              />
            </View>
          )}
        </View>

        <Text
          style={{
            ...styles.textStyle,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            fontFamily: fontFamily.regular,
          }}>
          {data.name}
        </Text>

      </TouchableOpacity>
    );
  }
  return null;
};
export default React.memo(HomeCategoryCard11);
const styles = StyleSheet.create({
  boxStyle: {
    borderRadius: moderateScale(8),
    minHeight: moderateScale(70),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grey5,
    paddingVertical: moderateScaleVertical(4),
    borderColor: colors.textGreyLight,
    
  },
  textStyle: {
    fontSize: textScale(14),
    textAlign: 'center',
    marginTop: moderateScaleVertical(8),
  }
});