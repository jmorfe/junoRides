import BottomSheet from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';

import { MyDarkTheme } from '../../styles/theme';
import {
  addRemoveMinutes,
  tokenConverterPlusCurrencyNumberFormater,
} from '../../utils/commonFunction';
import {
  getImageUrl,
  showError,
  showInfo,
  showSuccess,
} from '../../utils/helperFunctions';
import ListEmptyProduct from './ListEmptyProduct';
import stylesFunc from './styles';

import { enableFreeze } from 'react-native-screens';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import AtlanticBottom from '../../Components/AtlanticBottom';
import FeaturesCard from '../../Components/NewComponents/FeaturesCard';
import ReadMoreLessComponent from '../../Components/ReadMoreLessComponent';
import { getColorSchema } from '../../utils/utils';
import ChooseAddons from '../ChooseAddons/ChooseAddons';
import Protection from '../ProtectionView/Protection';

enableFreeze(true);

export default function ProductDetail3({ route, navigation }) {
  console.log('my route', route.params);
  const theme = useSelector(state => state?.initBoot?.themeColor);
  const toggleTheme = useSelector(state => state?.initBoot?.themeToggle);
  const cartData = useSelector(state => state?.cart?.cartItemCount);
  const darkthemeusingDevice = getColorSchema();
  const bottomSheetRef = useRef();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const { appData, themeColors, themeLayouts, currencies, languages, appStyle } =
    useSelector(state => state?.initBoot);
  const {
    additional_preferences,
    digit_after_decimal,
    seller_sold_title,
    seller_platform_logo,
  } = appData?.profile?.preferences || {};
  const { productListData } = useSelector(state => state?.product);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ themeColors, fontFamily });
  const commonStyles = commonStylesFunc({ fontFamily });
  const reloadData = useSelector(state => state?.reloadData?.reloadData);
  const { data, searchDataParam } = route.params;

  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    isLoading: true,
    isLoadingB: false,
    productId: data?.products?.id || data?.item?.id || data?.id,
    productDetailData: null,
    productPriceData: null,
    variantSet: [],
    addonSet: [],
    relatedProducts: [],
    productSku: null,
    productVariantId: null,
    isVisibleAddonModal: false,
    lightBox: false,
    productQuantityForCart: 1,
    showErrorMessageTitle: false,
    typeId: null,
    isProductImageLargeViewVisible: false,
    selectedVariant: null,
    selectedOption: null,
    btnLoader: false,
    startDateRental: new Date(),
    endDateRental: '',
    isRentalStartDatePicker: false,
    isRentalEndDatePicker: false,
    rentalProductDuration: null,
    productDetailNew: {},
    isProductAvailable: false,
    productAttributes: [],
    offersList: [],
    isOffersModalVisible: false,
    productFullDetail: {},
  });

  const [showProtection, setShowProtection] = useState(false);
  const [showAddons, setShowAddons] = useState(false);
  const [isLoadingPinCode, setLoadingPinCode] = useState(false);


  const [readMore, seReadMore] = useState(false);

  //Saving the initial state

  const dine_In_Type = useSelector(state => state?.home?.dineInType);
  const updateState = data => setState(state => ({ ...state, ...data }));
  const { bannerRef } = useRef();
  const {
    productDetailData,
    productPriceData,
    addonSet,
    variantSet,

    productSku,
    productVariantId,
    relatedProducts,
    isVisibleAddonModal,
    lightBox,
    productQuantityForCart,
    showErrorMessageTitle,
    typeId,
    isProductImageLargeViewVisible,
    selectedVariant,
    btnLoader,
    startDateRental,
    endDateRental,
    isRentalStartDatePicker,
    isRentalEndDatePicker,
    rentalProductDuration,
    productDetailNew,
    isProductAvailable,
    productAttributes,
    offersList,
    isOffersModalVisible,
    productFullDetail,
  } = state;

  // -------------------------

  const [addOnsData, setAddOnsData] = useState([]);
  const [totalPrice, setTotalPrice] = useState('');
  const [buttonLoader, setButtonLoader] = useState(false)

  const [rentalProtectionData, setRentalProtectionData] = useState({});


  // let plainHtml = productDetailData?.translation[0]?.meta_description || null;

  useFocusEffect(
    React.useCallback(() => {
      if (variantSet.length) {
        let variantSetData = variantSet
          .map((i, inx) => {
            let find = i.options.filter(x => x.value);
            if (find.length) {
              return {
                variant_id: find[0].variant_id,
                optionId: find[0].id,
              };
            }
          })
          .filter(x => x != undefined);
        console.log(variantSetData, 'variantSetData');
        if (variantSetData.length) {
          getProductDetailBasedOnFilter(variantSetData);
        } else {
          getProductDetail();
        }
      }
    }, [variantSet]),
  );

  useEffect(() => {
    getProductDetail();
  }, [state.productId, state.isLoadingB]);

  const getProductDetail = () => {
    console.log('api hit getProductDetail', state.productId);
    actions
      .getProductDetailByProductId(
        `/${state.productId}`,
        {},
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
        },
      )
      .then(res => {
        console.log(res.data, 'res getProductDetail');

        if (res?.data?.products?.product_media) {
          res?.data?.products?.product_media.map(val => {
            const url1 = val?.image?.path?.image_fit || val.image.image_fit;
            const url2 = val?.image?.path?.image_path || val.image.image_path;
            let imageUri = getImageUrl(url1, url2, '600/800');
            FastImage.preload([{ uri: imageUri }]);
          });
        }

        // const imageUrl = res.data?.image?.path
        // ? getImageUrl(
        //   item.image.path.image_fit,
        //   item.image.path.image_path,
        //   '1000/1000',
        // )
        // : getImageUrl(item.image.image_fit, item.image.image_path, '1000/1000');
        updateState({
          productFullDetail: res?.data,
          productAttributes: res?.data?.product_attribute,
          offersList: res?.data?.coupon_list,
          productDetailNew: res?.data?.products,
          productDetailData: res?.data?.products,
          relatedProducts: res.data.relatedProducts,
          productPriceData: res.data.products.variant[0],
          addonSet: res.data.products.add_on,
          typeId: res.data.products.category.category_detail.type_id,
          venderDetail: res.data.products.vendor,
          productTotalQuantity: res.data.products.variant[0].quantity,
          productVariantId: res.data.products.variant[0].id,
          productSku: res.data.products.sku,
          productQuantityForCart: !!res.data.products?.minimum_order_count
            ? Number(res.data.products?.minimum_order_count)
            : 1,
          isLoading: false,
          isLoadingB: false,
          btnLoader: false,
          rentalProductDuration:
            Number(res?.data?.products?.minimum_duration) * 60 +
            Number(res?.data?.products?.minimum_duration_min),
          endDateRental: addRemoveMinutes(
            Number(res?.data?.products?.minimum_duration) * 60 +
            Number(res?.data?.products?.minimum_duration_min),
          ),
          startDateRental: new Date(),
        });
        if (
          res.data.products.variant_set.length &&
          variantSet &&
          !variantSet.length
        ) {
          updateState({ variantSet: res.data.products.variant_set });
        }
      })
      .catch(errorMethod);
  };

  //Get Product detail based on varint selection
  const getProductDetailBasedOnFilter = variantSetData => {
    console.log('api hit getProductDetailBasedOnFilter');
    let data = {};
    data['variants'] = variantSetData.map(i => i.variant_id);
    data['options'] = variantSetData.map(i => i.optionId);
    actions
      .getProductDetailByVariants(`/${productDetailData.sku}`, data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
      })
      .then(res => {
        console.log(res.data, 'res.data by vendor id ');
        updateState({
          isLoading: false,
          isLoadingB: false,
          isLoadingC: false,

          productPriceData: {
            multiplier: res.data.multiplier,
            price: res.data.price,
          },
          productSku: res.data.sku,
          productVariantId: res.data.id,
          showErrorMessageTitle: false,
          selectedVariant: null,
          btnLoader: false,
          productDetailNew: res?.data,
        });
      })
      .catch(errorMethod);
  };

  const errorMethod = error => {
    setLoadingPinCode(false);
    if (error?.message?.alert == 1) {
      updateState({
        isLoading: false,
        isLoadingB: false,
        isLoadingC: false,
        btnLoader: false,
      });
      // showError(error?.message?.error || error?.error);
      Alert.alert('', error?.message?.error, [
        {
          text: strings.CANCEL,
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
        },
        { text: strings.CLEAR_CART2, onPress: () => clearCart() },
      ]);
    } else {
      if (error?.data?.variant_empty) {
        updateState({
          isLoading: false,
          showErrorMessageTitle: true,
          isLoadingB: false,
          isLoadingC: false,
          selectedVariant: null,
          btnLoader: false,
        });
      } else {
        updateState({
          isLoading: false,
          isLoadingB: false,
          isLoadingC: false,
          selectedVariant: null,
          btnLoader: false,
        });
        if (error?.message == 'Recurring booking type not be empty.') {
          showInfo('Schedule the product click on recurring checkbox');
        } else {
          showError(error?.message || error?.error);
        }
      }
    }
  };

  const errorMethodSecond = (error, addonSet) => {
    setButtonLoader(false)
    if (error?.message?.alert == 1) {
      updateState({ isLoading: false, isLoadingB: false, isLoadingC: false });
      // showError(error?.message?.error || error?.error);

      Alert.alert('', strings.ALREADY_EXIST, [
        {
          text: strings.CANCEL,
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
        },
        { text: strings.CLEAR_CART2, onPress: () => clearCart(addonSet) },
      ]);
    } else {
      updateState({ isLoading: false, isLoadingB: false, isLoadingC: false });
      if (error?.message == 'Recurring booking type not be empty.') {
        showInfo('Schedule the product click on recurring checkbox');
      } else {
        showError(error?.message || error?.error);
      }
    }
  };

  const clearCart = addonSet => {
    actions
      .clearCart(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then(res => {
        actions.cartItemQty(res);
        // updateState({
        //   cartItems: [],
        //   cartData: {},
        //   isLoadingB: false,
        // });
        // addToCart();
        if (addonSet) {
          _finalAddToCart(addonSet);
        } else {
          addToCart();
        }
        // _finalAddToCart(addonSet);
        showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  useEffect(() => {
    myRef.current.scrollToPosition(1, 0, true);
  }, [state.productId]);

  console.log(typeId, 'typeId>>>>>typeId', rentalProductDuration);

  useEffect(() => {
    if (data?.addonSetData && data?.randomValue) {
      updateState({ addonSet: data?.addonSetData });
      setTimeout(() => {
        _finalAddToCart(data?.addonSetData);
      }, 1000);
    }
  }, [data?.addonSetData, data?.randomValue]);

  useEffect(() => {
    if (!isEmpty(productDetailNew)) {
    }
  }, [productDetailNew]);

  const _finalAddToCart = (addonSet = addonSet) => {
    setButtonLoader(true)
    //   ------------start date
    let startDate = moment(
      searchDataParam?.pickup?.time,
      'YYYY-MM-DD hh:mm a',
    ).format('YYYY-MM-DD HH:mm');
    //   ------------end date
    let endDate = moment(
      searchDataParam?.dropOff?.time,
      'YYYY-MM-DD hh:mm a',
    ).format('YYYY-MM-DD HH:mm');
    //   ------------addOns
    let selectedAddOnsOption = addOnsData.filter(
      item => item.selectedAddOns && item.selectedAddOns.length > 0,
    );
    let addon_options = selectedAddOnsOption?.map(item => item?.selectedAddOns);
    let addonsId = [].concat(...addon_options)?.map(item => item?.addon_id);
    let optionsId = [].concat(...addon_options)?.map(item => item?.id);

    let protection = rentalProtectionData?.excluded
      ?.filter(item => item?.addProtection)
      ?.map(item => item?.rental_protection?.id);
    console.log(
      protection,
      'rentalProtectionDatarentalProtectionDatarentalProtectionData',
    );

    // ----------------------rental protection

    let data = {};
    data['sku'] = productSku;
    data['quantity'] = productQuantityForCart;
    data['product_variant_id'] = productVariantId;
    data['type'] = dine_In_Type;
    data['start_date_time'] = String(startDate);
    data['end_date_time'] = String(endDate);
    data['addon_ids'] = addonsId;
    data['addon_options'] = optionsId;
    data['rental_protection'] = protection?.length > 0 ? protection : [];

    // data['additional_increments_hrs_min'] =
    //   rentalProductDuration -
    //   Number(productDetailData?.minimum_duration) * 60 +
    //   Number(productDetailData?.minimum_duration_min);
    // if (addonSet && addonSet.length) {
    //   // console.log(addonSetData, 'addonSetData');
    //   data['addon_ids'] = addon_ids;
    //   data['addon_options'] = addon_options;
    // }
    // if (dine_In_Type == 'appointment') {
    //   (data['schedule_slot'] = selectedAppointmentSlot?.value),
    //     (data['scheduled_date_time'] = String(
    //       moment(appointmentSelectedDate).format('YYYY-MM-DD hh:mm:ss'),
    //     ));
    //   data['dispatch_agent_id'] = selectedAgent?.id;
    //   data['schedule_type'] =
    //     productDetailData?.mode_of_service == 'schedule' ? 'schedule' : '';
    // }

    console.log(rentalProtectionData, 'data for cart', data);

    // data['recurringformPost'] = recurringformPost;
    console.log(JSON.stringify(data), 'data for cart');
    updateState({ isLoadingC: true, isVisibleAddonModal: false });
    actions
      .addProductsToCart(data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then(res => {
        console.log(res, 'res.data');
        actions.cartItemQty(res);
        actions.reloadData(!reloadData);

        showSuccess(strings.PRODUCT_ADDED_SUCCESS);

        updateState({ isLoadingC: false });
        setButtonLoader(false)
        // if (!!isProductList) {
        //   navigation.navigate(navigationStrings.PRODUCT_LIST, {
        //     data: {
        //       item: data,
        //       isLoading: true,
        //       data: res?.data,
        //       vendor: previousScreenData?.vendor,
        //     },
        //   });
        // } 
        // else {
        navigation.popToTop()

        // }
      })
      .catch(error => errorMethodSecond(error, addonSet));
  };
  const addToCart = () => {
    setButtonLoader(true)
    if (isProductAvailable) {
      showError('Product varient is not availabel!');
      return;
    }
    if (typeId == 10 && !!cartData?.data?.item_count) {
      showError('Rental product already added in cart!');
      return;
    }
    if (data?.is_recurring_booking) {
      if (isEmpty(selectedPlanValues)) {
        showError('Plan type should not be empty!');
        return;
      }
      if (isEmpty(selectedWeekDaysValues) && selectedPlanValues == 'Weekly') {
        showError('Weekdays should not be empty!');
        return;
      }
      if (
        selectedPlanValues == 'Daily' ||
        selectedPlanValues == 'Weekly' ||
        selectedPlanValues == 'Alternate Days'
      ) {
        if (isEmpty(start) || isEmpty(end)) {
          showError('Start date and End date should not be empty!');
          return;
        }
      } else {
        if (isEmpty(period)) {
          showError('Select dates in custom plan!');
          return;
        }
      }
    }
    {
      addonSet && addonSet.length
        ? updateState({ isVisibleAddonModal: true })
        : _finalAddToCart(addonSet);
    }
    // _finalAddToCart()
  };

  const myRef = useRef(null);

  const onImageLargeView = item => {
    updateState({
      isProductImageLargeViewVisible: true,
    });
  };

  // load images for zooming effect

  const allImagesArrayForZoom = [];
  productDetailData?.product_media
    ? productDetailData?.product_media?.map((item, index) => {
      return (allImagesArrayForZoom[index] = {
        url: getImageUrl(
          item?.image.path.image_fit,
          item?.image.path.image_path,
          '1000/1000',
        ),
      });
    })
    : getImageUrl(
      productDetailData?.product_media[0]?.image?.path?.image_fit,
      productDetailData?.product_media[0]?.image?.path?.image_path,
      '1000/1000',
    );

  const toggleExpanded = () => {
    seReadMore(!readMore);
  };
  const setSnapState = (index) => {
    updateState({ slider1ActiveSlide: index });
  };

  const renderProductImages = ({ item, index }) => {
    const imageUrl = item?.image?.path
      ? getImageUrl(
        item.image.path.image_fit,
        item.image.path.image_path,
        '1000/1000',
      )
      : getImageUrl(item.image.image_fit, item.image.image_path, '1000/1000');
    return (

      <FastImage
        source={{
          uri: imageUrl,
          priority: FastImage.priority.high,
          cache: FastImage.cacheControl.immutable,
        }}
        style={{
          width: '100%',
          height: '100%',
          aspectRatio: 1,
          alignSelf: 'center'
        }}
        resizeMode='contain'
      />

    )
  }
  return (

    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? MyDarkTheme.colors.background : colors.white
      }}>

      {/* <AtlanticHeader lefttext={strings.Car_Detail} /> */}
      {state.isLoading && <ListEmptyProduct isLoading={state.isLoading} />}
      <KeyboardAwareScrollView
        ref={myRef}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}>
        {!state.isLoading && (
          <View style={{ paddingBottom: height / 4 }}>
            {!!showProtection || !!showAddons ? null
              : <TouchableOpacity
                style={styles.backIconView} onPress={() => navigation.goBack()}>
                <FastImage
                  source={imagePath.backRoyo}
                  style={{
                    width: moderateScale(19),
                    height: moderateScale(19),

                  }}
                  resizeMode='contain'
                />
              </TouchableOpacity>}
            <View style={{ height: height / 3, alignItems: 'center' }}>
              <Carousel
                autoplay={true}
                loop={true}
                autoplayInterval={2000}
                data={productDetailData?.product_media || []}
                renderItem={renderProductImages}
                sliderWidth={width}
                itemWidth={width}

                onSnapToItem={(index) => setSnapState(index)}
              />

            </View>

            <View style={{ marginTop: 10 }}>
              <Pagination
                dotsLength={productDetailData?.product_media?.length}
                activeDotIndex={state.slider1ActiveSlide}
                dotColor={themeColors?.primary_color}
                dotStyle={[styles.dotStyle]}
                inactiveDotColor={colors.black}
                inactiveDotOpacity={0.2}
                inactiveDotScale={0.8}
              />
            </View>


            <View
              style={{
                marginHorizontal: moderateScale(18),
                justifyContent: 'space-between',
                // marginTop: moderateScale(20),
              }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>


                <Text
                  numberOfLines={2}
                  style={{
                    flex: 0.5,
                    fontFamily: fontFamily.bold,
                    fontSize: textScale(16),
                    color: isDarkMode ? colors.white : colors.black,

                  }}>
                  {productDetailData?.translation[0]?.title}
                </Text>

                {!!productDetailData?.address &&
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 0.5,
                      flexWrap: 'wrap',
                      marginTop: moderateScaleVertical(6),
                    }}>
                    <Image
                      source={imagePath.ic_location_atlantic}
                      style={{
                        tintColor: isDarkMode
                          ? MyDarkTheme.colors.white
                          : colors.black,
                      }}
                    />
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: moderateScale(13),
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.textColor,
                        marginLeft: moderateScale(5),
                        maxWidth: width / 3
                      }}>
                      {productDetailData?.address}
                    </Text>
                  </View>
                }
              </View>

            </View>


            {console.log(productFullDetail.product_attribute, 'sadfdbvifvsudfb')}
            <FlatList
              numColumns={2}
              data={productFullDetail?.product_attribute}
              style={{ marginTop: moderateScale(10) }}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              contentContainerStyle={{ marginHorizontal: moderateScale(16) }}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={() => <View style={{ height: moderateScale(12) }} />}
              renderItem={({ item }) => (
                <FeaturesCard
                  item={item} />
              )}
            />
            {productDetailData?.translation[0]?.meta_description?.length >
              0 ? (
              <View
                style={{
                  marginHorizontal: moderateScale(16),
                }}>
                <Text
                  style={{
                    fontSize: moderateScale(16),
                    fontFamily: fontFamily.medium,
                    marginTop: moderateScaleVertical(26),

                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.black,
                  }}>
                  {strings.DESCRIPTION}
                </Text>
                {/* {!!productDetailData?.translation[0]?.meta_description ? ( */}
                <ReadMoreLessComponent
                  text={productDetailData?.translation[0]?.meta_description}
                  maxLength={70}
                  readMore={readMore}
                  toggleExpanded={toggleExpanded}
                />
                {/* // ) : null} */}
              </View>
            ) : null}
            <Text
              style={{
                fontSize: moderateScale(16),
                fontFamily: fontFamily.medium,
                marginTop: moderateScaleVertical(26),
                marginHorizontal: moderateScale(16),

                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {strings.additionfeatures}
            </Text>
            <View style={{ marginTop: moderateScaleVertical(4) }}></View>
            <FlatList
              data={productFullDetail?.additional_features}
              contentContainerStyle={{
                // paddingBottom: moderateScale(100),
                marginHorizontal: moderateScale(16),
              }}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: moderateScaleVertical(8),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={imagePath.grayDot}
                      style={{
                        tintColor: isDarkMode
                          ? MyDarkTheme.colors.white
                          : colors.blackLight,
                        height: moderateScaleVertical(4),
                        width: moderateScale(4),
                      }}
                    />
                    <Text
                      style={{
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.textColor,
                        marginLeft: moderateScale(4),
                      }}>
                      {item?.title}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textColor,
                    }}>
                    {item?.value}
                  </Text>
                </View>
              )}
            />


          </View>)}
      </KeyboardAwareScrollView>
      {!!productPriceData?.price ? (
        <AtlanticBottom
          Totalprice={strings.TOTAL_PRICE}
          // total={'AED 90'}
          // Pricedetails={strings.PRICE_DETAIL}
          total={tokenConverterPlusCurrencyNumberFormater(
            Number(productPriceData?.price),
            digit_after_decimal,
            additional_preferences,
            currencies?.primary_currency?.symbol,
          )}
          btnText={strings.NEXT}
          textStyle={{ fontSize: textScale(13) }}
          // onPress={() =>
          //   navigation.navigate(navigationStrings.Protection, {
          //     data: productDetailData,
          //   })
          onPress={() => setShowProtection(!showProtection)}
        />
      ) : null}
      {!!showProtection ? (
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={[height]}
          activeOffsetY={[-1, 1]}
          failOffsetX={[-5, 5]}
          animateOnMount={true}
          handleComponent={null}>
          <Protection
            productDetailData={productDetailData}
            navigation={navigation}
            onBackPress={() => setShowProtection(!showProtection)}
            onPressProtection={(value, index) => {
              let newArr = [...rentalProtectionData?.excluded];
              newArr[index].showModal = true;
              setRentalProtectionData({
                ...rentalProtectionData,
                excluded: newArr,
              });
            }}
            // modalopen={modalopen}
            onModalClose={index => {
              let newArr = [...rentalProtectionData?.excluded];
              newArr[index].showModal = false;

              setRentalProtectionData({
                ...rentalProtectionData,
                excluded: newArr,
              });
            }}
            rentalProtectionData={rentalProtectionData}
            setRentalProtectionData={vel => setRentalProtectionData(vel)}
            addProtection={(item, index) => {
              let newArr = [...rentalProtectionData?.excluded];
              newArr[index].addProtection = !newArr[index].addProtection;
              newArr[index].showModal = false;
              setRentalProtectionData({
                ...rentalProtectionData,
                excluded: newArr,
              });
            }}
            addOns={value => {
              setAddOnsData(value);
            }}
            onPressNext={value => {
              console.log(value, 'valuevaluevalue');
              setTotalPrice(value);
              setShowProtection(!showProtection)
              setShowAddons(!showAddons);
            }}
          />
        </BottomSheet>
      ) : null}
      {!!showAddons ? (
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={[height]}
          activeOffsetY={[-1, 1]}
          failOffsetX={[-5, 5]}
          animateOnMount={true}
          handleComponent={null}>
          <ChooseAddons
            addOnsData={addOnsData}
            buttonLoader={buttonLoader}
            totalPrice={totalPrice}
            onBackPress={() => {
              setShowProtection(!showProtection)
              setShowAddons(!showAddons);
            }}
            addToCart={_finalAddToCart}
            setAddOnsData={vel => {
              console.log(vel, 'velvelvelvel');
              setAddOnsData(vel);
            }}
          />
        </BottomSheet>
      ) : null}
    </View>
  );
}
