import {
  CardField,
  StripeProvider,
  createPaymentMethod,
  createToken,
  handleNextAction,
  initStripe,
} from '@stripe/stripe-react-native';
import axios from 'axios';
import { PayWithFlutterwave } from 'flutterwave-react-native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import RazorpayCheckout from 'react-native-razorpay';
import { useSelector } from 'react-redux';
import CheckoutPaymentView from '../../Components/CheckoutPaymentView';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import PaymentGateways from '../../Components/PaymentGateways';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { getImageUrl, showError, showSuccess } from '../../utils/helperFunctions';
import { generateTransactionRef, payWithCard } from '../../utils/paystackMethod';
import useInterval from '../../utils/useInterval';
import { getColorSchema } from '../../utils/utils';

export default function BuyGiftcardPayment({ navigation, route }) {
  const giftCard = route?.params?.giftCard;

  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const { appData, themeColors, appStyle, currencies, languages } = useSelector(
    (state) => state?.initBoot,
  );
  const userData = useSelector((state) => state.auth.userData);
  const { preferences } = appData?.profile || {};
  const fontFamily = appStyle?.fontSizeData;

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [cardInfo, setCardInfo] = useState(null);

  // PlugnPay card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cvc, setCvc] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [year, setYear] = useState('');
  const [date, setDate] = useState('');
  const [accept, setAccept] = useState(false);
  const [cardFill, setCardFill] = useState(true);
  const [savedCardData, setSavedCardData] = useState([]);
  const [selectedSavedCard, setSelectedSavedCard] = useState(null);

  // FlutterWave
  const [isModalVisibleForPayFlutterWave, setIsModalVisibleForPayFlutterWave] = useState(false);
  const [paymentDataFlutterWave, setPaymentDataFlutterWave] = useState(null);

  // MTN Gateway
  const [isVisibleMtnGateway, setIsVisibleMtnGateway] = useState(false);
  const [mtnGatewayResponse, setMtnGatewayResponse] = useState('');
  const [responseTimer] = useState(420);

  const textColor = isDarkMode ? MyDarkTheme.colors.text : colors.textGrey;
  const cardBg = isDarkMode ? MyDarkTheme.colors.lightDark : colors.white;
  const sectionBg = isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey;

  const amount = giftCard?.amount ?? giftCard?.price;

  const headers = {
    code: appData?.profile?.code,
    currency: currencies?.primary_currency?.id,
    language: languages?.primary_language?.id,
  };

  useEffect(() => {
    fetchPaymentOptions();
    if (preferences?.stripe_publishable_key) {
      initStripe({
        publishableKey: preferences.stripe_publishable_key,
        merchantIdentifier: 'merchant.identifier',
      });
    }
  }, []);

  useEffect(() => {
    if (!isVisibleMtnGateway && mtnGatewayResponse) {
      showError('Request TimeOut');
      navigation.goBack();
    }
  }, [isVisibleMtnGateway]);

  useInterval(
    () => {
      if (!!isVisibleMtnGateway) { paymentReponse(mtnGatewayResponse); }
    },
    !!isVisibleMtnGateway ? 3000 : null,
  );

  const fetchPaymentOptions = async () => {
    setIsLoading(true);
    try {
      const res = await actions.getListOfPaymentMethod('/wallet', {}, headers);
      if (res?.data) {
        setPaymentMethods(res.data);
        res.data.forEach((item) => {
          if (item.id == 50) getSavedCardList();
        });
      }
    } catch (error) {
      showError(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getSavedCardList = () => {
    actions.getSavedCardsList({}, headers)
      .then((res) => {
        if (res?.data) setSavedCardData(res.data);
      })
      .catch(() => {});
  };

  const errorMethod = (error) => {
    setIsBuying(false);
    showError(
      error?.error?.explanation ||
        error?.error?.reason ||
        error?.message ||
        error?.error,
    );
  };

  const checkInputHandler = (type, data) => {
    if (type === 'Card Number') {
      setCardNumber(data.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim());
    }
    if (type === 'ExpiryDate') {
      const ed = data
        .replace(/^([1-9]\/|[2-9])$/g, '0$1/')
        .replace(/^(0[1-9]{1}|1[0-2]{1})$/g, '$1/')
        .replace(/^([0-1]{1})([3-9]{1})$/g, '0$1/$2')
        .replace(/^(\d)\/(\d\d)$/g, '0$1/$2')
        .replace(/^(0?[1-9]{1}|1[0-2]{1})([0-9]{2})$/g, '$1/$2')
        .replace(/^([0]{1,})\/|[0]{1,}$/g, '0')
        .replace(/[^\d\/]|^[\/]{0,}$/g, '')
        .replace(/\/\//g, '/').trim();
      setExpiryDate(ed);
    }
    if (type === 'CVC') setCvc(data);
    if (type === 'Year') setYear(data.replace(/^\d{5}$/).trim());
    if (type === 'Date') setDate(data.replace(/^([1-9]\/|[2-9])$/g, '0$1').trim());
  };

  // ─── Stripe flow ──────────────────────────────────────────────────────────

  const _onChangeStripeData = (cardDetails) => {
    setCardInfo(cardDetails?.complete ? cardDetails : null);
  };

  const _createPaymentMethod = async (info, tokenId) => {
    try {
      const res = await createPaymentMethod({
        paymentMethodType: 'Card',
        card: info,
        token: tokenId,
      });

      if (res?.error?.message) {
        showError(res.error.message);
        setIsBuying(false);
        return;
      }

      const intentRes = await actions.getStripePaymentIntent(
        {
          payment_option_id: selectedPayment?.id,
          action: 'giftCard',
          amount: amount,
          payment_method_id: res?.paymentMethod?.id,
        },
        headers,
      );

      if (!intentRes?.client_secret) {
        setIsBuying(false);
        return;
      }

      const { paymentIntent, error } = await handleNextAction(intentRes.client_secret);

      if (!paymentIntent) {
        setIsBuying(false);
        showError(error?.message || strings.PAYMENT_FAILED || 'Payment failed');
        return;
      }

      const confirmRes = await actions.confirmPaymentIntentStripe(
        {
          payment_option_id: selectedPayment?.id,
          action: 'giftCard',
          amount: amount,
          payment_intent_id: paymentIntent?.id,
          gift_card_id: giftCard?.id,
        },
        headers,
      );

      if (confirmRes) {
        setIsBuying(false);
        Alert.alert('', confirmRes?.message || strings.PAYMENT_SUCCESS || 'Payment successful!', [
          {
            text: strings.OK,
            onPress: () => {
              navigation.goBack();
              navigation.goBack();
            },
          },
        ]);
      }
    } catch (error) {
      errorMethod(error);
    }
  };

  const _processStripePayment = async () => {
    if (!cardInfo) {
      showError(strings.ENTER_VALID_DETAILS || 'Please enter valid card details');
      return;
    }
    setIsBuying(true);
    try {
      const tokenRes = await createToken({ ...cardInfo, type: 'Card' });
      if (tokenRes?.error?.localizedMessage) {
        showError(tokenRes.error.localizedMessage);
        setIsBuying(false);
        return;
      }
      if (tokenRes?.token?.id) {
        await _createPaymentMethod(cardInfo, tokenRes.token.id);
      }
    } catch (error) {
      errorMethod(error);
    }
  };

  // ─── Checkout.com ─────────────────────────────────────────────────────────

  const _checkoutPayment = (token) => {
    let selectedMethod = selectedPayment.title.toLowerCase();
    actions
      .openPaymentWebUrl(
        `/${selectedMethod}?amount=${amount}&payment_option_id=${selectedPayment?.id}&token=${token}&action=giftCard`,
        {},
        headers,
      )
      .then((res) => {
        if (res?.status == 'Success' && res?.data) {
          Alert.alert('', strings.PAYMENT_SUCCESS, [
            { text: strings.OK, onPress: () => { navigation.goBack(); navigation.goBack(); } },
          ]);
        }
      })
      .catch(errorMethod);
  };

  // ─── Razorpay ─────────────────────────────────────────────────────────────

  const renderRazorPay = () => {
    const options = {
      description: 'Payment for gift card',
      image: getImageUrl(
        appData?.profile?.logo?.image_fit,
        appData?.profile?.logo?.image_path,
        '1000/1000',
      ),
      currency: currencies?.primary_currency?.iso_code,
      key: preferences?.razorpay_api_key,
      amount: amount * 100,
      name: appData?.profile?.company_name,
      prefill: {
        email: userData?.email,
        contact: userData?.phone_number || '',
        name: userData?.name,
      },
      theme: { color: themeColors?.primary_color },
    };

    RazorpayCheckout.open(options)
      .then((res) => {
        if (res?.razorpay_payment_id) {
          const data = {
            amount: amount,
            transaction_id: res?.razorpay_payment_id,
          };
          actions.walletCredit(data, headers)
            .then(() => {
              Alert.alert('', strings.PAYMENT_SUCCESS, [
                {
                  text: strings.OK,
                  onPress: () => { navigation.goBack(); navigation.goBack(); },
                },
              ]);
            })
            .catch(errorMethod);
        }
      })
      .catch(errorMethod);
  };

  // ─── PayTabs ──────────────────────────────────────────────────────────────

  const openPayTabs = async (data) => {
    data['serverKey'] = preferences?.paytab_server_key;
    data['clientKey'] = preferences?.paytab_client_key;
    data['profileID'] = preferences?.paytab_profile_id;
    data['currency'] = currencies?.primary_currency?.iso_code;
    data['merchantname'] = appData?.profile?.company_name;
    data['countrycode'] = appData?.profile?.country?.code;

    try {
      const res = await payWithCard(data);
      if (res?.transactionReference) {
        const apiData = {
          payment_option_id: data?.payment_option_id,
          transaction_id: res?.transactionReference,
          amount: data?.total_payable_amount,
          action: 'giftCard',
        };
        actions.openPaytabUrl(apiData, headers)
          .then((res) => {
            if (res?.status == 'Success') {
              navigation.goBack();
              navigation.goBack();
            }
          })
          .catch(errorMethod);
      }
    } catch (error) {
      console.log('PayTabs error', error);
    }
  };

  // ─── FlutterWave ──────────────────────────────────────────────────────────

  var redirectTimeout;
  const handleOnRedirect = (data) => {
    clearTimeout(redirectTimeout);
    redirectTimeout = setTimeout(() => {
      setIsModalVisibleForPayFlutterWave(false);
    }, 200);
    try {
      if (data?.transaction_id) {
        const apiData = {
          payment_option_id: paymentDataFlutterWave?.payment_option_id,
          transaction_id: data?.transaction_id,
          amount: paymentDataFlutterWave?.total_payable_amount,
          action: 'giftCard',
        };
        actions
          .openSdkUrl(
            `/${paymentDataFlutterWave?.selectedPayment?.code?.toLowerCase()}`,
            apiData,
            headers,
          )
          .then((res) => {
            if (res?.status == 'Success') {
              navigation.goBack();
              navigation.goBack();
            } else {
              redirectTimeout = setTimeout(() => setIsModalVisibleForPayFlutterWave(false), 200);
            }
          })
          .catch(errorMethod);
      } else {
        redirectTimeout = setTimeout(() => setIsModalVisibleForPayFlutterWave(false), 200);
      }
    } catch (error) {
      redirectTimeout = setTimeout(() => setIsModalVisibleForPayFlutterWave(false), 200);
    }
  };

  // ─── MTN Gateway ──────────────────────────────────────────────────────────

  const paymentReponse = (res) => {
    axios({
      method: 'get',
      url: res?.responseUrl,
      headers: {
        ...headers,
        authorization: `${userData?.auth_token}`,
      },
    })
      .then((response) => {
        if (response?.data?.status == 'SUCCESSFUL') {
          setIsVisibleMtnGateway(false);
          showSuccess(response?.data?.message);
          navigation.goBack();
          navigation.goBack();
        }
      })
      .catch((error) => {
        setMtnGatewayResponse('');
        setIsVisibleMtnGateway(false);
        showError(error?.response?.data?.message);
        navigation.goBack();
      });
  };

  const mtnGateway = () => {
    setIsBuying(true);
    const data = {
      amount: amount,
      currency: currencies?.primary_currency?.iso_code,
      order_no: '',
      subscription_id: '',
      from: 'wallet',
    };
    actions.mtnGateway(data, headers)
      .then((res) => {
        setIsBuying(false);
        if (res?.status == 'Success') {
          setIsVisibleMtnGateway(true);
          setMtnGatewayResponse(res);
          paymentReponse(res);
        }
      })
      .catch((err) => {
        setIsBuying(false);
        showError(err?.message);
      });
  };

  // ─── Web payment (PayPal, PayStack, etc.) ─────────────────────────────────

  const _webPayment = () => {
    const selectedMethod = selectedPayment.code;
    const returnUrl = `payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/giftCard`;
    const cancelUrl = `payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/giftCard`;
    let queryData = `/${selectedMethod}?amount=${amount}&returnUrl=${returnUrl}&cancelUrl=${cancelUrl}&payment_option_id=${selectedPayment?.id}&action=giftCard`;
    if (selectedPayment?.id == 57) queryData += `&come_from=app`;
    if (selectedPayment?.id == 59) queryData += `&come_from=app&auth_token=${userData?.auth_token}`;

    setIsBuying(true);
    actions.openPaymentWebUrl(queryData, {}, headers)
      .then((res) => {
        setIsBuying(false);
        if (
          res &&
          (res?.status == 'Success' || res?.status == '200') &&
          (res?.data || res?.payment_link || res?.redirect_url || res?.payment_url)
        ) {
          const sendingData = {
            id: selectedPayment.id,
            title: selectedPayment.title,
            screenName: navigationStrings.GIFT_CARD,
            paymentUrl: res?.data || res?.payment_link || res?.redirect_url || res?.payment_url,
            action: 'giftCard',
          };
          navigation.navigate(navigationStrings.ALL_IN_ONE_PAYMENTS, { data: sendingData });
        } else if (res?.status == '201') {
          showError(res?.message || '');
        }
      })
      .catch(errorMethod);
  };

  // ─── PlugnPay (49/50/53) ──────────────────────────────────────────────────

  const _paymentWithPlugnPayMethods = () => {
    setIsBuying(true);
    const selectedMethod = selectedPayment.code;
    const CardNumber = cardNumber.split(' ').join('') || ' ';
    const expirydate = selectedPayment?.id == 50 ? year.concat(date) || ' ' : expiryDate || ' ';
    const savedCardId = selectedSavedCard?.id || '';
    const saveCard = accept ? 1 : 0;
    let queryData = `/${selectedMethod}?amount=${amount}&cv=${cvc}&dt=${expirydate}&cno=${CardNumber}&card_id=${savedCardId}&action=giftCard&come_from=app`;
    if (selectedPayment?.id == 50 && !!CardNumber) queryData += `&save_card=${saveCard}`;

    actions.openPaymentWebUrl(queryData, {}, headers)
      .then((res) => {
        if (res?.status == 'Success' || res?.status == 200) {
          setIsBuying(false);
          navigation.goBack();
          navigation.goBack();
        }
      })
      .catch((err) => {
        setIsBuying(false);
        showError(err?.msg);
      });
  };

  // ─── Main pay handler ──────────────────────────────────────────────────────

  const handlePay = () => {
    if (!selectedPayment) {
      showError(strings.PLEASE_SELECT_PAYMENT_METHOD);
      return;
    }

    if (selectedPayment?.off_site == 0 && selectedPayment?.id == 10) {
      renderRazorPay();
      return;
    }

    if (selectedPayment?.id == 27) {
      openPayTabs({ payment_option_id: selectedPayment?.id, total_payable_amount: amount });
      return;
    }

    if (selectedPayment?.id == 30) {
      setPaymentDataFlutterWave({
        payment_option_id: selectedPayment?.id,
        total_payable_amount: amount,
        selectedPayment: selectedPayment,
      });
      setIsModalVisibleForPayFlutterWave(true);
      return;
    }

    if (selectedPayment?.id == 48) {
      mtnGateway();
      return;
    }

    if (
      selectedPayment?.off_site == 1 &&
      selectedPayment?.id !== 49 &&
      selectedPayment?.id !== 50 &&
      selectedPayment?.id != 53
    ) {
      _webPayment();
      return;
    }

    if (
      selectedPayment?.id == 49 ||
      selectedPayment?.id == 50 ||
      selectedPayment?.id === 53
    ) {
      _paymentWithPlugnPayMethods();
      return;
    }

    // Stripe (off_site == 0, id == 4)
    if (selectedPayment?.off_site == 0 && selectedPayment?.id === 4) {
      _processStripePayment();
      return;
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  const imageUri = giftCard?.image?.image_path
    ? getImageUrl(giftCard?.image?.proxy_url, giftCard?.image?.image_path, '400/200')
    : null;

  const renderPaymentItem = ({ item }) => {
    const isSelected = selectedPayment?.id === item?.id;
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setSelectedPayment(isSelected ? null : item);
            setCardInfo(null);
            setCardNumber('');
            setYear('');
            setDate('');
            setExpiryDate('');
            setCvc('');
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: moderateScaleVertical(12),
            paddingHorizontal: moderateScale(16),
            borderBottomWidth: 0.5,
            borderBottomColor: isDarkMode ? colors.whiteOpacity22 : colors.borderColorB,
          }}>
          <Image
            source={isSelected ? imagePath.radioActive : imagePath.radioInActive}
            style={{ marginRight: moderateScale(12) }}
          />
          <Text
            style={{
              fontSize: textScale(14),
              fontFamily: isSelected ? fontFamily?.medium : fontFamily?.regular,
              color: isSelected
                ? themeColors?.primary_color
                : isDarkMode
                ? MyDarkTheme.colors.text
                : colors.black,
              flex: 1,
            }}>
            {item?.title_lng || item?.title}
          </Text>
        </TouchableOpacity>

        {/* Stripe card field */}
        {isSelected && item?.off_site == 0 && item?.id === 4 && (
          <StripeProvider publishableKey={preferences?.stripe_publishable_key || ''}>
            <View style={{ paddingHorizontal: moderateScale(16), paddingBottom: moderateScaleVertical(12) }}>
              <CardField
                postalCodeEnabled={false}
                placeholder={{ number: '4242 4242 4242 4242' }}
                cardStyle={{
                  backgroundColor: isDarkMode ? MyDarkTheme.colors.lightDark : colors.white,
                  textColor: isDarkMode ? colors.white : colors.black,
                  borderColor: themeColors?.primary_color || colors.borderColorB,
                  borderWidth: 1,
                  borderRadius: moderateScale(8),
                }}
                style={{
                  width: '100%',
                  height: moderateScale(50),
                  marginTop: moderateScaleVertical(8),
                }}
                onCardChange={_onChangeStripeData}
                onBlur={Keyboard.dismiss}
              />
              {cardInfo && (
                <Text
                  style={{
                    fontSize: textScale(11),
                    fontFamily: fontFamily?.regular,
                    color: colors.green || 'green',
                    marginTop: moderateScaleVertical(4),
                  }}>
                  {'\u2713'} Card details complete
                </Text>
              )}
            </View>
          </StripeProvider>
        )}

        {/* Checkout.com */}
        {isSelected && item?.off_site == 0 && item?.id === 17 && (
          <CheckoutPaymentView
            cardTokenized={(e) => {
              if (e.token) _checkoutPayment(e.token);
            }}
            cardTokenizationFailed={() => {
              showError(strings.INVALID_CARD_DETAILS);
            }}
            onPressSubmit={() => setIsBuying(true)}
            btnTitle={strings.BUY || 'Buy'}
            isSubmitBtn
            submitBtnStyle={{ width: '100%', height: moderateScale(40) }}
          />
        )}

        {/* PlugnPay ID 49/53 */}
        {!!(
          isSelected &&
          item?.off_site == 1 &&
          (item?.id === 49 || item?.id === 53)
        ) && (
          <View style={{ paddingHorizontal: moderateScale(16), paddingBottom: moderateScaleVertical(12) }}>
            <PaymentGateways
              isCardNumber={cardNumber}
              cvc={cvc}
              expiryDate={expiryDate}
              year={year}
              onChangeExpiryDateText={(data) => checkInputHandler('ExpiryDate', data)}
              onChangeText={(data) => checkInputHandler('Card Number', data)}
              onChangeCvcText={(data) => checkInputHandler('CVC', data)}
              onChangeYearText={(data) => checkInputHandler('Year', data)}
              onChangeDateText={(data) => checkInputHandler('Date', data)}
              paymentid={item?.id}
              eDate={date}
            />
          </View>
        )}

        {/* PlugnPay ID 50 with saved card toggle */}
        {!!(isSelected && item?.off_site == 1 && item?.id == 50) && (
          <View style={{ paddingHorizontal: moderateScale(16), paddingBottom: moderateScaleVertical(12) }}>
            <View style={{ flexDirection: 'row', marginTop: moderateScale(10), justifyContent: 'space-around' }}>
              <TouchableOpacity
                onPress={() => setCardFill(true)}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: moderateScaleVertical(8),
                  borderBottomWidth: cardFill ? 2 : 0,
                  borderBottomColor: themeColors?.primary_color,
                }}>
                <Text style={{ color: cardFill ? themeColors?.primary_color : colors.textGreyJ }}>
                  Card Fill
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCardFill(false)}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: moderateScaleVertical(8),
                  borderBottomWidth: !cardFill ? 2 : 0,
                  borderBottomColor: themeColors?.primary_color,
                }}>
                <Text style={{ color: !cardFill ? themeColors?.primary_color : colors.textGreyJ }}>
                  Saved Card
                </Text>
              </TouchableOpacity>
            </View>
            {cardFill ? (
              <PaymentGateways
                isCardNumber={cardNumber}
                cvc={cvc}
                expiryDate={expiryDate}
                year={year}
                onChangeExpiryDateText={(data) => checkInputHandler('ExpiryDate', data)}
                onChangeText={(data) => checkInputHandler('Card Number', data)}
                onChangeCvcText={(data) => checkInputHandler('CVC', data)}
                onChangeYearText={(data) => checkInputHandler('Year', data)}
                onChangeDateText={(data) => checkInputHandler('Date', data)}
                paymentid={item?.id}
                eDate={date}
              />
            ) : (
              <FlatList
                keyExtractor={(itm, inx) => String(inx)}
                data={savedCardData}
                renderItem={({ item: card }) => (
                  <TouchableOpacity
                    onPress={() =>
                      setSelectedSavedCard(selectedSavedCard?.id == card?.id ? null : card)
                    }
                    style={{ flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(6) }}>
                    <Image
                      source={selectedSavedCard?.id == card?.id ? imagePath.radioActive : imagePath.radioInActive}
                    />
                    <View style={{ marginLeft: moderateScale(10) }}>
                      <Text style={{ color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>
                        Card No: {card?.card_hint}
                      </Text>
                      <Text style={{ color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>
                        Exp: {card?.expiration}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                  <Text style={{ textAlign: 'center', color: colors.textGreyLight }}>No Saved Cards</Text>
                )}
              />
            )}
          </View>
        )}
      </>
    );
  };

  return (
    <WrapperContainer bgColor={sectionBg} isLoadingB={false}>
      <Header centerTitle={strings.BUY_GIFT_CARD} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: moderateScaleVertical(40) }}>

        {/* ── Gift Card Preview ── */}
        <View
          style={{
            backgroundColor: cardBg,
            borderRadius: moderateScale(12),
            marginHorizontal: moderateScale(16),
            marginTop: moderateScaleVertical(16),
            overflow: 'hidden',
            elevation: 2,
            shadowColor: colors.black,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
          }}>
          {imageUri ? (
            <FastImage
              source={{ uri: imageUri }}
              style={{ width: '100%', height: moderateScale(180) }}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
            <View
              style={{
                width: '100%',
                height: moderateScale(180),
                backgroundColor: (themeColors?.primary_color || colors.themeColor) + '33',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: themeColors?.primary_color || colors.themeColor,
                  fontSize: textScale(22),
                  fontFamily: fontFamily?.bold,
                }}>
                {giftCard?.name || strings.GIFT_CARD}
              </Text>
            </View>
          )}

          <View
            style={{
              padding: moderateScale(16),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: textScale(16),
                  fontFamily: fontFamily?.medium,
                  color: textColor,
                  marginBottom: moderateScaleVertical(4),
                }}>
                {giftCard?.name}
              </Text>
              {!!giftCard?.description && (
                <Text
                  style={{
                    fontSize: textScale(12),
                    fontFamily: fontFamily?.regular,
                    color: colors.textGreyLight,
                  }}>
                  {giftCard?.description}
                </Text>
              )}
            </View>
            <View
              style={{
                backgroundColor: (themeColors?.primary_color || colors.themeColor) + '20',
                borderRadius: moderateScale(8),
                paddingHorizontal: moderateScale(12),
                paddingVertical: moderateScaleVertical(6),
              }}>
              <Text
                style={{
                  fontSize: textScale(18),
                  fontFamily: fontFamily?.bold,
                  color: themeColors?.primary_color || colors.themeColor,
                }}>
                {currencies?.primary_currency?.symbol}{amount}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Payment Methods ── */}
        <Text
          style={{
            fontSize: textScale(15),
            fontFamily: fontFamily?.semiBold || fontFamily?.medium,
            color: textColor,
            marginHorizontal: moderateScale(16),
            marginTop: moderateScaleVertical(24),
            marginBottom: moderateScaleVertical(8),
          }}>
          {strings.DEBIT_FROM || 'Select Payment Method'}
        </Text>

        <View
          style={{
            backgroundColor: cardBg,
            borderRadius: moderateScale(12),
            marginHorizontal: moderateScale(16),
            overflow: 'hidden',
            elevation: 2,
            shadowColor: colors.black,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
          }}>
          {isLoading ? (
            <ActivityIndicator
              color={themeColors?.primary_color}
              style={{ padding: moderateScale(24) }}
            />
          ) : paymentMethods.length === 0 ? (
            <Text
              style={{
                textAlign: 'center',
                padding: moderateScale(20),
                fontSize: textScale(13),
                color: colors.textGreyLight,
                fontFamily: fontFamily?.regular,
              }}>
              {strings.NO_PAYMENT_METHOD}
            </Text>
          ) : (
            <FlatList
              data={paymentMethods}
              keyExtractor={(item, index) => String(item?.id ?? index)}
              renderItem={renderPaymentItem}
              scrollEnabled={false}
            />
          )}
        </View>

        {/* ── Pay Button (hidden for Checkout.com which has its own submit) ── */}
        {selectedPayment?.id !== 17 && (
          <View
            style={{
              marginHorizontal: moderateScale(16),
              marginTop: moderateScaleVertical(24),
            }}>
            <GradientButton
              colorsArray={[
                themeColors?.primary_color || colors.themeColor,
                themeColors?.primary_color || colors.themeColor,
              ]}
              textStyle={{ textTransform: 'none', fontSize: textScale(14) }}
              btnText={`${strings.BUY} ${currencies?.primary_currency?.symbol}${amount}`}
              onPress={handlePay}
              indicator={isBuying}
              indicatorColor={colors.white}
              btnStyle={{
                width: width - moderateScale(32),
                borderRadius: moderateScale(8),
              }}
            />
          </View>
        )}
      </ScrollView>

      {/* ── FlutterWave Modal ── */}
      <Modal
        onBackdropPress={() => setIsModalVisibleForPayFlutterWave(false)}
        isVisible={isModalVisibleForPayFlutterWave}
        style={{ margin: 0, justifyContent: 'flex-end' }}>
        <View
          style={{
            padding: moderateScale(20),
            backgroundColor: colors.white,
            height: height / 8,
            justifyContent: 'flex-end',
          }}>
          {!!preferences?.flutterwave_public_key && (
            <PayWithFlutterwave
              onAbort={() => setIsModalVisibleForPayFlutterWave(false)}
              onRedirect={handleOnRedirect}
              options={{
                tx_ref: generateTransactionRef(10),
                authorization: preferences?.flutterwave_public_key,
                customer: {
                  email: userData?.email,
                  name: userData?.name,
                },
                amount: paymentDataFlutterWave?.total_payable_amount,
                currency: currencies?.primary_currency?.iso_code,
                payment_options: 'card',
              }}
            />
          )}
        </View>
      </Modal>

      {/* ── MTN Gateway Modal ── */}
      <Modal isVisible={isVisibleMtnGateway}>
        <View
          style={{
            height: moderateScaleVertical(150),
            backgroundColor: 'white',
            borderRadius: moderateScale(15),
          }}>
          <Text
            style={{
              color: themeColors?.primary_color,
              fontSize: textScale(15),
              padding: moderateScale(10),
            }}>
            Waiting for response ....
          </Text>
          <View style={{ justifyContent: 'center', alignItems: 'center', padding: moderateScale(25) }}>
            <CountdownCircleTimer
              isPlaying
              duration={Number(responseTimer)}
              colors={[themeColors?.primary_color]}
              size={60}
              strokeWidth={5}>
              {({ remainingTime }) => {
                if (remainingTime == 1 && responseTimer != null) setIsVisibleMtnGateway(false);
                const seconds = parseInt(remainingTime);
                const format =
                  moment.duration(seconds, 'seconds').minutes() +
                  ':' +
                  moment.duration(seconds, 'seconds').seconds();
                return <Text>{format}</Text>;
              }}
            </CountdownCircleTimer>
          </View>
        </View>
      </Modal>
    </WrapperContainer>
  );
}
