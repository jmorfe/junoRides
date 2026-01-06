import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import colors from '../../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  width
} from '../../../../styles/responsiveSize';
import { getImageUrl } from '../../../../utils/helperFunctions';
import { getColorSchema } from '../../../../utils/utils';



const HomeCategoryCard8 = ({
    item,
    index,
    onPress = () => { },
}) => {
    const theme = useSelector((state) => state?.initBoot?.themeColor);
    const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
    const darkthemeusingDevice = getColorSchema();
    const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
    const { appStyle } = useSelector((state) => state?.initBoot);
    const fontFamily = appStyle?.fontSizeData;

    let imageURI = getImageUrl(
        item?.icon?.image_fit,
        item?.icon?.image_path,
        '500/500',
      );
      const isSVG = imageURI ? imageURI.includes('.svg') : null;
      return (
        <View
          style={{
            width: 'auto',
          }}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              flex: 1,
              backgroundColor: !!theme ? colors.whiteOpacity15 : '#EFEFEF',
              borderRadius: moderateScale(12),
              height: moderateScale(100),
              width: width / 3.5,
              marginHorizontal: moderateScale(4),
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={onPress}>
            {isSVG ? (
              <SvgUri
                height={moderateScale(50)}
                width={moderateScale(50)}
                uri={imageURI}
              />
            ) : (
              <FastImage
                source={{
                  uri: imageURI,
                  cache: FastImage.cacheControl.immutable,
                  priority: FastImage.priority.high,
                }}
                resizeMode={'contain'}
                style={{
                  height: moderateScale(50),
                  width: moderateScale(50),
                }}
              />
            )}
            <Text
              style={{
                fontFamily: fontFamily.regular,
                marginTop: moderateScaleVertical(5),
                color: theme ? colors.white : colors.black,
                textAlign: 'center',
              }}>
              {item?.name || (item?.translation && item?.translation[0]?.name)}
            </Text>
          </TouchableOpacity>
        </View>
      );
};


export default HomeCategoryCard8;
