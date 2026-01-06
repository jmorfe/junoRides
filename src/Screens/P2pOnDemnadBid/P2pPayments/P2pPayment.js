//import liraries
import {
    createPaymentMethod,
    createToken,
    handleNextAction,
    StripeProvider
} from '@stripe/stripe-react-native';
import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Shadow } from 'react-native-shadow-2';
import { useSelector } from 'react-redux';
import AddPaymentCard from '../../../Components/AddPaymentCard';
import ButtonWithLoader from '../../../Components/ButtonWithLoader';
import OoryksHeader from '../../../Components/OoryksHeader';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import {
    moderateScale,
    moderateScaleVertical,
    textScale,
    width,
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import { getCardImage } from '../../../utils/commonFunction';
import { getColorCodeWithOpactiyNumber, showError, showSuccess } from '../../../utils/helperFunctions';
import { getColorSchema } from '../../../utils/utils';

// create a component
const P2pPayment = ({ navigation, route, item }) => {
    const paramData = route?.params?.data?.data;
    const bottomSheetRef = useRef(null);

    const {
        appData,
        currencies,
        languages,
        appStyle,
        themeColors,
        themeToggle,
        themeColor,
    } = useSelector(state => state?.initBoot);
    const { reloadData } = useSelector(state => state?.reloadData || {});
    const { selectedAddress } = useSelector(state => state?.cart || {});
    const { dineInType, location } = useSelector(state => state?.home);
    const { cartItemCount } = useSelector((state) => state?.cart);

    const { preferences } = appData?.profile;
    const fontFamily = appStyle?.fontSizeData;
    const darkthemeusingDevice = getColorSchema();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const styles = stylesFunc({ fontFamily });


    const moveToNewScreen =
        (screenName, data = {}) =>
            () => {
                navigation.navigate(screenName, { data });
            };

    const headers = {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
    };

    const [paymentMethods, setPaymentMethods] = useState([]);
    const [isAddNewCardModal, setisAddNewCardModal] = useState(false);
    const [cardHolderName, setCardHolderName] = useState('')
    const [cardBankName, setCardBankName] = useState('')
    const [isLoadingSaveCard, setisLoadingSaveCard] = useState(false)
    const [cardDetails, setcardDetails] = useState({})
    const [isLoading, setisLoading] = useState(false)

    const [selectedPayment, setSelectedPayment] = useState({
        code: 'cod',
        credentials: '{"cod_min_amount": "1"}',
        id: 1,
        off_site: 0,
        title: 'Cash On Delivery',
        title_lng: 'Cash On Delivery',
    });
    const [paymentMethodId, setPaymentMethodId] = useState(null);
    const [cardInfo, setCardInfo] = useState(null);
    const [tokenInfo, setTokenInfo] = useState(null);
    const [isPlaceOrderLoading, setisPlaceOrderLoading] = useState(false);
    const [savedPaymentCards, setsavedPaymentCards] = useState([]);
    const [selectedPaymentCard, setSelectedPaymentCard] = useState({})
    const [cvv, setCvv] = useState('')

    useEffect(() => {
        getListOfPaymentMethod();
    }, []);


    //Error handling in screen
    const errorMethod = error => {
        console.log(error, '<==errorOccurred');
        setisPlaceOrderLoading(false);
        setisLoading(false)
        setisAddNewCardModal(false)
        showError(
            error?.error?.description ||
            error?.description ||
            error?.message ||
            error?.error ||
            error,
        );
    };


    //Get list of all payment method
    const getListOfPaymentMethod = () => {
        const apiData = `/cart?service_type=${dineInType}`;
        actions
            .getListOfPaymentMethod(apiData, {}, headers)
            .then(res => {
                console.log(res, 'allpayments gate');
                if (res && res?.data) {
                    setPaymentMethods(res?.data);
                    setSelectedPayment(res?.data[0])
                    if (res?.data[0]?.id === 4) {
                        getAllPaymentCards()

                    }

                }
            })
            .catch(errorMethod);
    };

    const getAllPaymentCards = () => {
        actions
            .getAllPaymentCards(
                {},
                {
                    code: appData?.profile?.code,
                    currency: currencies?.primary_currency?.id,
                    language: languages?.primary_language?.id,
                },
            )
            .then(res => {
                console.log(res, '<-----res');
                setisLoading(false)
                setisLoadingSaveCard(false)
                setisAddNewCardModal(false)
                if (!isEmpty(res?.data)) {
                    setsavedPaymentCards(res?.data);
                    setSelectedPaymentCard(res?.data[0])
                }


            })
            .catch(errorMethod);
    };



    const _directOrderPlace = () => {
        if (isEmpty(selectedPayment)) {
            showError(strings.SELECT_PAYMENT_METHOD);
            return;
        }
        let data = {};
        data['vendor_id'] = paramData?.productDetails?.vendor_id;
        data['address_id'] = dineInType != 'delivery' ? '' : selectedAddress?.id;
        data['payment_option_id'] = selectedPayment?.id || 1;

        data['type'] = dineInType || '';
        data['is_gift'] = 0;
        data['specific_instructions'] = '';
        data['amount'] = Number(paramData?.totalPayableAmount);
        // data['plateform_fee'] = Number(cartItemCount?.data?.plateform_fee);
        data['days'] = cartItemCount?.data?.products[0]?.vendor_products[0]?.days
        data['product_price'] = paramData?.productDetails?.price
        data['total_rental_price'] = paramData?.productDetails?.price * paramData?.productDetails.days
        placeOrderData(data);
    };


    const placeOrderData = data => {
        setisPlaceOrderLoading(true);
        const headerData = {
            ...headers,
            latitude: !isEmpty(location) ? location?.latitude.toString() : '',
            longitude: !isEmpty(location) ? location?.longitude.toString() : '',
        };
        actions
            .placeOrder(data, headerData)
            .then(respo => {
                console.log(respo, '<===res placeOrder');
                if (selectedPayment?.id === 4) {
                    let apiData = {
                        payment_option_id: selectedPayment?.id,
                        action: 'cart',
                        amount: Number(cartItemCount?.data?.total_payable_amount),
                        payment_method_id: selectedPaymentCard?.id,
                        order_number: respo?.data?.order_number,
                        days: cartItemCount?.data?.products[0]?.vendor_products[0]?.days
                    }
                    console.log(apiData, "<=== apiData")
                    actions
                        .stripePaymentIntent(
                            apiData
                            ,
                            {
                                code: appData?.profile?.code,
                                currency: currencies?.primary_currency?.id,
                                language: languages?.primary_language?.id,
                            },
                        ).then(async (res) => {
                            console.log(res, "<===res getStripePaymentIntent")
                            if (!res?.error) {
                                const { paymentIntent, error } = await handleNextAction(
                                    res?.payment_intent_client_secret,
                                );
                                console.log(paymentIntent, "paymentIntentfromNexT")
                                if (!!paymentIntent) {

                                    // actions.stripePaymentIntent(
                                    //     {
                                    //         ...apiData,
                                    //         payment_intent_id: paymentIntent?.id,

                                    //     },
                                    //     {
                                    //         code: appData?.profile?.code,
                                    //         currency: currencies?.primary_currency?.id,
                                    //         language: languages?.primary_language?.id,
                                    //     },
                                    // )
                                    //     .then((res) => {
                                    //         console.log(res, '<===res confirmPaymentIntentStripe');
                                    //         showOrderSuccess(respo)
                                    //     })
                                    //     .catch(errorMethod);
                                    showOrderSuccess(respo)

                                }
                                else {
                                    errorMethod(error?.localizedMessage)
                                }
                            }
                            else {
                                errorMethod(res?.error)
                            }

                        }).catch(errorMethod)
                }
                else {
                    showOrderSuccess(respo)
                }
            })
            .catch(errorMethod);
    };

    const showOrderSuccess = (res) => {
        setisPlaceOrderLoading(false);
        actions.reloadData(!reloadData);
        actions.cartItemQty(0);
        moveToNewScreen(navigationStrings.ORDERSUCESS, {
            orderDetail: res?.data,
            product_id: paramData?.productDetails?.product_id,
        })();
    }

    //Offline payments
    const _offineLinePayment = async order_number => {
        console.log('payment method id++++', paymentMethodId);
        if (!!paymentMethodId) {
            _paymentWithStripe(cardInfo, tokenInfo, paymentMethodId, order_number);
        } else {
            errorMethod(strings.NOT_ADDED_CART_DETAIL_FOR_PAYMENT_METHOD);
        }
    };

    const _paymentWithStripe = async (
        cardInfo,
        tokenInfo,
        paymentMethodId,
        order_number,
    ) => {
        const data = {
            payment_option_id: selectedPayment?.id,
            action: 'cart',
            amount: Number(paramData?.totalPayableAmount),
            payment_method_id: paymentMethodId,
            order_number: order_number,
            card: cardInfo,
        };
        actions
            .getStripePaymentIntent(data, headers)
            .then(async res => {
                if (res && res?.client_secret) {
                    const { paymentIntent, error } = await handleNextAction(
                        res?.client_secret,
                    );
                    if (paymentIntent) {
                        if (paymentIntent) {
                            actions
                                .confirmPaymentIntentStripe(
                                    {
                                        order_number: order_number,
                                        payment_option_id: selectedPayment?.id,
                                        action: 'cart',
                                        amount: Number(paramData?.totalPayableAmount),
                                        payment_intent_id: paymentIntent?.id,
                                        address_id: selectedAddress?.id,
                                        tip: 0,
                                    },
                                    headers,
                                )
                                .then(res => {
                                    console.log(res, '_paymentWithStripe :: secondresponse');
                                    if (res && res?.status == 'Success' && res?.data) {
                                        actions.cartItemQty({});
                                        setCartItems([]);
                                        setCartData({});
                                        actions.reloadData(!reloadData);
                                        moveToNewScreen(navigationStrings.ORDERSUCESS, {
                                            orderDetail: res.data,
                                        })();
                                        showSuccess(res?.message);
                                    } else {
                                        // setSelectedPayment({
                                        //     id: 1,
                                        //     off_site: 0,
                                        //     title: 'Cash On Delivery',
                                        //     title_lng: strings.CASH_ON_DELIVERY,
                                        // });
                                    }
                                })
                                .catch(errorMethod);
                        }
                    } else {
                        console.log(error, 'error');
                        showError(error?.message || 'payment failed');
                    }
                } else {
                }
            })
            .catch(errorMethod);
    };

    const _onChangeStripeData = cardDetails => {
        if (cardDetails?.complete) {
            selectPaymentOption(cardDetails);
        } else {
        }
    };

    const selectPaymentOption = async cardInfo => {
        if (cardInfo) {
            await createToken({ ...cardInfo, type: 'Card' })
                .then(res => {
                    console.log(res, 'stripeTokenres>>');
                    console.log(cardInfo, 'stripeTokencardInfo>>');
                    if (!!res?.error) {
                        alert(res.error.localizedMessage);
                        return;
                    }
                    if (res && res?.token && res.token?.id) {
                        _createPaymentMethod(cardInfo, res.token?.id);
                    } else {
                    }
                })
                .catch(err => {
                    console.log(err, 'err>>');
                });
        } else {
            alert(strings.NOT_ADDED_CART_DETAIL_FOR_PAYMENT_METHOD);
        }
    };

    const _createPaymentMethod = async (cardInfo, res2) => {
        if (res2) {
            await createPaymentMethod({
                token: res2,
                card: cardInfo,
                paymentMethodType: 'Card',
                billing_details: {
                    name: 'Jenny Rosen',
                },
            })
                .then(res => {
                    console.log('_createPaymentMethod res', res);
                    if (res && res?.error && res?.error?.message) {
                        showError(res?.error?.message);
                        paymentModalClose();
                    } else {
                        // onSelectPayment({
                        //     // selectedPaymentMethod,
                        //     cardInfo,
                        //     tokenInfo: res2,
                        //     payment_method_id: res?.paymentMethod?.id,
                        // });
                        if (!!cardInfo) {
                            setCardInfo(cardInfo);
                        }
                        if (!!res2) {
                            setTokenInfo(res2);
                        }
                        if (res?.paymentMethod) {
                            setPaymentMethodId(res?.paymentMethod?.id);
                        }
                        // paymentModalClose();
                    }
                })
                .catch(errorMethod);
        }
    };

    const onCardChange = (cardDetails) => {
        if (cardDetails?.validCVC === "Valid") {
            setcardDetails(cardDetails)
        }
    }


    const onSaveCardDetails = async () => {
        if (cardHolderName.replace(/\s/g, "").length < 3) {
            alert("Please enter valid card holder name")
            return
        }
        if (cardBankName.replace(/\s/g, "").length < 3) {
            alert("Please enter valid bank name")
            return
        }
        if (isEmpty(cardDetails)) {
            alert("Please enter valid card details")
            return
        }
        setisLoadingSaveCard(true)
        try {
            let cardTokenDetails = await createToken({ ...cardDetails, type: "Card" })
            if (!isEmpty(cardTokenDetails?.token)) {
                actions.addPaymentCard({
                    token: cardTokenDetails?.token?.id,
                    bank_name: cardBankName,
                    card_holder_name: cardHolderName,
                }, {
                    code: appData?.profile?.code,
                    currency: currencies?.primary_currency?.id,
                    language: languages?.primary_language?.id,
                }).then((res) => {
                    console.log(res, "<===addPaymentCard")
                    getAllPaymentCards()
                    showSuccess(res?.message)
                }).catch(errorMethod)

            }
            else throw "Invalid card details"

        } catch (error) {
            setisLoadingSaveCard(false)
            alert(JSON.stringify(error))
        }
    }



    const renderPaymentMethods = useCallback(
        ({ item, index }) => {
            return (
                <TouchableOpacity
                    onPress={() => {
                        setSelectedPayment(item);
                        if (item?.id === 4) {
                            setisLoading(true)
                            getAllPaymentCards();
                        }
                    }}
                    style={{
                        height: moderateScaleVertical(50),
                        flexDirection: "row",
                        alignItems: "center"
                    }}>
                    <Image
                        source={
                            selectedPayment?.id === item?.id
                                ? imagePath.radioActive
                                : imagePath.radioInActive
                        }
                    />
                    <Text style={{
                        fontFamily: fontFamily?.bold,
                        fontSize: textScale(14),
                        color: colors.black,
                        marginLeft: moderateScale(8)
                    }}>
                        {item?.title}
                    </Text>


                </TouchableOpacity>
            );
        },
        [paymentMethods, selectedPayment],
    );

    const renderSavedCards = useCallback(
        ({ item, index }) => {
            return (
                <View style={{
                    paddingHorizontal: moderateScale(10),
                    borderBottomWidth: 1,
                    borderColor: colors.borderColorB,


                }}>
                    <TouchableOpacity
                        onPress={() => setSelectedPaymentCard(item)}
                        style={{
                            justifyContent: "space-between",
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingBottom: moderateScaleVertical(8)

                        }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center"
                        }}>
                            <View style={{
                                borderWidth: 1,
                                borderColor: colors.borderColorB,
                                borderRadius: moderateScale(5),
                                paddingHorizontal: 2
                            }}>
                                <FastImage
                                    source={getCardImage(item?.brand)}
                                    resizeMode="contain"
                                    style={{
                                        width: moderateScale(35),
                                        height: moderateScaleVertical(35),


                                    }}
                                />
                            </View>

                            <View>
                                <Text
                                    style={{
                                        fontFamily: fontFamily?.medium,
                                        fontSize: textScale(14),
                                        marginLeft: moderateScale(12),
                                        color: isDarkMode ? MyDarkTheme.colors.text : colors.black
                                    }}
                                    numberOfLines={1}>
                                    {item.bank_name}
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: fontFamily?.medium,
                                        fontSize: textScale(14),
                                        marginLeft: moderateScale(12),
                                        color: isDarkMode ? MyDarkTheme.colors.text : colors.black
                                    }}
                                    numberOfLines={1}>
                                    xxxx xxxx xxxx {item.last4}
                                </Text>
                            </View>
                        </View>

                        <Image source={selectedPaymentCard?.id === item?.id ? imagePath.radioNewActive : imagePath.radioNewInActive} style={{
                            height: moderateScale(16), width: moderateScale(16),
                            tintColor: themeColors?.primary_color
                        }} />


                    </TouchableOpacity>

                    {/* {selectedPaymentCard?.id === item?.id && <BorderTextInput
                        keyboardType="numeric"
                        maxLength={4}
                        secureTextEntry
                        onChangeText={(text)=>setCvv(text)}
                        containerStyle={{
                            height: moderateScaleVertical(40),
                            width: moderateScale(60),
                            borderRadius: 6
                        }}
                        placeholder='CVV'

                    />} */}
                </View>
            );
        },
        [savedPaymentCards, selectedPaymentCard, isDarkMode],
    );

    console.log(paramData, "fasdfjaskhdf")

    return (
        <WrapperContainer
            bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
            isLoading={isLoading}>
            <OoryksHeader leftTitle='' />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    flexGrow: 1,
                }}>
                <View
                    style={{
                        borderRadius: 12,
                        marginTop: moderateScaleVertical(8),
                        marginHorizontal: moderateScale(16),
                    }}>

                    <Text
                        style={{
                            color: colors.greyD,
                            fontSize: textScale(12),
                            fontFamily: fontFamily?.medium,
                            marginTop: moderateScaleVertical(12),
                        }}>
                        {strings.PAYMENT.toUpperCase()}
                    </Text>
                </View>


                <View
                    style={{
                        margin: moderateScaleVertical(16),
                    }}>
                    <FlatList
                        data={paymentMethods}

                        renderItem={renderPaymentMethods}

                        ItemSeparatorComponent={() => (
                            <View style={{ width: moderateScale(8) }} />
                        )}
                    />
                </View>

                {selectedPayment?.id == 4 && (
                    <View style={{
                        paddingHorizontal: moderateScale(12)
                    }}>
                        <Shadow
                            distance={2}
                            style={{
                                width: "100%",
                                paddingVertical: moderateScaleVertical(20),
                                borderRadius: moderateScale(8),

                                backgroundColor: isDarkMode
                                    ? MyDarkTheme?.colors?.lightDark
                                    : colors.white,


                            }}>
                            <StripeProvider
                                publishableKey={preferences?.stripe_publishable_key}
                                merchantIdentifier="merchant.identifier">
                                {/*      <View
                                style={{
                                    paddingHorizontal: moderateScale(16),
                                    marginBottom: moderateScale(12),
                                }}>
                                <Text
                                    style={{
                                        fontFamily: fontFamily?.medium,
                                        fontSize: textScale(14),
                                    }}>
                                    {'Card Details'}
                                </Text>
                                <CardField
                                    postalCodeEnabled={false}
                                    placeholder={{
                                        number: '4242 4242 4242 4242',
                                    }}
                                    cardStyle={{
                                        backgroundColor: colors.white,
                                        textColor: colors.black,
                                        borderWidth: 1,
                                        borderRadius: moderateScale(4),
                                        borderColor: colors.profileInputborder,
                                    }}
                                    style={{
                                        width: '100%',
                                        height: 50,
                                        marginTop: 10,
                                    }}
                                    onCardChange={cardDetails => {
                                        _onChangeStripeData(cardDetails);
                                    }}
                                    onFocus={focusedField => {
                                        console.log('focusField', focusedField);
                                    }}
                                    onBlur={() => {
                                        Keyboard.dismiss();
                                    }}
                                />
                            </View>
                        </StripeProvider>
                        <Text
                            style={{
                                fontFamily: fontFamily?.bold,
                                fontSize: textScale(12),
                                color: colors.textGreyB,
                                textAlign: 'center',
                            }}>
                            -- or --
                        </Text> */}
                                <View
                                    style={{
                                        paddingHorizontal: moderateScale(16),
                                        // marginTop: moderateScaleVertical(12),
                                    }}>
                                    <FlatList
                                        data={savedPaymentCards}
                                        renderItem={renderSavedCards}
                                        ItemSeparatorComponent={() => (
                                            <View
                                                style={{
                                                    height: moderateScaleVertical(12),
                                                }}
                                            />
                                        )}
                                    />
                                </View>
                            </StripeProvider>
                            <TouchableOpacity
                                style={{
                                    ...styles.cardView,
                                    marginTop: moderateScaleVertical(24),
                                    marginBottom: moderateScaleVertical(28)
                                }}
                                onPress={() => setisAddNewCardModal(true)}>
                                <Image source={imagePath.icAdd} />
                                <Text style={styles.cardText}>{strings.ADD_NEW_CARD}</Text>
                            </TouchableOpacity>
                        </Shadow>
                    </View>

                )}
                <ButtonWithLoader
                isLoading={isPlaceOrderLoading}
                btnText={strings.PAYNOW}
                disabled={selectedPayment?.id === 4 && isEmpty(selectedPaymentCard)}
                onPress={_directOrderPlace}
                btnStyle={{
                    marginHorizontal: moderateScale(20),
                    backgroundColor: selectedPayment?.id === 4 && isEmpty(selectedPaymentCard) ? getColorCodeWithOpactiyNumber(
                        themeColors?.primary_color.substr(1),
                        20,
                    ) : themeColors?.primary_color
                    ,
                    borderWidth: 0,
                    borderRadius: moderateScale(8),
                    position: 'absolute',
                    bottom: 40,
                    width: width - moderateScale(40),
                }}
                btnTextStyle={{}}
            />
            </ScrollView>


           
            <AddPaymentCard isVisible={isAddNewCardModal}
                onBackdropPress={() => setisAddNewCardModal(false)}
                cardHolderName={cardHolderName}
                cardBankName={cardBankName}
                onSave={onSaveCardDetails}
                isLoading={isLoadingSaveCard}
                onCardChange={onCardChange}
                onChangeBankName={(text) => setCardBankName(text)}
                onChangeAccountHolderName={(text) => setCardHolderName(text)}
            />
        </WrapperContainer>
    );
};

export function stylesFunc({ fontFamily }) {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#2c3e50',
        },
        labelStyle: {
            fontSize: textScale(14),
            marginTop: moderateScaleVertical(12),
            opacity: 0.5,
            fontFamily: fontFamily?.medium,
        },
        inputStyle: {
            height: moderateScale(48),
            borderWidth: 1,
            marginTop: moderateScaleVertical(14),
            borderRadius: moderateScale(4),
            borderColor: colors.profileInputborder,
        },
        numStyle: {
            fontSize: textScale(20),
            fontFamily: fontFamily?.medium,
        },
        mainView: {
            paddingHorizontal: moderateScale(12),
            paddingTop: moderateScaleVertical(24),
            backgroundColor: colors.white,
            borderTopLeftRadius: moderateScale(24),
            borderTopRightRadius: moderateScale(24),
        },
        cardView: {
            flexDirection: 'row',
            height: moderateScale(47),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.transactionHistoryBg,
            marginHorizontal: moderateScale(20),
        },
        cardText: {
            marginLeft: moderateScale(4),
            fontFamily: fontFamily?.bold,
        },
    });
    return styles;
}

//make this component available to the app
export default P2pPayment;
