import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import strings from '../constants/lang';
import navigationStrings from '../navigation/navigationStrings';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { getColorCodeWithOpactiyNumber, getImageUrl } from '../utils/helperFunctions';
import { getColorSchema } from '../utils/utils';

const HomeCategoryCard3 = ({
  data = {},
  onPress = () => { },
  isLoading = false,
  applyRadius = null,
  categoryHieght = moderateScaleVertical(78),
  categoryWidth = moderateScale(78),
  index = 0,
  priceType = "vendor"
}) => {

  const { themeColor, themeToggle, themeColors, appStyle } = useSelector((state) => state?.initBoot);
  const { dineInType } = useSelector((state) => state?.home || {});


  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;

  const imageURI = getImageUrl(
    data?.icon?.image_fit,
    data?.icon?.image_path,
    '120/120',
  );

  const isSVG = imageURI ? imageURI.includes('.svg') : null;

  const onLoad = (evl) => { };

  let imgHeight = moderateScale(categoryHieght);
  let imgWidth = moderateScale(categoryWidth);
  let imgRadius = moderateScale(!!applyRadius ? applyRadius : 0);

  const navigation = useNavigation()

  if (index == 7) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => dineInType === "p2p" ? navigation.navigate(navigationStrings.ALL_CATEGORIES) : navigation.navigate(navigationStrings.CATEGORY, {
          data: {
            priceType: priceType
          }
        })}
      >
        <View style={{
          height: imgHeight,
          width: imgWidth,
          borderRadius: imgRadius,
          backgroundColor: getColorCodeWithOpactiyNumber(
            themeColors?.primary_color.substr(1),
            20,
          ),
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Text
            style={{
              color: themeColors?.primary_color,
              fontFamily: fontFamily.medium,
              fontSize: textScale(10),
              textAlign: 'center',
              width: moderateScale(80),
            }}>
            {strings.VIEW_ALL}
          </Text>

        </View>
      </TouchableOpacity>
    )
  }
  if (index < 7) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={{
          marginVertical: moderateScale(0),
          justifyContent: 'center',
          alignItems: 'center',
          width: moderateScale((width / 5)),
          marginRight:moderateScale(8),
          backgroundColor:colors.blackOpacity02,
          borderRadius:moderateScale(8),
          overflow:'hidden'
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
              resizeMode="contain"
              onLoad={onLoad}
            />
          </View>
        )}


        <Text
          numberOfLines={1}
          style={{
            color: isDarkMode ? MyDarkTheme.colors.blackOpacity70 : colors.blackOpacity70,
            fontFamily: fontFamily.medium,
            fontSize: textScale(10),
            textAlign: 'center',
            marginTop: moderateScaleVertical(4),
            width: moderateScale(80),
          }}>
          {data.name}
        </Text>
      </TouchableOpacity>
    );
  }
  return null

};
export default React.memo(HomeCategoryCard3);

