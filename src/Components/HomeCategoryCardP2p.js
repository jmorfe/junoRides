import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { getImageUrl } from '../utils/helperFunctions';
import { getColorSchema } from '../utils/utils';

const HomeCategoryCardP2p = ({
  data = {},
  onPress = () => { },
  isLoading = false,
}) => {
  const theme = useSelector(state => state?.initBoot?.themeColor);
  const toggleTheme = useSelector(state => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const { appStyle } = useSelector(state => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;

  const imageURI = getImageUrl(
    data?.icon?.image_fit,
    data?.icon?.image_path,
    '160/160',
  );

  const isSVG = imageURI ? imageURI.includes('.svg') : null;

  const onLoad = evl => { };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        flex: 1
      }}
    >
      <View
        style={{

          justifyContent: 'center',
          alignItems: 'center',
          borderColor: colors.textGreyLight,
        }}>
        {isSVG ? (
          <SvgUri
            height={moderateScale(60)}
            width={moderateScale(60)}
            uri={imageURI}

          />
        ) : (
          <View>
            <FastImage
              style={{
                height: moderateScale(63),
                width: moderateScale(63),
                borderRadius: moderateScale(12),
                borderWidth: 1,
                borderColor: colors.borderColor,
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
      <View>
        <Text
          numberOfLines={2}
          style={{
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            fontFamily: fontFamily?.regular,
            fontSize: textScale(13),
            textAlign: 'center',
            marginTop: moderateScaleVertical(8)
          }}>
          {data.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default React.memo(HomeCategoryCardP2p);
const styles = StyleSheet.create({});
