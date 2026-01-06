import { isEmpty } from 'lodash';
import React from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import StarRating from 'react-native-star-rating';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { getImageUrlNew, tokenConverterPlusCurrencyNumberFormater } from '../utils/commonFunction';
import {
  getScaleTransformationStyle,
  pressInAnimation,
  pressOutAnimation
} from '../utils/helperFunctions';
import { getColorSchema } from '../utils/utils';

const ProductsComp = ({
  isDiscount,
  item,
  imageStyle,
  onPress = () => { },
  mainContainerStyle = {},
  showRating = true,
  productNameStyle = {},
  numberOfLines = 1,
}) => {
  const { themeColors, appStyle, currencies, themeColor, themeToggle } =
    useSelector(state => state?.initBoot);
  const { appMainData } = useSelector((state) => state?.home || {});

  const { additional_preferences, digit_after_decimal } = useSelector(
    state => state?.initBoot?.appData?.profile?.preferences,
  );
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;

  const scaleInAnimated = new Animated.Value(0);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={{
        width: width / 2.5,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.lightDark
          : colors.white,
        elevation: 1,
        marginVertical: 2,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 7,
        },
        shadowOpacity: 0.1,
        ...getScaleTransformationStyle(scaleInAnimated),
        ...mainContainerStyle,
      }}
      onPressIn={() => pressInAnimation(scaleInAnimated)}
      onPressOut={() => pressOutAnimation(scaleInAnimated)}>


      <View style={{
        height: moderateScale(100),
        width: width / 2.5,
        borderTopLeftRadius: moderateScale(8),
        borderTopRightRadius: moderateScale(8),
        overflow: "hidden"
      }}>
        <View style={{
          height: moderateScaleVertical(20),
          backgroundColor: item?.type_id == 10 ? colors.purple : colors.blue,
          position: "absolute",
          zIndex: 1,
          alignItems: "center",
          justifyContent: "center",
          top: 4,
          padding: 3,
          borderRadius: moderateScale(3)
        }}>
          <Text style={{
            fontFamily: fontFamily?.regular,
            fontSize: textScale(10),
            color: colors.white
          }}>{item?.type_id == 10 ? "For Rent" : "For Sale"}</Text>
        </View>
        <FastImage
          resizeMode="cover"
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
            height: moderateScale(100),
            width: width / 2.5,
            ...imageStyle,
          }}
        />
        <View style={{
          height: moderateScale(100),
          width: width / 2.5,
          backgroundColor: colors.blackOpacity20,
          position: "absolute",
          flexDirection: "row"
        }} >
          <Text
            numberOfLines={numberOfLines}
            style={{
              fontSize: textScale(13),
              fontFamily: fontFamily.medium,
              color: colors.white,
              textAlign: 'left',
              lineHeight: moderateScale(16),
              margin: moderateScale(5),
              alignSelf: "flex-end",
              ...productNameStyle,
            }}>
            {isEmpty(item?.translation)? item?.title:item?.translation[0]?.title || item?.title || item?.sku}
          </Text>
        </View>
      </View>
      <View
        style={{
          marginVertical: moderateScaleVertical(6),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View>
          <Text
            numberOfLines={1}
            style={{
              fontSize: textScale(14),
              fontWeight: '700',
              fontFamily: fontFamily.regular,
              marginVertical: moderateScaleVertical(4),
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              textAlign: 'left',
              marginLeft: moderateScale(5),
            }}>
            <Text>
              {tokenConverterPlusCurrencyNumberFormater(
                item?.price_numeric,
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
              )}{item?.type_id == 10 ? "/day" : ""}
            </Text>
          </Text>
          <StarRating
            starStyle={{
              width: moderateScale(19),
              height: moderateScaleVertical(15),
            }}
            disabled={false}
            maxStars={5}
            emptyStar={imagePath.ic_star}
            rating={Number(item?.averageRating).toFixed(0)}
            // selectedStar={(rating) => onStarRatingPress(rating)}
            fullStarColor={colors.ORANGE}
            containerStyle={{ width: width / 9 }}
            starSize={15}
          />
        </View>

        {/* <ButtonImage image={imagePath.ic_right_arrow} /> */}
      </View>
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
    alignSelf: 'flex-start',
    borderRadius: moderateScale(2),
    marginTop: moderateScaleVertical(16),
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
