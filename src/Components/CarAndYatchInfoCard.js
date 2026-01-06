import moment from 'moment';
import React, { memo } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import commonFum from '../styles/commonStyles';
import fontFamily from '../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { getColorSchema } from '../utils/utils';
import BookingOptionCard from './BookingOptionCard';
const CarAndYatchInfoCard = ({item, index,onPressBookingOption=()=>{}}) => {
  const darkthemeusingDevice = getColorSchema();
  const {themeColors, appStyle, themeColor, themeToggle} = useSelector(
    state => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const commonStyles = commonFum({
    fontFamily,
    themeColors,
    isDarkMode,
    MyDarkTheme,
  });
  return (
    <View>
      {item?.vendor_products?.map((elemnt, index) => {
        console.log(elemnt, 'sdvsdfvsdfbvdfbd');

        return (
          <View>
            <View style={styles.boxView}>
              <View style={commonStyles.flexRowJustifyConten}>
                <View style={{flex: 0.6}}>
                  <Text style={{fontSize: textScale(14)}}>
                    {elemnt?.product?.title}
                  </Text>
                  <View style={styles.txtView}>
                    <Text style={commonStyles.regularFont12}>{elemnt?.product?.transmission}</Text>
                    <View style={styles.dotStyle} />
                    <Text style={commonStyles.regularFont12}>{elemnt?.product?.fuel_type}</Text>
                    <View style={styles.dotStyle} />
                    <Text style={commonStyles.regularFont12}>{`${elemnt?.product?.Seats} ${strings.SEATS}`}</Text>
                  </View>
                  <View
                    style={{
                      ...styles.txtView,
                      marginTop: moderateScaleVertical(10),
                    }}>
                    {elemnt?.product?.category_name?.name == 'Yacht' ? null :<Text style={commonStyles.regularFont12}>
                      {`Booking for ${moment(elemnt?.end_date_time).diff(
                        elemnt?.start_date_time,
                        'days',
                      )} days`}
                    </Text>}

                    {/* <TouchableOpacity>
              <Image
                style={{tintColor: colors.black}}
                source={imagePath.dropDownSingle}
              />
            </TouchableOpacity> */}
                  </View>
                </View>

                <View style={styles.imageView}>
                  <Image
                    style={styles.imgStyle}
                    source={{
                      uri: elemnt?.cartImg?.path?.original_image,
                    }}
                  />
                </View>
              </View>

              <View style={styles.lineStyle} />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent:'space-between',
                  alignItems:'flex-start',
                  marginTop: moderateScaleVertical(16),
                }}>
                <View style={{flex: 0.4, marginTop: moderateScaleVertical(16)}}>
                  <Text
                    style={[commonStyles.regularFont12, {color: colors.black}]}>
                    {`Start: ${moment(elemnt?.start_date_time).format('LT')}`}
                  </Text>
                  <Text style={styles.dateTextStyle}>
                    {moment(elemnt?.start_date_time).format('DD MMM YY')}
                  </Text>
                  <Text
                    style={[
                      commonStyles.regularFont12,
                      {color: colors.textColor},
                    ]}>
                    {moment(elemnt?.start_date_time).format('dddd')}
                  </Text>
                </View>
               { elemnt?.product?.category_name?.name == 'Yacht' ? null : <View
                  style={{
                    flex: 0.4,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        flex: 1,
                        height: 1,
                        backgroundColor: colors.textColor,
                      }}
                    />
                    <View>
                      <Text
                        style={{
                          width: 50,
                          textAlign: 'center',
                          color: colors.textColor,
                        }}>
                        {`${moment(elemnt?.end_date_time).diff(
                        elemnt?.start_date_time,
                        'days',
                      )} days`}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        height: 1,
                        backgroundColor: colors.textColor,
                      }}
                    />
                  </View>
                </View>}

              {elemnt?.product?.category_name?.name == 'Yacht' ? <View
                  style={{
                    flex: 0.4,
                    marginTop: moderateScaleVertical(16),
                    alignItems: 'flex-end',
                  }}>
                  <Text
                    style={{
                      fontSize: textScale(14),
                      fontFamily: fontFamily.bold,
                      marginTop: moderateScaleVertical(8),
                    }}>
                    {elemnt?.pvariant?.vset[0]?.variant_detail?.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: textScale(12),
                      color: colors.textColor,
                      marginTop: moderateScaleVertical(4),
                    }}>
                   {elemnt?.pvariant?.vset[0]?.option_data?.title}
                  </Text>
                </View> :  <View
                  style={{
                    flex: 0.4,
                    marginTop: moderateScaleVertical(16),
                    alignItems: 'flex-end',
                  }}>
                  <Text>
                    {`End: ${moment(elemnt?.end_date_time).format('LT')}`}
                  </Text>
                  <Text
                    style={{
                      fontSize: textScale(14),
                      fontFamily: fontFamily.bold,
                      marginTop: moderateScaleVertical(8),
                    }}>
                    {moment(elemnt?.end_date_time).format('DD MMM YY')}
                  </Text>
                  <Text
                    style={{
                      fontSize: textScale(12),
                      color: colors.textColor,
                      marginTop: moderateScaleVertical(4),
                    }}>
                    {moment(elemnt?.end_date_time).format('dddd')}
                  </Text>
                </View>}
              </View>

       <View style={{marginTop: moderateScaleVertical(26)}}>
                <View style={styles.secView}>
                  <View style={{flex: 0.1, zIndex: 1}}>
                    <Image resizeMode="contain" source={imagePath.icRedOval} />
                  </View>

                  <View style={styles.locationView}>
                    <Text numberOfLines={3} style={{marginBottom: 8}}>
                      {item?.vendor?.address}
                    </Text>
                  </View>
                  <View style={{flex: 0.2, alignItems: 'flex-end'}}>
                    <Text>{strings.PICKUP}</Text>
                  </View>
                </View>
             {elemnt?.product?.category_name?.name == 'Yacht' ? null :   <View
                  style={{
                    ...styles.secView,
                    marginTop: moderateScaleVertical(18),
                  }}>
                  <View style={{flex: 0.1}}>
                    <Image resizeMode="contain" source={imagePath.icRedOval} />
                  </View>

                  <View style={styles.locationView}>
                    <Text numberOfLines={2} style={{marginBottom: 8}}>
                    {item?.vendor?.address}
                    </Text>
                  </View>
                  <View style={{flex: 0.2, alignItems: 'flex-end'}}>
                    <Text style={{textTransform:'uppercase'}}>{strings.DROP}</Text>
                  </View>
                </View>}
                <View style={styles.dottedView}>
                  <View
                    style={{
                      borderWidth: 1,
                      height: '70%',
                      borderStyle: 'dotted',
                    }}
                  />
                </View>
              </View>
            </View>
           {elemnt?.product?.booking_options?.length > 0 ?  <View>
              <Text
                style={{
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  ...styles.textbooking,
                }}>
                {strings.booking_option}
              </Text>
              {/* <View style={{marginBottom:moderateScale(100)}}> */}
              <FlatList
                data={elemnt?.product?.booking_options || []}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => {
                  return (
                    <BookingOptionCard
                      item={item}
                      data={elemnt?.product}
                      index={index}
                      onPress={() => onPressBookingOption(item)}
                    />
                  );
                }}
              />
            </View> :null}
          </View>
        );
      })}
    </View>
  );
};

