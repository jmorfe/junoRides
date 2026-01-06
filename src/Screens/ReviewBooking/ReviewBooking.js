//import liraries
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import { handleNextAction } from '@stripe/stripe-react-native';
import { isEmpty } from 'lodash';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  View
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import * as RNLocalize from 'react-native-localize';
import { useSelector } from 'react-redux';
import AtlanticBottom from '../../Components/AtlanticBottom';
import CarAndYatchInfoCard from '../../Components/CarAndYatchInfoCard';
import Header from '../../Components/Header';
import HorizontalLine from '../../Components/HorizontalLine';
import SelectPaymentModal from '../../Components/SelectPaymentModal';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { tokenConverterPlusCurrencyNumberFormater } from '../../utils/commonFunction';
import { showError, showSuccess } from '../../utils/helperFunctions';
import { getColorSchema, getItem, removeItem } from '../../utils/utils';
import ReviewBookingShimmerLoader from './ReviewBookingShimmerLoader';
import styles from './styles';

// create a component
const ReviewBooking = ({navigation, route}) => {
  let paramsData = route?.params;
  const {
    appData,
    allAddresss,
    themeColors,
    currencies,
    languages,
    appStyle,
    themeColor,
    themeToggle,
  } = useSelector(state => state?.initBoot);
  const {additional_preferences, digit_after_decimal} =
    appData?.profile?.preferences || {};
  const {dineInType} = useSelector(state => state?.home);
  const userData = useSelector(state => state?.auth?.userData);
  const checkCartItem = useSelector(state => state?.cart?.cartItemCount);

  const darkthemeusingDevice = getColorSchema();
  const bottomSheetRef = useRef(null);
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const [isAddOn, setAddOn] = useState([
    {
      id: 0,
      name: 'Ford Endeavour',
    },
  ]);
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentMethodId, setPaymentMethodId] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState({});
  const [cardInfo, setCardInfo] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [sel_types, setSelTypes] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cartData, setCartData] = useState({});
  const [bookingOption, setBookingOption] = useState([]);
  const [isShimmerLoading, setIsShimmerLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [buttonLoader,setButtonLoader] =useState(false)
  console.log(cartData, 'cartDatacartDatacartData');
  // const [codMinAmount, setCodMinAmount] = useState(null);
  // const [tokenInfo, setTokenInfo] = useState(null);
  const _onAddPress = (item, index) => {
    let newArray = [...isAddOn];
    newArray[index].exist = !item.exist;
    setAddOn(newArray);
    console.log(newArray, 'itemmmm');

    //     let array =[...isAddOn]
    //    let data= isAddOn.map((val,index)=>{
    //         if( val == id){
    //             return {...array,isSelected:val?.isSelected}
    //         }
    //     })
  };
  const onSelectPayment = data => {
    console.log('my data++++', data);

    // const [paymentMethodId, setPaymentMethodId] = useState(null);
    setPaymentMethodId(data?.payment_method_id);
    setSelectedPayment(data?.selectedPaymentMethod);
    if (!!data?.cardInfo) {
      setCardInfo(data?.cardInfo);
    }
    if (!!data?.tokenInfo) {
      setTokenInfo(data?.tokenInfo);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setIsShimmerLoading(true);
      getCartDetail();
      return () => {};
    }, [
      currencies,
      languages,
      route?.params?.promocodeDetail,
      allAddresss,
      isRefreshing,
      checkCartItem?.data?.item_count,
      sel_types,
    ]),
  );

  const getCartDetail = () => {
    // alert("cart detail hit")
    let apiData = `/?type=${dineInType}${
      paramsData?.data?.queryURL ? `&${paramsData?.data?.queryURL}` : ''
    }`;
    if (!!sel_types) {
      apiData = apiData + `&code=${sel_types}`;
    }
    console.log('Sending api data', apiData);
    let apiHeader = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
      systemuser: DeviceInfo.getUniqueId(),
      timezone: RNLocalize.getTimeZone(),
      device_token: DeviceInfo.getUniqueId(),
    };
    console.log('Sending api header', apiHeader);
    actions
      .getCartDetail(apiData, {}, apiHeader)
      .then(res => {
        console.log('cart details>>>', res);
        setCartData(res?.data);
        setCartItems(res?.data?.products)
        setBookingOption(res?.data?.booking_options);
        setIsShimmerLoading(false);
        setIsLoading(false);
      })
      .catch(error => {
        setIsShimmerLoading(false);
        setIsLoading(false);
        console.log(error, 'errorerrorerror');
      });

    getItem('selectedTable')
      .then(res => {})
      .catch(error => {
        setIsShimmerLoading(false);
        setIsLoading(false);
        console.log(error, 'errorerrorerror');
      });
  };

  const onPressBookingOption = data => {
    setIsLoading(true);
    let apiData = {
      product_id: data?.product_id,
      cart_id: cartData?.id,
      booking_option_id: data?.booking_option_id,
    };
    let apiHeader = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    };
    console.log(data, 'datadatadatadatadata');

    actions
      .addBookingOption(apiData, apiHeader)
      .then(res => {
        getCartDetail();
        showSuccess(res?.data);
      })
      .catch(error => {
        showError(error?.message);
        setIsLoading(false);
      });
  };

  const _directOrderPlace = () => {
    if (!userData?.auth_token) {
      actions.setRedirection('cart');
      actions.setAppSessionData('on_login');
      return
    }
    let data = {};
    data['vendor_id'] = cartData?.products[0]?.vendor_id;
    data['address_id'] =
      dineInType != 'delivery'
        ? ''
        : paramsData?.selectedAddressData?.id || selectedAddressData?.id;
    data['payment_option_id'] = 1;

    data['type'] = dineInType || '';

    if (paramsData?.transactionId) {
      data['transaction_id'] = paramsData?.transactionId;
    }

    data['amount'] = cartData?.total_payable_amount;

    placeOrderData(data);
  };

  const placeOrderData = data => {
    console.log('Sending data', data);
    let headerData = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
      // latitude: !isEmpty(location) ? location?.latitude.toString() : '',
      // longitude: !isEmpty(location) ? location?.longitude.toString() : '',
      // systemuser: DeviceInfo.getUniqueId(),
    };
    console.log(headerData, 'headerData');

    setButtonLoader(true)
    actions
      .placeOrder(data, headerData)
      .then(res => {
        navigation.navigate(navigationStrings.ORDERSUCESS, 
        {data :{orderDetail: res?.data}
        })
        setButtonLoader(false)
      })
      .catch(error => {
        setButtonLoader(false)

      });
  };
  const onPressCartClear = () => {
    removeItem('selectedTable');
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
      .then((res) => {
        actions.cartItemQty({});
        console.log(res, '<==resOccured');
        setCartItems([]);
        setCartData({});
        showSuccess(res?.message);
      })
      .catch(err => {
        console.log(err, "errr>>?")
        showError(err?.message)
      }
      );
  }

  const _finalPayment = () => {

      if (selectedPayment?.id == 4 && selectedPayment?.off_site == 0) {
      _offineLinePayment(cartData);
      return;
      }else {
      _directOrderPlace();
    }

  };

  const _paymentWithStripe = async (
    cardInfo,
    tokenInfo,
    paymentMethodId,
    order_number,
  ) => {
    actions.getStripePaymentIntent(
      // `?amount=${amount}&payment_method_id=${res?.paymentMethod?.id}`,
      {
        payment_option_id: selectedPayment?.id,
        action: 'cart',
        amount:
          Number(cartData?.total_payable_amount),
        payment_method_id: paymentMethodId,
        order_number: order_number,
        card: cardInfo,
      },
      {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      },
    )
      .then(async (res) => {
        console.log(res,'errorerrorerror');

        if (res && res?.client_secret) {
          const { paymentIntent, error } = await handleNextAction(
            res?.client_secret,
          );
          console.log(paymentIntent,'errorerrorerror');
          if (paymentIntent) {
            if (paymentIntent) {
              actions.confirmPaymentIntentStripe(
                {
                  order_number: order_number,
                  payment_option_id: selectedPayment?.id,
                  action: 'cart',
                  amount:
                    Number(cartData?.total_payable_amount),
                  payment_intent_id: paymentIntent?.id,
                  address_id: selectedAddressData?.id,
                  tip: 0,
                },
                {
                  code: appData?.profile?.code,
                  currency: currencies?.primary_currency?.id,
                  language: languages?.primary_language?.id,
                },
              )
                .then((res) => {
                  console.log(res, 'secondresponse');
                  updateState({ isRefreshing: false });
                  setIsRefreshing(false)
                  if (res && res?.status == 'Success' && res?.data) {
                    // updateState({allAvailAblePaymentMethods: res?.data});
                    actions.cartItemQty({});
                    setCartItems([]);
                    setCartData({});
                    actions.reloadData(!reloadData);
                    setSelectedPayment({
                      id: 1,
                      off_site: 0,
                      title: 'Cash On Delivery',
                      title_lng: strings.CASH_ON_DELIVERY,
                    });

                    setIsLoading(false)
                    moveToNewScreen(navigationStrings.ORDERSUCESS, {
                      orderDetail: res?.data,
                    })();
                    showSuccess(res?.message);
                  } else {
                    setSelectedPayment({
                      id: 1,
                      off_site: 0,
                      title: 'Cash On Delivery',
                      title_lng: strings.CASH_ON_DELIVERY,
                    });
                    setIsLoading(false)
                  }
                })
                .catch(errorMethod);
            }
          } else {
            setIsLoading(false)
            setIsRefreshing(false)
            console.log(error, 'error');
            showError(error?.message || 'payment failed');
          }
        } else {
          setIsLoading(false)
        }
      })
      .catch(errorMethod);
  };

  //Offline payments
  const _offineLinePayment = async (order_number) => {
    console.log("payment method id++++",order_number, cardInfo,tokenInfo,paymentMethodId)
    if (!!paymentMethodId) {
      _paymentWithStripe(cardInfo, tokenInfo, paymentMethodId, order_number);
    } else {
      errorMethod(strings.NOT_ADDED_CART_DETAIL_FOR_PAYMENT_METHOD);
    }
  };

  const errorMethod = (error) => {
    console.log(error, '<==errorOccured');
    setIsLoading(false)
    setIsRefreshing(false)
    showError(
      error?.error?.description ||
      error?.description ||
      error?.message ||
      error?.error ||
      error,
    );
  };

  if (isShimmerLoading) {
    return <ReviewBookingShimmerLoader />;
  }

  const ListEmptyComp = () => {
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            // flex: 1,
            
            justifyContent: 'center',
            alignItems: 'center',
          
            // backgroundColor: '#fff',
          }}>
          <FastImage
            source={{
              uri: Image.resolveAssetSource(imagePath.icEmptyCartD).uri,
              cache: FastImage.cacheControl.immutable,
              priority: FastImage.priority.high,
            }}
            style={{
              marginVertical: moderateScaleVertical(20),
              height: moderateScale(120),
              width: moderateScale(120),
            }}
            tintColor={isDarkMode && colors.white}
            // resizeMode="contain"s
          />

          <Text
            style={{
              ...styles.textStyle,
              color: isDarkMode ? colors.white : colors.blackOpacity40,
            }}>
            {strings.YOUR_CART_EMPTY_ADD_ITEMS}
          </Text>
        </View>
        <HorizontalLine
          lineStyle={{
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode
              ? colors.whiteOpacity77
              : colors.greyA,
            marginVertical: moderateScaleVertical(16),
          }}
        />
      </View>
    );
  };
  return (
    <WrapperContainer isLoading={isLoading}>

        <Header
        centerTitle={strings.REVIEW_BOOKING}
        leftIcon={imagePath.icBackb}
        onPressLeft={() => navigation.popToTop()}
        rightViewStle={{alignSelf:'flex-end',}}
        rightIcon={!isEmpty(cartData?.products) && imagePath.deleteRoyo}
        rightIconStyle={{height:moderateScale(20),width:moderateScale(20),  resizeMode:'contain'}}
      onPressRight={onPressCartClear}
      righttextview={{flex:0.3,justifyContent:'flex-end'}}
        // onPressRightTxt={() => openClearCartModal()}
        // onPressLeft={() => navigation.navigate(navigationStrings.HOMESTACK)}
      />
      {/* <ScrollView
        showsVerticalScrollIndicator={false}
        style={{marginBottom: moderateScaleVertical(104)}}> */}
      <View style={styles.mainView}>
        <FlatList
          data={cartItems || []}
          refreshing={isRefreshing}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => getCartDetail()}
              tintColor={themeColors.primary_color}
            />
          }
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            return (
              <CarAndYatchInfoCard
                item={item}
                index={index}
                onPressBookingOption={onPressBookingOption}
              />
            );
          }}
          ItemSeparatorComponent={() => (
            <View style={{height: moderateScale(20)}} />
          )}
          ListEmptyComponent={() =>
            !isShimmerLoading ? <ListEmptyComp /> : <></>
          }
        />
      </View>
      {/* </ScrollView> */}
      {!isEmpty(cartData?.products) ? (
        <AtlanticBottom
          // onPress={()=>navigation.navigate(navigationStrings.PAYMENT_OPTIONS)}
          Totalprice={strings.TOTAL_PRICE}
          total={tokenConverterPlusCurrencyNumberFormater(
            cartData?.total_payable_amount,
            digit_after_decimal,
            additional_preferences,
            currencies?.primary_currency?.symbol,
          )}
          // Pricedetails={'Price Details'}
          // details={'AED 978'}
          btnText={strings.CONFRIMANDPAY}
          buttonLoader={buttonLoader}
          textStyle={{ fontSize: textScale(13) }}
          onPress={() => !!userData?.auth_token ? isEmpty(selectedPayment) ? setPaymentModal(true) :
            _directOrderPlace() : actions.setAppSessionData('on_login')
          }
        />
      ) : null}

      {/* ---------------paymentOption------------ */}
      {!!paymentModal ? (
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={[height]}
          activeOffsetY={[-1, 1]}
          failOffsetX={[-5, 5]}
          animateOnMount={true}
          handleComponent={null}>
          <BottomSheetScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={{
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.background
                : colors.backgroundGrey,
            }}>
            <SelectPaymentModal
              onSelectPayment={onSelectPayment}
              //   codMinAmount={codMinAmount}
              //   amount={orderAmount}
              paymentModalClose={() => setPaymentModal(false)}
              dineInType={dineInType}
            />
          </BottomSheetScrollView>
        </BottomSheet>
      ) : null}
    </WrapperContainer>
  );
};

// define your styles

//make this component available to the app
export default ReviewBooking;
