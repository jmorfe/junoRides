import {isEmpty} from 'lodash';
import moment from 'moment';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import HTMLView from 'react-native-htmlview';
import {useSelector} from 'react-redux';
import {dummyUser} from '../constants/constants';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {getImageUrl} from '../utils/helperFunctions';

export default function P2pProductComp({
  item = {},
  isMoreDetails = false,
  isViewDetails = false,
  onViewDetails = () => {},
  onChatStart = () => {},
  isStartChat = false,
  selectedTab = {},
}) {
  const {
    appData,
    themeColors,
    currencies,
    languages,
    appStyle,
    themeToggle,
    themeColor,
  } = useSelector(state => state?.initBoot);
  const {userData} = useSelector(state => state?.auth);

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily, themeColors});
  const imageUrl = !isEmpty(item?.product_details)
    ? getImageUrl(
        item?.product_details[0]?.image_path?.image_fit,
        item?.product_details[0]?.image_path?.image_path,
        '300/300',
      )
    : dummyUser;

  const LeftImgRightTxt = ({
    image,
    text,
    isViewDetails = false,
    isStartChat = false,
  }) => (
    <View
      style={{
        flexDirection: 'row',
        marginTop: moderateScaleVertical(8),
        justifyContent: 'space-between',
      }}>
      <View
        style={{flexDirection: 'row', padding: moderateScale(6), flex: 0.9}}>
        <Image source={image} />
        <Text numberOfLines={1} style={styles.rightTxt}>
          {text}
        </Text>
      </View>
      {!!isViewDetails && (
        <TouchableOpacity onPress={onViewDetails} style={styles.viewDetailsBtn}>
          <Text
            style={{
              fontFamily: fontFamily?.regular,
              color: colors.white,
              textAlign: 'center',
            }}>
            View Details
          </Text>
        </TouchableOpacity>
      )}
      {!!isStartChat && (
        <TouchableOpacity
          onPress={onChatStart}
          style={{...styles.viewDetailsBtn}}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: fontFamily?.regular,
              color: colors.white,
              // marginTop: moderateScaleVertical(4),
            }}>
            Start Chat
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View
      style={{
        ...styles.touchContainer,
        backgroundColor: colors.whiteSmokeColor,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        {selectedTab?.id == 4 ? (
          <Text
            style={{
              marginBottom: moderateScaleVertical(4),
              fontFamily: fontFamily?.regular,
            }}>
            {'Cancelled by'}{' '}
            {item?.cancelled_by?.id == userData?.id
              ? 'you'
              : item?.cancelled_by?.user_vendor?.vendor_id === item?.vendor?.id
              ? 'lender'
              : 'borrower'}
          </Text>
        ) : (
          <View />
        )}
        {/* <Text style={{
                    fontFamily: fontFamily?.medium,
                    fontSize: textScale(12)
                }}>#{item?.order_number}</Text> */}
      </View>

      <TouchableOpacity
        onPress={onViewDetails}
        style={{
          flexDirection: 'row',
        }}>
        <FastImage
          source={{uri: imageUrl}}
          style={styles.imgStyle}
          // resizeMode={FastImage.resizeMode.contain}
        />
        <View style={styles.mainContainer}>
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontFamily: fontFamily?.medium,
                  fontSize: textScale(14),
                  flex: 1,
                }}>
                {!isEmpty(item?.product_details)
                  ? item?.product_details[0].title ||
                    item?.product_details[0]?.translation[0]?.title ||
                    ''
                  : ''}
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily?.medium,
                  fontSize: textScale(12),
                }}>
                #{item?.order_number}
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{width: width / 2}}>
                {!isEmpty(item?.product_details) &&
                (item?.product_details[0]?.translation[0]?.meta_description ||
                  item?.product_details[0]?.translation[0]?.body_html) && (
                  <View>
                    {!!item?.product_details[0]?.translation[0]
                      ?.meta_description ? (
                      <Text
                        numberOfLines={3}
                        style={{
                          fontSize: textScale(10),
                          fontFamily: fontFamily.regular,
                          // lineHeight: moderateScale(14),
                          color: colors.blackOpacity66,
                          textAlign: 'left',
                          marginTop: moderateScaleVertical(8),
                        }}>
                        {
                          item?.product_details[0]?.translation[0]
                            ?.meta_description
                        }
                      </Text>
                    ) : (
                      <HTMLView
                        stylesheet={{
                          p: {
                            fontFamily: fontFamily?.regular,
                            fontSize: textScale(12),
                            color: colors.lightGreyText,
                          },
                        }}
                        value={
                          item?.product_details[0]?.translation[0]?.body_html
                            ? item?.product_details[0].translation[0]?.body_html
                            : ''
                        }
                        textComponentProps={{
                          numberOfLines: 3,
                        }}
                        nodeComponentProps={{numberOfLines: 3}}
                      />
                    )}
                  </View>
                )}
                </View>
             
              {isStartChat && (
                <TouchableOpacity
                  onPress={onChatStart}
                  style={{
                    ...styles.viewDetailsBtn,
                    marginVertical: moderateScaleVertical(5),
                    backgroundColor: colors.whiteSmokeColor,
                    marginTop:moderateScale(14),
                    marginRight:moderateScale(12)
                  }}>
                  <Image style={{tintColor:themeColors.primary_color}} source={imagePath.ic_chat1_inactive} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
      {isMoreDetails && (
        <View>
          <LeftImgRightTxt
            image={imagePath.icTimeOrders}
            text={
              moment(item?.products[0]?.start_date_time).format(
                'MMM DD, YYYY hh:mm:A',
              ) +
              ' - ' +
              moment(item?.products[0]?.end_date_time).format(
                'MMM DD, YYYY hh:mm:A',
              )
            }
          />
          {!isEmpty(item?.products) &&
            !isEmpty(item?.products[0]?.product) &&
            item?.products[0]?.product?.address && (
              <LeftImgRightTxt
                image={imagePath.icLocationOrders}
                text={item?.products[0]?.product?.address}
              />
            )}
          <LeftImgRightTxt
            image={imagePath.icProfileOrders}
            isStartChat={isStartChat}
            text={`Lent by ${item?.vendor?.name}`}
          />
          <LeftImgRightTxt
            image={imagePath.icProfileOrders}
            text={`Borrowed by ${item?.user?.name}`}
            isViewDetails={true}
          />
        </View>
      )}
      {isViewDetails && (
        <View style={{alignItems: 'flex-end'}}>
          <TouchableOpacity
            onPress={onViewDetails}
            style={styles.viewDetailsBtn}>
            <Text
              style={{
                fontFamily: fontFamily?.regular,
                color: colors.white,
              }}>
              View Details
            </Text>
          </TouchableOpacity>
          {isStartChat && (
            <TouchableOpacity
              onPress={onChatStart}
              style={{
                ...styles.viewDetailsBtn,
                marginVertical: moderateScaleVertical(5),
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: fontFamily?.regular,
                  color: colors.white,
                  marginTop: moderateScaleVertical(4),
                  textDecorationLine: 'underline',
                }}>
                Start Chat
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {/* <Text>{"Cancelled by"} {item?.vendor_id === userData?.vendor_id ? "Lendor" : "Borrower"} </Text> */}
    </View>
  );
}

export function stylesFunc({fontFamily, themeColors}) {
  const styles = StyleSheet.create({
    viewDetailsBtn: {
      padding: moderateScale(6),
      backgroundColor: 'green',
      borderRadius: moderateScale(4),
      backgroundColor: themeColors?.primary_color,
      flex: 0.3,
    },
    descTxt: {
      fontFamily: fontFamily?.medium,
      fontSize: textScale(12),
      marginTop: moderateScaleVertical(8),
      color: colors.lightGreyText,
    },
    mainContainer: {
      marginLeft: moderateScale(18),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: 1,
    },
    imgStyle: {
      height: moderateScale(65),
      width: moderateScale(65),
      borderRadius: moderateScale(12),
    },
    touchContainer: {
      marginHorizontal: moderateScale(16),
      padding: moderateScale(10),
      borderRadius: moderateScale(12),
    },
    rightTxt: {
      fontFamily: fontFamily?.regular,
      marginLeft: moderateScale(8),
      color: colors.textGreyN,
    },
  });
  return styles;
}
