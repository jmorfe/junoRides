import { isEmpty } from 'lodash'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Alert, I18nManager, Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import Modal from "react-native-modal"
import StarRating from "react-native-star-rating"
import { useSelector } from 'react-redux'
import ButtonWithLoader from '../../../Components/ButtonWithLoader'
import OoryksHeader from '../../../Components/OoryksHeader'
import ProductRatingModal from '../../../Components/ProductRatingModal'
import WrapperContainer from '../../../Components/WrapperContainer'
import strings from '../../../constants/lang'
import navigationStrings from '../../../navigation/navigationStrings'
import actions from '../../../redux/actions'
import colors from '../../../styles/colors'
import { moderateScale, moderateScaleVertical, textScale } from '../../../styles/responsiveSize'
import { MyDarkTheme } from '../../../styles/theme'
import { tokenConverterPlusCurrencyNumberFormater } from '../../../utils/commonFunction'
import { getImageUrl, showError, showSuccess } from '../../../utils/helperFunctions'
import stylesFunc from './styles'

import { ScrollView } from 'react-native'
import RenderHTML from 'react-native-render-html'
import LeftRightTextP2p from '../../../Components/LeftRightTextP2p'
import imagePath from '../../../constants/imagePath'
import { getColorSchema } from '../../../utils/utils'





