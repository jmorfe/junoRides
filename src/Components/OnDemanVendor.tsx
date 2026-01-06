import React, { FC } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Grayscale } from 'react-native-color-matrix-image-filters';
import { getBundleId } from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import strings from '../constants/lang';
import colors from '../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { getImageUrlNew } from '../utils/commonFunction';
import { appIds } from '../utils/constants/DynamicAppKeys';
import {
  getColorCodeWithOpactiyNumber
} from '../utils/helperFunctions';
import { getColorSchema } from '../utils/utils';

interface lineOfSightDistanceInterface {
  lineOfSightDistance?: string | number;
  is_vendor_closed?: boolean;
  timeofLineOfSightDistance?: string | number;
  closed_store_order_scheduled?: number;
  delaySlot?: string;
  product_avg_average_rating?: number;
  categoriesList?: string;
  path?: string | object | null;
  logo?: string | object | null;
  show_slot?: boolean | number;
  name?: string;
  banner?: string | object | null;
}

interface CompProps {
  data: lineOfSightDistanceInterface;
  onPress: () => {};
  extraStyles?: {};
  fastImageStyle?: {};
  isMaxSaftey?: true;
}

const OnDemanVendor: FC<CompProps> = ({
  data,
  onPress,
  extraStyles,
  fastImageStyle,
  isMaxSaftey,
}: CompProps) => {
  const { appStyle, themeColors, themeColor, appData, themeToggle } = useSelector(
    (state: any) => state?.initBoot || {},
  );

  let vendorDistance: any = 0;
  if (!!data?.lineOfSightDistance) {
    vendorDistance =
      typeof data?.lineOfSightDistance == 'string'
        ? parseInt(data?.lineOfSightDistance.split(' ')[0])
        : data.lineOfSightDistance.toFixed(0);
  }

  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ fontFamily, extraStyles, MyDarkTheme, isDarkMode });


  const appMainData = useSelector((state: any) => state?.home?.appMainData || {});

 

  let imageUrl = getImageUrlNew({
    url: data?.logo || data?.banner || data?.path || data?.logo || null,
    image_const_arr: appMainData.image_prefix,
    type: 'image_fill',
    height: (height * 2 / 2).toFixed(0),
    width: width.toFixed(0),
  });


  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={{
        ...styles.mainTouchContainer,
        backgroundColor: 'transparent'
      }}
    >
      <View>
        {!!data?.is_vendor_closed && !!data?.closed_store_order_scheduled ? (
          <View>
            <View style={{ justifyContent: 'center' }}>
              <FastImage
                source={{
                  uri: imageUrl,
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,
                }}
                style={{
                  ...styles.mainImage,
                  ...fastImageStyle,
                }}
              />
              <View style={styles.vendorScheduledView}>
                <Text style={styles.vendorScheduledText}>
                  {getBundleId() == appIds.masa
                    ? `${strings.WE_ACCEPT_ONLY_SCHEDULE_ORDER} ${data?.delaySlot} `
                    : ` ${strings.WE_ARE_NOT_ACCEPTING} ${data?.delaySlot} `}
                </Text>
              </View>
            </View>
          </View>
        ) : !!data?.is_vendor_closed &&
          data?.closed_store_order_scheduled == 0 ? (
          <Grayscale>
            <View
              style={{
                justifyContent: 'center',
                backgroundColor: colors.blackOpacity86,
              }}>
              <FastImage
                source={{
                  uri: imageUrl,
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,
                }}
                style={{
                  ...styles.mainImage,
                  ...fastImageStyle,
                  opacity: 0.2,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <Text style={{ ...styles.currentlyUnavailable }}>
                {strings.CURRENTLYUNAVAILABLE}
              </Text>
            </View>
          </Grayscale>
        ) : (
          <FastImage
            source={{
              uri: imageUrl,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
            style={{
              ...styles.mainImage,
              ...fastImageStyle,
            }}
            resizeMode={FastImage.resizeMode.cover} />
        )}
      </View>
      
          <Text
            numberOfLines={3}
            style={{
              ...styles.categoryText,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}>
            {data.name} 
          </Text>
       
    </TouchableOpacity>
  );
};

export function stylesFunc({
  fontFamily,
  extraStyles,
}: any) {
  const styles = StyleSheet.create({
    mainTouchContainer: {
      overflow:'hidden',
      marginRight:moderateScale(10),
      minHeight: moderateScale(100),
      maxWidth:moderateScale(100),
      borderRadius:moderateScale(8),
      ...extraStyles,
    },
    categoryText: {
      fontSize: textScale(14),
      color: colors.black,
      fontFamily: fontFamily.regular,
      textAlign: 'left',
      marginTop:moderateScaleVertical(6),
      marginHorizontal:moderateScale(2),
    },
    mainImage: {
      height: moderateScale(100),
      width:moderateScale(100),
      borderRadius:moderateScale(8),
    },

    currentlyUnavailable: {
      position: 'absolute',
      alignSelf: 'center',
      fontSize: textScale(12),
      color: colors.white,
      fontFamily: fontFamily?.bold,
    },
    vendorScheduledView: {
      position: 'absolute',
      bottom: moderateScaleVertical(1),
      // width: moderateScale(width / 1.2),
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      // paddingHorizontal: moderateScale(6),
    },
    vendorScheduledText: {
      color: colors.white,
      fontSize: textScale(14),
      fontFamily: fontFamily.medium,
      textAlign: 'center',
      paddingHorizontal: moderateScaleVertical(4),
      backgroundColor: getColorCodeWithOpactiyNumber(
        colors.black.substring(1),
        60,
      ),
    },
  });
  return styles;
}
export default React.memo(OnDemanVendor);