export default memo(CarAndYatchInfoCard);

const styles = StyleSheet.create({
  boxView: {
    backgroundColor: '#F7F7F7',
    paddingVertical: moderateScaleVertical(14),
    paddingHorizontal: moderateScale(8),
    marginBottom:moderateScale(16)
  },
  txtView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScaleVertical(4),
  },
  dotStyle: {
    height: 6,
    width: 6,
    backgroundColor: colors.black,
    borderRadius: 8,
    margin: 6,
  },
  imageView: {
    flex: 0.4,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  imgStyle: {
    width: moderateScale(128),
    height: moderateScaleVertical(78),
    borderRadius: moderateScale(6),
  },
  dateTextStyle: {
    fontSize: textScale(14),
    color: colors.black,
    fontFamily: fontFamily.bold,
    marginTop: moderateScaleVertical(8),
  },
  secView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationView: {
    flex: 0.7,
    borderBottomWidth: 1,
    borderColor: colors.textColor,
  },
  textbooking: {
    marginVertical: moderateScaleVertical(16),
    fontSize: textScale(16),
    fontFamily: fontFamily.semiBold,
  },
  descview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScaleVertical(8),
  },
  dottedView: {
    position: 'absolute',
    zIndex: -10,
    height: '100%',
    alignItems: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 9,
  },
});