export default function P2pOrderDetail({ route, navigation }) {
    const { appData, currencies, languages, appStyle, themeColors, themeColor, themeToggle } = useSelector(
        state => state?.initBoot,
    );
    const { userData } = useSelector((state) => state?.auth);

    const { additional_preferences, digit_after_decimal } = appData?.profile?.preferences || {};

    const fontFamily = appStyle?.fontSizeData;
    const styles = stylesFunc({ fontFamily, themeColors })
    const darkthemeusingDevice = getColorSchema();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const paramData = route?.params

    const [orderData, setOrderData] = useState({})
    const [isLoading, setisLoading] = useState(true)
    const [isProductRatingModal, setIsProductRatingModal] = useState(false)
    const [review, setReview] = useState('')
    const [productRating, setProductRating] = useState(null)
    const [isCancelOrderModal, setIsCancelOrderModal] = useState(false)
    const [reason, setReason] = useState('')
    const [isCancelOrderLoading, setIsCancelOrderLoading] = useState(false)
    const [previousRating, setPreviousRating] = useState(null)
    const [cancelReasons, setCancelReasons] = useState([])
    const [selectedCancelReason, setSelectedCancelReason] = useState({});


    useEffect(() => {
        getOrderDetailsP2p()
    }, [])

    const getOrderDetailsP2p = () => {
        console.log(paramData?.order_id, "paramData?.order_id")
        actions.getP2pOrderDetail({
            order_id: paramData?.order_id
        }, {
            code: appData.profile.code,
            currency: currencies.primary_currency.id,
            language: languages.primary_language.id,
        }).then((res) => {
            console.log(res, "<===res getP2pOrderDetail")
            setisLoading(false)
            setOrderData(res?.data || {})
            setisLoading(false)
            setProductRating(res?.data?.vendors[0]?.products[0]?.product_rating?.rating)
            setPreviousRating(res?.data?.vendors[0]?.products[0]?.product_rating?.rating)

        }).catch((err) => {
            setisLoading(false)
            showError(err?.message || err?.error)
        })
    }

    console.log(orderData, "sfskjdkfjshdf")

    const productInfo = (!isEmpty(orderData) && !!orderData?.vendors) ? orderData?.vendors[0]?.products[0] : {}

    const onRateProduct = (rating) => {
        setProductRating(rating)
        setIsProductRatingModal(true)
    }


    const priceOnTimeBase = (!isEmpty(orderData) && !!orderData?.price) ? orderData?.price : '';

    const onSubmitRating = () => {
        setIsProductRatingModal(false)
        setisLoading(true)
        let data = {};
        data["order_vendor_product_id"] = productInfo?.id;
        data["order_id"] = productInfo?.order_id;
        data["product_id"] = productInfo?.product_id;
        data["rating"] = productRating;
        data["review"] = review;
        actions
            .giveRating(data, {
                code: appData?.profile?.code,
                currency: currencies?.primary_currency?.id,
                language: languages?.primary_language?.id,
            })
            .then((res) => {
                console.log(res, "<===res giveRating");
                showSuccess(res?.message)
                getOrderDetailsP2p()

                // let cloned_cartItems = cloneDeep(cartItems);
                // updateState({
                //     isLoading: false,
                //     cartItems: (cloned_cartItems = cloned_cartItems.map((itm, inx) => {
                //         itm.products.map((j, jnx) => {
                //             if (j?.product_id == productDetail?.product_id) {
                //                 j.product_rating = res.data;
                //                 return j;
                //             } else {
                //                 return j;
                //             }
                //         });
                //         return itm;
                //     })),
                // });
            })
            .catch(errorMethod);
    };

    const currencyWithSymbol = ({ price, multiplier = 1 }) => {
        return tokenConverterPlusCurrencyNumberFormater(
            price * multiplier,
            digit_after_decimal,
            additional_preferences,
            currencies?.primary_currency?.symbol,
        );
    };

    const onCancel = () => {

        if (isEmpty(selectedCancelReason)) {
            alert("Please select an cancellation reason")
            return

        }
        else if (selectedCancelReason?.id == 5 && reason.length <= 3) {
            alert("Please enter valid cancellation reason")
            return
        }

        setIsCancelOrderLoading(true)
        let apiData = {
            order_id: paramData?.order_id,
            vendor_id: productInfo?.vendor_id,
            reject_reason: reason,
            cancel_reason_id: 5,
            type: paramData?.type
            // status_option_id: orderData?.order_status?.current_status?.id,
        }
        let apiHeaders = {
            code: appData.profile.code,
            currency: currencies.primary_currency.id,
            language: languages.primary_language.id,
        }
        console.log(apiData, "falsdkhfasd", apiHeaders)


        actions.cancelOrder(apiData, apiHeaders).then((res) => {
            console.log(res, "<===res cancelOrder")
            setIsCancelOrderLoading(false)
            setIsCancelOrderModal(false)
            showSuccess(res?.message || strings.DONE)
            navigation?.goBack()
        }).catch(errorMethod)
    }

    const errorMethod = (error) => {
        setisLoading(false)
        setIsCancelOrderLoading(false)
        setIsCancelOrderModal(false)
        setProductRating(previousRating)
        showError(error?.message || error?.error);
    };

    const onCancelOrder = () => {
        let dateTimeString = productInfo?.start_date_time
        const parts = dateTimeString.split(' ');
        const datePart = parts[0];
        const date1 = new Date(datePart)
        const date2 = new Date();
        const differenceInMilliseconds = Math.abs(date2.getTime() - date1.getTime());
        const differenceInHours = Math.floor(differenceInMilliseconds / (1000 * 60 * 60));
        Alert.alert('', differenceInHours < 48 ? "You are cancelling the order within 48 hours of start renting, so you will be charged 100% of cancellation fee. Do you really want to cancel the order?" : paramData?.type == "lender" ? "You are cancelling the order prior to 48 hours of start renting date, so you will not be charged any amount for cancelling. Please click on confirm if you wish to continue." : "You are cancelling the order prior to 48 hours of start renting date, so you will get 100% refund. Please click on confirm if you wish to continue", [
            {
                text: strings.CANCEL,
                onPress: () => { },
                // style: 'destructive',
            },
            { text: strings.CONFIRM, onPress: getCancellationReason },
        ]);

    }

    const getCancellationReason = () => {
        actions
            .getCancellationReason(
                {},
                {
                    code: appData?.profile?.code,
                    currency: currencies?.primary_currency?.id,
                    language: languages?.primary_language?.id,
                },
            )
            .then((res) => {

                setCancelReasons(res?.data);
                setIsCancelOrderModal(true)
            })
            .catch(errorMethod);
    }

    const onChatStart = async () => {

        // let productInfo = orderData?.vendors[0]?.products[0]


        let roomId = "64e8acea00764a09e01dc4c0"

        actions.raiseAnIssueInChat(`/${roomId}`, {
            isRaiseIssue: 1
        }, {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
        }).then((res) => {
            console.log(res, "fasdfjaskdjf")

        }).catch((err) => {
            console.log(err, "fasdkjfaskdf")
        })

        return


        if (!userData?.auth_token) {
            actions.setAppSessionData('on_login');
            return;
        }
        setisLoading(true);
        try {
            const apiData = {
                sub_domain: '192.168.101.88', //this is static value
                client_id: String(appData?.profile.id),
                db_name: appData?.profile?.database_name,
                user_id: String(userData?.id),
                type: 'user_to_user',
                product_id: String(productInfo?.product_id),
                vendor_id: String(productInfo?.vendor_id),
                isRaiseIssue: 1
            };


            const res = await actions.onStartChat(apiData, {
                code: appData?.profile?.code,
                currency: currencies?.primary_currency?.id,
                language: languages?.primary_language?.id,
            });

            if (!!res?.roomData) {

                navigation.navigate(navigationStrings.CHAT_SCREEN, {
                    data: {
                        ...res?.roomData, vendor_id_order: productInfo?.vendor_id,

                    }
                });
            }
            setisLoading(false);
        } catch (error) {
            setisLoading(false);
            console.log('error raised in start chat api', error);
            showError(error?.message);
        }


    }




    return (
        <WrapperContainer isLoading={isLoading} bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}>
            <OoryksHeader
                leftTitle={"Orders"}
                headerContainerStyle={{ borderBottomWidth: 1, borderBottomColor: colors.grey1 }}
                isRight={orderData?.payment_status == 0}
                isRightText
                isCustomLeftPress={true}
                onPressLeft={() => navigation.goBack()}
                disabled={!isEmpty(orderData) && orderData?.vendors[0]?.order_status_option_id == 3}
                rightText={!isEmpty(orderData) && orderData?.vendors[0]?.order_status_option_id == 3 ? "Cancelled" : "Cancel Order"}
                onPressRight={onCancelOrder}

            />
            {!isEmpty(orderData) && <ScrollView style={{ flex: 0.9, }}>
                {/* <View style={{ flexDirection: 'row', marginTop: moderateScaleVertical(14), marginHorizontal: moderateScale(16), }}>
                    <Text style={{ fontFamily: fontFamily?.regular, color: colors.textGreyN, marginLeft: moderateScale(8), fontSize: textScale(13) }}>
                        <Text style={{
                            color: isDarkMode ? MyDarkTheme.colors.text : colors.black
                        }}>{strings.ADDRESS}</Text> {productInfo?.product?.address}
                    </Text>
                </View> */}

                {/* <View style={{ borderWidth: 0.5, margin: moderateScale(16), borderColor: colors.greyA, borderRadius: moderateScale(8) }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: moderateScaleVertical(8), marginHorizontal: moderateScale(12), alignItems: "center" }}>
                        <Text style={{ fontSize: textScale(14), color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>Days {productInfo?.days}</Text>
                        <Text style={{ fontFamily: fontFamily.bold, color: isDarkMode ? MyDarkTheme.colors.text : colors.black }} numberOfLines={1}>
                            {`${moment(productInfo?.start_date_time).format('DD MMM YY (hh:mm A)')} - ${moment(productInfo?.end_date_time).format('DD MMM YY (hh:mm A)')}`}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: moderateScaleVertical(8), marginHorizontal: moderateScale(12) }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center"
                        }}>
                            <Text style={{ fontSize: textScale(14), color: isDarkMode ? MyDarkTheme.colors.text : colors.black, }}> {tokenConverterPlusCurrencyNumberFormater(
                                //   productInfo?.rental_price
                                productInfo?.product_price,
                                digit_after_decimal,
                                additional_preferences,
                                currencies?.primary_currency?.symbol)} </Text>
                            <Text style={{ fontSize: textScale(14), color: isDarkMode ? MyDarkTheme.colors.text : colors.black, }}>x {productInfo?.days} days</Text>
                        </View>
                        <Text style={{ fontFamily: fontFamily.bold, color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>{tokenConverterPlusCurrencyNumberFormater(
                            productInfo?.product_price * productInfo?.days,
                            digit_after_decimal,
                            additional_preferences,
                            currencies?.primary_currency?.symbol)}</Text>
                    </View>
                    {Number(orderData?.total_service_fee) > 0 && <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: moderateScaleVertical(8), marginHorizontal: moderateScale(12) }}>
                        <Text style={{ fontSize: textScale(14), color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>Service Fee</Text>
                        <Text style={{ fontFamily: fontFamily.bold, color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>{tokenConverterPlusCurrencyNumberFormater(
                            orderData?.total_service_fee,
                            digit_after_decimal,
                            additional_preferences,
                            currencies?.primary_currency?.symbol)}</Text>
                    </View>}

                    {Number(orderData?.plateform_fee) > 0 && <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: moderateScaleVertical(8),
                            marginHorizontal: moderateScale(12),
                        }}>
                        <Text style={{ fontSize: textScale(14), color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>{"Platform Fee"}</Text>
                        <Text style={{ fontFamily: fontFamily.bold, color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>
                            {tokenConverterPlusCurrencyNumberFormater(orderData?.plateform_fee,
                                digit_after_decimal,
                                additional_preferences,
                                currencies?.primary_currency?.symbol)}
                        </Text>
                    </View>}

                    {orderData?.total_discount > 0 && <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: moderateScaleVertical(8), marginHorizontal: moderateScale(12) }}>
                        <Text style={{ fontSize: textScale(14), color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>{strings.DISCOUNT}</Text>
                        <Text style={{ fontFamily: fontFamily.bold, color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>- {tokenConverterPlusCurrencyNumberFormater(
                            orderData?.total_discount,
                            digit_after_decimal,
                            additional_preferences,
                            currencies?.primary_currency?.symbol)}</Text>
                    </View>}
                    {orderData?.loyalty_amount_saved > 0 && <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: moderateScaleVertical(8), marginHorizontal: moderateScale(12) }}>
                        <Text style={{ fontSize: textScale(14), color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>{strings.LOYALTYPOINTS}</Text>
                        <Text style={{ fontFamily: fontFamily.bold, color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>- {tokenConverterPlusCurrencyNumberFormater(
                            orderData?.loyalty_amount_saved,
                            digit_after_decimal,
                            additional_preferences,
                            currencies?.primary_currency?.symbol)}</Text>
                    </View>}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: moderateScaleVertical(8), marginHorizontal: moderateScale(12) }}>
                        <Text style={{ fontSize: textScale(14), color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>Promo Code</Text>
                        <Text style={{ fontFamily: fontFamily.bold, color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}></Text>
                    </View>

                    <View style={{
                        height: 2,
                        marginHorizontal: moderateScale(10),
                        backgroundColor: colors.greyA,
                        opacity: 0.26,

                    }} />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: moderateScale(8), marginHorizontal: moderateScale(12) }}>
                        <Text style={{ fontFamily: fontFamily.bold, fontSize: textScale(16), color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>Total</Text>
                        <Text style={{ fontFamily: fontFamily.bold, fontSize: textScale(16), color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>{tokenConverterPlusCurrencyNumberFormater(
                            orderData?.payable_amount,
                            digit_after_decimal,
                            additional_preferences,
                            currencies?.primary_currency?.symbol)}</Text>
                    </View>
                </View> */}
                <Text style={{ fontFamily: fontFamily.bold, textTransform: 'capitalize', fontSize: textScale(16), marginLeft: moderateScale(20), color: isDarkMode ? MyDarkTheme.colors.text : colors.black, marginTop: moderateScale(12) }}>{orderData?.vendors[0]?.vendor_name}</Text>
                <View style={{ padding: moderateScale(16) }}>

                    <TouchableOpacity
                        activeOpacity={0.7}

                        onPress={() => navigation.navigate(navigationStrings.P2P_PRODUCT_DETAIL, { product_id: productInfo?.product_id, isMyPost: true })}
                    >
                        <View style={{ flexDirection: 'row', borderRadius: moderateScale(12), backgroundColor: colors.whiteSmokeColor, padding: moderateScale(10), justifyContent: "space-between" }}>
                            <View style={{
                                flexDirection: "row",
                                flex: 0.9
                            }}>
                                <FastImage
                                    source={{
                                        uri: getImageUrl(productInfo?.image?.image_fit, productInfo?.image?.image_path, "300/300")
                                    }}
                                    style={{ width: moderateScale(69), height: moderateScaleVertical(69), borderRadius: moderateScale(8) }}
                                />
                                <View style={{ marginLeft: moderateScale(10), }}>
                                    <Text style={{ fontFamily: fontFamily.bold }}>
                                        {productInfo?.translation?.title}
                                    </Text>
                                    <View style={{
                                        width: "95%"
                                    }}>
                                        <RenderHTML
                                            source={{
                                                html: productInfo?.translation?.body_html
                                                    ? productInfo?.translation?.body_html
                                                    : ''
                                            }}
                                            tagsStyles={{
                                                p: {
                                                    color: isDarkMode ? colors.white : colors.black,
                                                    textAlign: 'left',

                                                },
                                            }}
                                        />

                                    </View>
                                </View>
                            </View>

                            <View style={{
                                alignItems: "flex-end"
                            }}>
                                {orderData?.vendors[0]?.vendor_id !== userData?.vendor_id && orderData?.order_status?.current_status?.id == 6 && <StarRating
                                    maxStars={5}
                                    disabled={productRating != null}
                                    rating={productRating}
                                    selectedStar={onRateProduct}
                                    fullStarColor={colors.ORANGE}
                                    starSize={25}
                                />}
                                {/* {paramData?.type !== "lender" && paramData?.selectedTab?.id != 2 && !!paramData?.isAvailableToRaiseIssue && <TouchableOpacity onPress={onChatStart}>
                                    <Text style={{
                                        color: colors.blue,
                                        textDecorationLine: "underline",
                                        fontFamily: fontFamily?.bold,
                                        fontSize: textScale(16)
                                    }}>Help?</Text>
                                </TouchableOpacity>} */}
                            </View>
                        </View>

                    </TouchableOpacity>
                </View>


                {productInfo?.product?.category?.category_detail?.type_id == 10 && <View style={styles.priceContainer}>
                    {!!productInfo?.days && <LeftRightTextP2p
                        leftText={"Tenure"}
                        rightText={`${productInfo?.days} days`}
                        leftTextStyle={styles.leftRightText}
                        rightTextStyle={styles.leftRightText} />}
                    <LeftRightTextP2p
                        leftText={"Price (per day)"}
                        rightText={tokenConverterPlusCurrencyNumberFormater(
                            productInfo?.pvariant?.price,
                            digit_after_decimal,
                            additional_preferences,
                            currencies?.primary_currency?.symbol)}
                        leftTextStyle={styles.leftRightText}
                        rightTextStyle={styles.leftRightText} marginBottom={0} />
                    {!!productInfo?.start_date_time && <LeftRightTextP2p
                        leftText={"Start Date & Time"}
                        rightText={moment(productInfo?.start_date_time).format('DD MMM YYYY; hh:mmA')}
                        leftTextStyle={styles.leftRightText}
                        rightTextStyle={styles.leftRightText}
                        marginTop={moderateScaleVertical(12)}
                        marginBottom={0} />}
                    {!!productInfo?.end_date_time && <LeftRightTextP2p
                        leftText={"End Date & Time"}
                        rightText={moment(productInfo?.end_date_time).format('DD MMM YYYY; hh:mmA')}
                        leftTextStyle={styles.leftRightText}
                        rightTextStyle={styles.leftRightText}
                        marginTop={moderateScaleVertical(12)}
                        marginBottom={0} />}
                </View>}
                <Text style={styles.sectionTitle}>Price Breakdown</Text>
                <View style={{ ...styles.priceContainer, marginTop: 0 }}>
                <LeftRightTextP2p
                        leftText={''}
                        rightText={strings.ORDER_NUMBER}
                        leftTextStyle={styles.leftRightText}
                        rightTextStyle={styles.leftRightText} marginBottom={0} />
                    <LeftRightTextP2p
                        leftText={productInfo?.product?.category?.category_detail?.type_id == 10 ? `${tokenConverterPlusCurrencyNumberFormater(
                            productInfo?.pvariant?.price,
                            digit_after_decimal,
                            additional_preferences,
                            currencies?.primary_currency?.symbol)} x ${productInfo?.days} days` : "Price"}
                        rightText={currencyWithSymbol({
                            price: productInfo?.pvariant?.price,
                            multiplier:
                                !isEmpty(productInfo) && Number(productInfo?.days),
                        })}
                        leftTextStyle={styles.leftRightText}
                        rightTextStyle={styles.leftRightText} marginBottom={0} />

                    {productInfo?.product?.category?.category_detail?.type_id == 13 && !!productInfo?.start_date_time && <LeftRightTextP2p
                        leftText={"Date"}
                        rightText={moment(productInfo?.start_date_time).format("DD-MM-YYYY")}
                        leftTextStyle={styles.leftRightText}
                        rightTextStyle={styles.leftRightText}
                        marginTop={moderateScaleVertical(12)}
                        marginBottom={0} />}
                        {productInfo?.product?.category?.category_detail?.type_id == 13 && !!productInfo?.start_date_time && <LeftRightTextP2p
                        leftText={"Time"}
                        rightText={moment(productInfo?.start_date_time).format("hh:mm A")}
                        leftTextStyle={styles.leftRightText}
                        rightTextStyle={styles.leftRightText}
                        marginTop={moderateScaleVertical(12)}
                        marginBottom={0} />}
                    {Number(orderData?.total_service_fee) > 0 && <LeftRightTextP2p
                        leftText={"Service Fee"}
                        rightText={tokenConverterPlusCurrencyNumberFormater(
                            orderData?.total_service_fee,
                            digit_after_decimal,
                            additional_preferences,
                            currencies?.primary_currency?.symbol)}
                        leftTextStyle={styles.leftRightText}
                        rightTextStyle={styles.leftRightText}
                        marginTop={moderateScaleVertical(12)}
                        marginBottom={0} />}


                    {Number(orderData?.plateform_fee) > 0 && <LeftRightTextP2p
                        leftText={"Platform Fee"}
                        rightText={currencyWithSymbol({ price: orderData?.plateform_fee })}
                        leftTextStyle={styles.leftRightText}
                        rightTextStyle={styles.leftRightText}
                        marginTop={moderateScaleVertical(12)}
                        marginBottom={0} />}
                    {Number(orderData?.loyalty_amount_saved) > 0 && <LeftRightTextP2p
                        leftText={"Loyalty Points"}
                        rightText={`- ${currencyWithSymbol({ price: orderData?.loyalty_amount_saved })}`}
                        leftTextStyle={styles.leftRightText}
                        rightTextStyle={styles.leftRightText}
                        marginTop={moderateScaleVertical(12)}
                        marginBottom={0} />}
                    {Number(orderData?.total_discount
                    ) > 0 && <LeftRightTextP2p
                            leftText={"Promo Code"}
                            rightText={`- ${currencyWithSymbol({
                                price: Number(orderData?.total_discount
                                )
                            })}`}
                            leftTextStyle={styles.leftRightText}
                            rightTextStyle={styles.leftRightText}
                            marginTop={moderateScaleVertical(12)}
                            marginBottom={0} />
                    }
                    {/* {orderData?.total_discount > 0 && <LeftRightTextP2p
                        leftText={strings.DISCOUNT}
                        rightText={tokenConverterPlusCurrencyNumberFormater(
                            orderData?.total_discount,
                            digit_after_decimal,
                            additional_preferences,
                            currencies?.primary_currency?.symbol)}
                        leftTextStyle={styles.leftRightText}
                        rightTextStyle={styles.leftRightText} />} */}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: moderateScale(8), marginHorizontal: moderateScale(12) }}>
                    <Text style={{ fontFamily: fontFamily.bold, fontSize: textScale(16), color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>Total</Text>
                    <Text style={{ fontFamily: fontFamily.bold, fontSize: textScale(16), color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>{tokenConverterPlusCurrencyNumberFormater(
                        orderData?.payable_amount,
                        digit_after_decimal,
                        additional_preferences,
                        currencies?.primary_currency?.symbol)}</Text>
                </View>

            </ScrollView>
            }
            <ProductRatingModal
                isVisible={isProductRatingModal}
                isLoading={isLoading}
                onSubmit={onSubmitRating}
                onCloseModal={() => {
                    setProductRating(null)
                    setIsProductRatingModal(false)
                }}
                onChangeText={(text) => setReview(text)} />

            <Modal
                isVisible={isCancelOrderModal}
                onBackdropPress={() => setIsCancelOrderModal(false)}
                // animationIn="zoomIn"
                // animationOut="zoomOut"
                avoidKeyboard={true}
                style={{
                    margin: 0,
                    justifyContent: 'flex-end',
                }}>
                <View
                    style={{
                        backgroundColor: isDarkMode
                            ? MyDarkTheme.colors.lightDark
                            : colors.white,
                        borderTopLeftRadius: moderateScale(8),
                        borderTopRightRadius: moderateScale(8),
                        overflow: 'hidden',
                        paddingHorizontal: moderateScale(16),
                        paddingVertical: moderateScale(12),
                        // height: moderateScaleVertical(300),
                    }}>

                    <Text style={{
                        fontFamily: fontFamily?.bold,
                        fontSize: textScale(14),
                        marginBottom: moderateScaleVertical(16)
                    }}>Select a reason</Text>

                    {!isEmpty(cancelReasons) ? cancelReasons.map((item) => (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => setSelectedCancelReason(item)}
                            style={{
                                height: moderateScaleVertical(40),
                                backgroundColor: colors.blackOpacity05,
                                paddingHorizontal: moderateScale(10),
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: 4,
                            }}>
                            <Text> {item?.title}</Text>
                            {selectedCancelReason?.id == item?.id ? (
                                <Image source={imagePath.tick2} />
                            ) : (
                                <></>
                            )}
                        </TouchableOpacity>
                    )) : <View>
                        <Text style={{
                            textAlign: "center",
                            fontFamily: fontFamily?.regular,
                            fontSize: textScale(14),

                        }}>No cancellation reasons found!</Text></View>}

                    {selectedCancelReason?.id == 5 && <View
                        style={{
                            // marginVertical: moderateScaleVertical(16),
                            backgroundColor: isDarkMode
                                ? colors.whiteOpacity15
                                : colors.greyNew,
                            height: moderateScale(82),
                            borderRadius: moderateScale(4),
                            paddingHorizontal: moderateScale(8),
                            marginTop: moderateScaleVertical(16),
                        }}>
                        <TextInput
                            multiline
                            value={reason}
                            placeholder={strings.WRITE_YOUR_REASON_HERE}
                            onChangeText={(val) => setReason(val)}
                            style={{
                                flex: 1,
                                fontFamily: fontFamily?.medium,
                                textAlign: I18nManager.isRTL ? "right" : "left",
                                fontSize: textScale(11),
                                color: isDarkMode ? colors.textGreyB : colors.black,
                                textAlignVertical: 'top',
                            }}

                            placeholderTextColor={
                                isDarkMode ? colors.textGreyB : colors.blackOpacity40
                            }
                        />
                    </View>
                    }
                    {!isEmpty(cancelReasons) && <ButtonWithLoader
                        isLoading={isCancelOrderLoading}
                        btnText={strings.CANCEL}
                        btnStyle={{
                            backgroundColor: themeColors.primary_color,
                            borderWidth: 0,
                        }}
                        onPress={onCancel}
                    />}
                </View>


            </Modal>
        </WrapperContainer>
    )
}
