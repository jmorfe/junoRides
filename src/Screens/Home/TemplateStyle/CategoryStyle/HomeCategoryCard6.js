import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import colors from '../../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale
} from '../../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../../styles/theme';
import { getImageUrl } from '../../../../utils/helperFunctions';
import { getColorSchema } from '../../../../utils/utils';

const HomeCategoryCard6 = ({
  data = {},
  onPress = () => { },
  isLoading = false,
}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const { appStyle } = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;

  const imageURI = getImageUrl(
    data?.icon?.image_fit,
    data?.icon?.image_path,
    '160/160',
  );

  const isSVG = imageURI ? imageURI.includes('.svg') : null;

  const onLoad = (evl) => { };

  let imgHeight =
    appStyle?.homePageLayout === 5 ? moderateScale(80) : moderateScale(75);
  let imgWidth =
    appStyle?.homePageLayout === 5 ? moderateScale(80) : moderateScale(75);
  let imgRadius =
    appStyle?.homePageLayout === 5 ? moderateScale(40) : moderateScale(25);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        // width: (width - moderateScale(16)) / 4,
        marginVertical: moderateScale(0),
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          flex: 0.8,
          borderRadius: moderateScale(8),
          width: moderateScale(80),
          height: moderateScale(80),
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: colors.textGreyLight,
          borderWidth: 0.5,
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
      <View style={{ flex: 0.2 }}>
        <Text
          // numberOfLines={1}
          style={{
            color: isDarkMode ? MyDarkTheme.colors.text : colors.blackOpacity70,
            fontFamily: fontFamily.regular,
            fontSize: textScale(11),
            textAlign: 'center',
            marginTop: moderateScaleVertical(4),
            width: moderateScale(80),
          }}>
          {data.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default React.memo(HomeCategoryCard6);
const styles = StyleSheet.create({});