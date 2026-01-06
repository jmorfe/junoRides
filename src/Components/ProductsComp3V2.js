import React from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { getImageUrlNew, tokenConverterPlusCurrencyNumberFormater } from '../utils/commonFunction';
import {
  getScaleTransformationStyle,
  pressInAnimation,
  pressOutAnimation
} from '../utils/helperFunctions';
import { getColorSchema } from '../utils/utils';
let imageHeight = 160
let imageWidth = 160
let imageRadius = 8


const ProductsComp = ({ isDiscount, item, imageStyle, onPress = () => { }, numberOfLines = 1, containerStyle = {} }) => {
  const { themeColors, appStyle, currencies, themeColor, themeToggle, appData } = useSelector((state) => state?.initBoot || {});
  const { additional_preferences, digit_after_decimal } = useSelector((state) => state?.initBoot?.appData?.profile?.preferences || {});
  const priceType=useSelector(state => state?.home?.priceType);
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;
  const scaleInAnimated = new Animated.Value(0);

  const { appMainData, dineInType } = useSelector((state) => state?.home || {});

  const { category = {} } = item || {};

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={{
        backgroundColor: isDarkMode ? colors.whiteOpacity15 : colors.white,
        width: imageWidth,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1, },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        margin: 1,
        borderRadius: imageRadius,
        ...containerStyle,
        ...getScaleTransformationStyle(scaleInAnimated),

      }}
      onPressIn={() => pressInAnimation(scaleInAnimated)}
      onPressOut={() => pressOutAnimation(scaleInAnimated)}>

      {dineInType == "p2p" &&
        <View
          style={{
            height: moderateScaleVertical(20),
            backgroundColor: item?.type_id == 10 ? colors.purple : colors.blue,
            position: "absolute",
            zIndex: 1,
            alignItems: "center",
            justifyContent: "center",
            top: 4,
            padding: 3,
            borderRadius: moderateScale(3),
          }}>
          <Text style={{
            fontFamily: fontFamily?.regular,
            fontSize: textScale(10),
            color: colors.white
          }}>{item?.type_id == 10 ? "For Rent" : "For Sale"}</Text>
        </View>
      }
      <FastImage
        resizeMode={FastImage.resizeMode.contain}
        source={{
          uri: getImageUrlNew({
            url: item?.path || null,
            image_const_arr: appMainData.image_prefix,
            type: 'image_fill',
          }),
          cache: FastImage.cacheControl.immutable,
          priority: FastImage.priority.high,
        }}
        style={{
          height: imageHeight,
          width: imageWidth,
          borderTopLeftRadius: imageRadius,
          borderTopRightRadius: imageRadius,
          backgroundColor: isDarkMode ? colors.whiteOpacity22 : colors.white,
          ...imageStyle,
        }}
        imageStyle={{
          borderRadius: moderateScale(10),
          backgroundColor: isDarkMode
            ? colors.whiteOpacity15
            : colors.greyColor,
        }}>



      </FastImage>
      <View style={{ marginVertical: moderateScaleVertical(8) }}>
        <View style={{
          alignSelf: 'flex-start',
          marginBottom: moderateScaleVertical(4)
        }} >

          {!!item?.averageRating && item?.averageRating !== '0.0' && (
            <View style={styles.hdrRatingTxtView}>
              <Text
                style={{
                  ...styles.ratingTxt,
                  fontFamily: fontFamily.medium,
                }}>
                {Number(item?.averageRating).toFixed(1)}
              </Text>
              <Image
                style={styles.starImg}
                source={imagePath.star}
                resizeMode="contain"
              />
            </View>
          )}
        </View>
        <Text
          numberOfLines={numberOfLines}
          style={{
            fontSize: textScale(13),
            fontFamily: fontFamily.medium,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            textAlign: 'left',
            marginLeft: moderateScale(8),
          }}>
          {item?.title}
        </Text>

        {!!item?.vendor_name ? <Text
          numberOfLines={1}
          style={{
            fontSize: textScale(12),
            fontFamily: fontFamily.regular,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.blackOpacity66,
            textAlign: 'left',
            marginLeft: moderateScale(8),
            marginBottom: moderateScaleVertical(4)
          }}>
          {item?.vendor_name || ''}
        </Text> : null}
        {(!item?.hasOwnProperty('compare_price_numeric') || Number(item?.compare_price_numeric) == 0) ? (
          <View style={{ flexDirection: 'row', marginHorizontal: moderateScale(8) }}>
            {priceType !== "freelancer" && <Text
              style={{
                fontSize: textScale(12),
                // fontFamily: fontFamily.bold,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {tokenConverterPlusCurrencyNumberFormater(
                item?.price_numeric,
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
                currencies
              )}{item?.type_id == 10 ? "/day" : ""}
            </Text>}
            {!!category?.category_detail?.translation[0]?.name && (
              <Text
                numberOfLines={2}
                style={{
                  fontSize: textScale(9),
                  fontFamily: fontFamily.regular,
                  marginLeft: moderateScale(4),
                  flex: 1,
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity66,
                }}>
                {category?.category_detail?.translation[0]?.name || category}
              </Text>
            )}
          </View>
        ) : (
          <View>
            {!!category?.category_detail?.translation[0]?.name && (
              <Text
                style={{
                  ...styles.inTextStyle,
                  fontFamily: fontFamily.regular,
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity66,
                  marginLeft: moderateScale(5),
                  marginVertical: moderateScaleVertical(2)
                }}>
                {strings.IN} {category?.category_detail?.translation[0]?.name}
              </Text>
            )}
            {/* {(!!appData?.profile?.preferences?.is_service_product_price_from_dispatch && dineInType === "on_demand" &&   */}
            {(priceType!='freelancer') && <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: moderateScale(9),
                flexWrap: 'wrap',
              }}>
              <Text
                style={{
                  fontSize: textScale(12),
                  fontFamily: fontFamily.medium,
                  color: colors.green,
                }}>
                {tokenConverterPlusCurrencyNumberFormater(
                  item?.price_numeric,
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol,
                )}
              </Text>
              <Text
                numberOfLines={2}
                style={{
                  fontSize: textScale(12),
                  fontFamily: fontFamily.medium,
                  textDecorationLine: 'line-through',
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity40,
                  marginLeft: moderateScale(12),
                }}>
                {tokenConverterPlusCurrencyNumberFormater(
                  item?.compare_price_numeric,
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol,
                )}
              </Text>
            </View>}
          </View>
        )}
      </View>
      {dineInType !== "p2p" && priceType !== "freelancer" && !!Number(item?.compare_price_numeric) ?
        <View
          style={{
            position: 'absolute',
            backgroundColor: themeColors?.primary_color,
            paddingVertical: moderateScaleVertical(4),
            paddingHorizontal: moderateScale(6),
            borderTopLeftRadius: moderateScale(6),
            borderBottomRightRadius: moderateScale(10),
          }}>
          <Text style={{
            fontSize: textScale(11),
            color: colors.white,
            fontFamily: fontFamily.medium,
          }}>{parseInt(((item?.compare_price_numeric - item?.price_numeric) / item?.compare_price_numeric * 100).toFixed(3))}% OFF</Text>
        </View>
        : null}

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  hdrRatingTxtView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.green,
    paddingVertical: moderateScale(2),
    paddingHorizontal: moderateScale(4),
    borderTopRighttRadius: moderateScale(6),
    // borderBottomLeftRadius: moderateScale(10),


    // marginTop: moderateScaleVertical(16),
  },
  ratingTxt: {
    textAlign: 'left',
    color: colors.white,
    fontSize: textScale(9),
    textAlign: 'left',
  },
  starImg: {
    tintColor: colors.white,
    marginLeft: 2,
    width: 9,
    height: 9,
  },
  inTextStyle: {
    fontSize: textScale(9),
    width: width / 3,
    textAlign: 'left',
  },
});

export default React.memo(ProductsComp);




