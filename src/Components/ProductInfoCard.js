import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width
} from '../styles/responsiveSize';
import { tokenConverterPlusCurrencyNumberFormater } from '../utils/commonFunction';
import { getColorCodeWithOpactiyNumber, getImageUrl } from '../utils/helperFunctions';
import strings from '../constants/lang';

const ProductInfoCard = ({onPress = () => {}, viewstyle, item,serviveType}) => {
  const {appData, currencies, themeColors} = useSelector(state => state?.initBoot || {});

  const {preferences} = appData?.profile;
  const {additional_preferences, digit_after_decimal} = preferences;

  console.log(item, 'itemitemitemitemitem');
  let imageUrl = !!item?.media[0]
    ? getImageUrl(
        item?.media[0]?.image?.path?.image_fit,
        item?.media[0]?.image?.path?.image_path,
        '1000/1000',
      )
    : null;
  return (
    <TouchableOpacity
      style={{...styles.container, ...viewstyle}}
      onPress={onPress}>
      <FastImage
        source={
          !imageUrl
            ? imagePath.icDefaultImg
            : {
                uri: imageUrl,
                priority: FastImage.priority.high,
                cache: FastImage.cacheControl.immutable,
              }
        }
        style={styles.image}
      />

      <View style={styles.upperview}>
        <View>
          <Text style={styles.carheading}>{item?.title}</Text>
          <View style={styles.cardesc}>
            {item?.transmission || item?.cabins ? (
              <Text style={styles.desc1}>
                {item?.transmission || item?.cabins}{' '}
              </Text>
            ) : null}
            <View
              style={[
                styles.greenDot,
                {
                  backgroundColor: themeColors?.primary_color,
                },
              ]}
            />
            {!!item?.fuel_type || item?.baths ? (
              <Text style={styles.desc2}>
                {' '}
                {item?.fuel_type || item?.baths}{' '}
              </Text>
            ) : null}
            <View
              style={[
                styles.greenDot,
                {
                  backgroundColor: themeColors?.primary_color,
                },
              ]}
            />
            {!!item?.Seats || item?.berths ? (
              <Text style={styles.desc3}>
             
             {`  ${item?.Seats } ${strings.SEATS}`}
              </Text>
            ) : null}
          </View>
        </View>
        {item?.averageRating ? (
          <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
            <Image source={imagePath.star} style={styles.star} />
            <Text style={styles.startext}>{`(${item?.averageRating})`}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.lowerview}>
        <View>
          {/* <Text style={styles.price}>$90/hr </Text> */}
          <Text style={styles.totalprice}>
            {' '}
            {tokenConverterPlusCurrencyNumberFormater(
              Number(item?.variant[0]?.price),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}
          </Text>
        </View>
        {/* {screenName == AvailableCars &&
          ( */}
        <View
          style={[
            styles.lowersmallright,
            {
              backgroundColor: getColorCodeWithOpactiyNumber(
                themeColors?.primary_color?.substr(1),
                10,
              ),
              borderColor: themeColors?.primary_color,
            },
          ]}>
          <Text style={styles.rightlowertext}>{`${(
            item?.vendor?.distance_in_meter / 1000
          ).toFixed(2)} Km away`}</Text>
        </View>
        {/* )} */}
      </View>
    </TouchableOpacity>
  );
};

export default memo(ProductInfoCard);

const styles = StyleSheet.create({
  container: {
    width: width - 30,
    alignSelf: 'center',
    borderRadius: moderateScale(8),
    marginTop: moderateScale(20),
    backgroundColor: '#F2F2F2',
    overflow: 'hidden',
  },
  image: {
    height: height / 5,
    width: '100%',
    resizeMode: 'stretch',
  },
  upperview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    padding: moderateScale(12),
    borderColor: colors.grey1,
  },
  carheading: {
    fontFamily: fontFamily.bold,
    fontSize: textScale(14),
    textTransform: 'capitalize',
  },
  cardesc: {
    flexDirection: 'row',
    marginTop: moderateScaleVertical(4),
    alignItems: 'center',
    justifyContent:'center'
  },
  desc1: {fontSize: textScale(12), color: colors.atlanticgreen},
  desc2: {fontSize: textScale(12), color: colors.atlanticgreen},
  desc3: {fontSize: textScale(12), color: colors.atlanticgreen},
  startext: {
    fontSize: textScale(12),
    fontFamily: fontFamily.bold,
    marginLeft: moderateScale(4),
  },
  price: {
    fontSize: textScale(14),
    fontFamily: fontFamily.bold,
  },
  star: {marginTop: moderateScale(5), tintColor: colors.yellowC},
  lowerview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale(12),
  },
  lowersmallright: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    backgroundColor: colors.atlanticlightgreen,
    padding:moderateScale(4),
    // width: moderateScale(75),

    // height: moderateScaleVertical(21),
    borderRadius: moderateScale(4),
  },
  totalprice: {
    fontSize: textScale(12),
    marginTop: moderateScaleVertical(4),
    color: colors.black,
    fontFamily:fontFamily.bold, 
  },
  rightlowertext: {
    fontSize: textScale(10),
    color: colors.atlanticgreen,
    borderColor: colors.atlanticgreen,
  },
  greenDot: {
    height: moderateScale(5),
    width: moderateScale(5),
    borderRadius: moderateScale(10),
    marginTop:moderateScale(2)
  },
});
