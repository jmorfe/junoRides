//import liraries
import { useFocusEffect } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import HTMLView from 'react-native-htmlview';
import * as RNLocalize from 'react-native-localize';
import { useSelector } from 'react-redux';
import ButtonWithLoader from '../../../Components/ButtonWithLoader';
import LeftRightTextP2p from '../../../Components/LeftRightTextP2p';
import OoryksHeader from '../../../Components/OoryksHeader';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import { hitSlopProp } from '../../../styles/commonStyles';
import {
    moderateScale,
    moderateScaleVertical,
    textScale
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import { tokenConverterPlusCurrencyNumberFormater } from '../../../utils/commonFunction';
import {
    getImageUrl,
    showSuccess
} from '../../../utils/helperFunctions';
import { getColorSchema } from '../../../utils/utils';


// create a component
const ProductPriceDetails = ({ navigation, route }) => {
    const bottomSheetRef = useRef(null);

    const paramData = route?.params?.data
    const {
        appData,
        currencies,
        languages,
        appStyle,
        themeColors,
        themeToggle,
        themeColor,
        allAddresss,
    } = useSelector(state => state?.initBoot);
    const fontFamily = appStyle?.fontSizeData;
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const darkthemeusingDevice = getColorSchema();
    const { dineInType, appMainData, location } = useSelector(state => state?.home);
    const { userData } = useSelector(state => state?.auth);

    const styles = styleData({ fontFamily, themeColors });

    const { additional_preferences, digit_after_decimal } =
        appData?.profile?.preferences || {};

    const [state, setState] = useState({

        totalPayableAmount: 0,

        productDetails: {},
    });
    const { totalPayableAmount, productDetails } = state;

    const [cartData, setCartData] = useState({});
    const [item, setItem] = useState({});
    const [isLoading, setIsLoading] = useState(true);



    const updateState = data => setState(state => ({ ...state, ...data }));

    const moveToNewScreen =
        (screenName, data = {}) =>
            () => {
                navigation.navigate(screenName, { data });
            };

    useFocusEffect(
        React.useCallback(() => {
            getCartDetail();
        }, []),
    );

    const currencyWithSymbol = ({ price, multiplier = 1 }) => {
        return tokenConverterPlusCurrencyNumberFormater(
            price * multiplier,
            digit_after_decimal,
            additional_preferences,
            currencies?.primary_currency?.symbol,
        );
    };

    const getCartDetail = () => {
        const apiData = `/?type=${dineInType}`;
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
                setIsLoading(false);
                console.log('cart details>>>', res);
                actions.cartItemQty(res);
                if (res?.data && !isEmpty(res?.data)) {
                    setCartData(res?.data);
                    setItem(res?.data?.products[0]);
                    updateState({
                        totalPayableAmount: res?.data?.total_payable_amount,
                        productDetails:
                            !isEmpty(res?.data?.products) &&
                            res?.data?.products[0]?.vendor_products[0],
                    });
                }
            })
            .catch(errorMethod);
    };

    const errorMethod = error => {
        setIsLoading(false);
        showError(error?.message || error?.error);
    };

    const onBookNowPress = () => {
        const item = {
            data: { ...state, totalPayableAmount: totalPayableAmount - Number(cartData?.total_discount_amount) },
        };
        moveToNewScreen(navigationStrings.PAYMENT_SCREEN, item)();
    };

    const imageUrl =
        productDetails &&
        productDetails.cartImg?.path &&
        getImageUrl(
            productDetails?.cartImg?.path?.image_fit,
            productDetails?.cartImg?.path?.image_path,
            '200/200',
        );

    const priceOnTimeBase = !isEmpty(productDetails) ? productDetails?.price : '';
    //Get list of all offers
    const _getAllOffers = (vendor, cartData) => {
        moveToNewScreen(navigationStrings.OFFERS, {
            vendor: vendor,
            cartId: cartData?.id,
            isP2p: true,
            paramData: paramData
        })();
    };




    const _removeCoupon = (item, cartData) => {
        let data = {};
        data['vendor_id'] = item?.vendor_id;
        data['cart_id'] = cartData?.id;
        data['coupon_id'] = item?.couponData?.coupon_id;

        actions
            .removePromoCode(data, {
                code: appData?.profile?.code,
                currency: currencies?.primary_currency?.id,
                language: languages?.primary_language?.id,
                systemuser: DeviceInfo.getUniqueId(),
            })
            .then(res => {
                if (res) {
                    showSuccess(res?.message || res?.error);
                    getCartDetail();
                } else {
                    updateState({ isLoadingB: false });
                }
            })
            .catch(errorMethod);

    };




    return (
        <WrapperContainer
            bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
            isLoading={isLoading}>
            <OoryksHeader
                leftTitle={strings.DETAILS}
                titleStyle={{
                    fontFamily: fontFamily?.medium,
                }}
                headerContainerStyle={{
                    borderBottomWidth: 1,
                    borderBottomColor: colors.grey1,
                }}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: moderateScale(12),
                        marginBottom: moderateScaleVertical(16),
                        marginTop: moderateScaleVertical(32)

                    }}>
                    <View style={styles.productImgNameContainer}>
                        <View style={{ flexDirection: "row" }}>
                            <View>
                                <FastImage
                                    source={imageUrl ? { uri: imageUrl } : imagePath.ooryks_img}
                                    style={styles.productImg}
                                />
                                <View style={{
                                    flexDirection: "row",
                                    marginTop: moderateScaleVertical(12)
                                }}>
                                    {[1, 2, 3, 4, 5].map((item) => {
                                        return <Image source={item <= Number(paramData?.vendor_rating) ? imagePath.ic_filled_star : imagePath.ic_star_unfill} />
                                    })}
                                </View>
                            </View>
                            <View
                                style={{
                                    marginLeft: moderateScale(16),
                                    flex: 1,
                                }}>
                                {!isEmpty(productDetails) && (
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            fontFamily: fontFamily?.medium,
                                            fontSize: textScale(14),
                                        }}>
                                        {productDetails?.product?.translation[0]?.title}
                                    </Text>
                                )}
                                {!isEmpty(productDetails?.product?.translation) && (!productDetails?.product?.translation[0]?.meta_description || productDetails?.product?.translation[0]?.body_html)
                                    &&
                                    <View style={{
                                        marginTop: moderateScaleVertical(6)
                                    }}>
                                        {!!productDetails?.product?.translation[0]?.meta_description ? (
                                            <Text
                                                numberOfLines={2}
                                                style={{
                                                    fontFamily: fontFamily?.regular,
                                                    fontSize: textScale(12),
                                                    color: colors.lightGreyText,
                                                    flex: 1,
                                                    marginTop: moderateScaleVertical(4),
                                                }}>
                                                {productDetails?.product?.translation[0]?.meta_description}
                                            </Text>
                                        ) :
                                            <HTMLView
                                                stylesheet={{
                                                    p: {
                                                        fontFamily: fontFamily?.regular,
                                                        fontSize: textScale(12),
                                                        color: colors.lightGreyText,
                                                    },

                                                }}
                                                value={productDetails?.product?.translation[0]?.body_html
                                                    ? productDetails?.product?.translation[0]?.body_html
                                                    : ''}
                                                textComponentProps={{
                                                    numberOfLines: 3,

                                                }}
                                                nodeComponentProps={{ numberOfLines: 3 }}
                                            />
                                        }
                                    </View>
                                }
                                <Text style={{
                                    marginTop: "auto",
                                    fontFamily: fontFamily?.regular,
                                    fontSize: textScale(12),
                                    color: colors.textGreyN,

                                }}> Lent by <Text style={{
                                    color: colors.black
                                }}>{paramData?.vendor_name}</Text></Text>
                            </View>
                        </View>
                    </View>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: moderateScaleVertical(16)
                    }}>
                        <Image source={imagePath.distance} />
                        <Text style={{
                            marginLeft: moderateScale(8)
                        }}>{paramData?.distance} <Text style={{
                            color: colors.textGreyN
                        }}> km away</Text></Text>
                    </View>


                </View>
            </ScrollView>

            {!!item?.is_promo_code_available &&
                <TouchableOpacity
                    disabled={item?.couponData ? true : false}
                    onPress={() => _getAllOffers(item.vendor, cartData)}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: isDarkMode
                            ? MyDarkTheme.colors.lightDark
                            : colors.transactionHistoryBg,
                        height: moderateScaleVertical(46),
                        borderRadius: moderateScale(6),
                        justifyContent: "space-between",
                        paddingHorizontal: moderateScale(16),
                        marginBottom: moderateScaleVertical(24),
                        flexDirection: "row",
                        alignItems: "center"
                    }}>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}>
                        <FastImage
                            source={imagePath.percent}
                            resizeMode="contain"
                            style={{
                                width: moderateScale(24),
                                height: moderateScale(24),
                                tintColor: themeColors.primary_color,
                            }}
                        />

                        <Text style={{
                            fontFamily: fontFamily?.regular,
                            fontSize: textScale(12),
                            marginLeft: moderateScale(12),
                            color: themeColors?.primary_color
                        }}>{!!item?.couponData ? `${item?.couponData?.name} ${strings.CODE} ${strings.APPLYED}` : strings.APPLY_PROMO_CODE}</Text>
                    </View>
                    <TouchableOpacity
                        hitSlop={hitSlopProp}
                        disabled={!item?.couponData}
                        onPress={() => _removeCoupon(item, cartData)}
                        style={{
                            zIndex: 1
                        }}>
                        <Image source={!!item?.couponData ? imagePath.ic_cross : imagePath.arrow_forward} style={{
                            tintColor: !!item?.couponData ? colors.redB : colors.black
                        }} />
                    </TouchableOpacity>
                </TouchableOpacity>}
            <View style={styles.bottomContainer}>
                {paramData?.type_id == 10 && <View style={{
                    marginBottom: moderateScaleVertical(24)
                }}>
                    <Text style={{
                        color: colors.black,
                        fontFamily: fontFamily?.bold,
                        fontSize: textScale(16),
                        marginBottom: moderateScaleVertical(12)
                    }}>Rental Summary</Text>
                    <LeftRightTextP2p
                        leftText={`${currencyWithSymbol({ price: priceOnTimeBase })} x ${productDetails?.days
                            } days`}
                        rightText={currencyWithSymbol({
                            price: priceOnTimeBase,
                            multiplier:
                                !isEmpty(productDetails) && Number(productDetails?.days),
                        })}
                        leftTextStyle={styles.finalAmountTxt}
                        rightTextStyle={styles.finalAmountTxt}


                    />

                    <LeftRightTextP2p
                        leftText={paramData?.type_id == 10 ? 'Start Date & TIme' : "Date"}
                        rightText={moment(productDetails?.start_date_time).format(
                            `DD MMM YYYY${paramData?.type_id == 10 ? `; hh:mmA` : ``}`,
                        )}
                        leftTextStyle={styles.finalAmountTxt}
                        rightTextStyle={styles.finalAmountTxt}

                    />
                    {paramData?.type_id == 10 && <LeftRightTextP2p
                        leftText={'End Date & TIme'}
                        rightText={moment(productDetails?.end_date_time).format(
                            'DD MMM YYYY; hh:mmA',
                        )}
                        leftTextStyle={styles.finalAmountTxt}
                        rightTextStyle={styles.finalAmountTxt}

                    />}
                </View>}

                <Text style={{
                    color: colors.black,
                    fontFamily: fontFamily?.bold,
                    fontSize: textScale(16),
                    marginBottom: moderateScaleVertical(12)
                }}>Payment Summary</Text>
                {Number(cartData?.total_discount_amount) > 0 && <LeftRightTextP2p
                    leftText={'Discounts'}
                    rightText={`- ${currencyWithSymbol({ price: cartData?.total_discount_amount })}`}
                    leftTextStyle={styles.finalAmountTxt}
                    rightTextStyle={styles.finalAmountTxt}
                />}
                <LeftRightTextP2p
                    leftText={'Subtotal'}
                    rightText={currencyWithSymbol({ price: totalPayableAmount })}
                    leftTextStyle={styles.finalAmountTxt}
                    rightTextStyle={styles.finalAmountTxt}

                />
                <View style={{
                    borderWidth: 0.5,
                    borderStyle: "dotted",
                    marginBottom: moderateScale(12),
                }} />
                <LeftRightTextP2p
                    leftText={'Total'}
                    rightText={currencyWithSymbol({ price: totalPayableAmount - Number(cartData?.total_discount_amount) })}
                    leftTextStyle={{ ...styles.finalAmountTxt, color: colors.black, fontSize: textScale(16) }}
                    rightTextStyle={{ ...styles.finalAmountTxt, color: colors.black, fontSize: textScale(16) }}
                />
                <ButtonWithLoader
                    btnText={"Book Now"}
                    onPress={onBookNowPress}
                    btnStyle={styles.bookNowBtn}
                    btnTextStyle={{
                        textTransform: "none",
                        fontSize: textScale(12),
                    }}
                />
            </View>
        </WrapperContainer>
    );
};

// define your styles
function styleData({ fontFamily, themeColors, isDarkMode }) {
    const styles = StyleSheet.create({
        container: {},
        offersViewB: {
            backgroundColor: isDarkMode
                ? MyDarkTheme.colors.lightDark
                : colors.transactionHistoryBg,
            paddingVertical: moderateScaleVertical(15),
            paddingHorizontal: moderateScaleVertical(10),
            marginTop: moderateScaleVertical(0),
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: moderateScale(8),
            marginHorizontal: moderateScale(20),
        },
        viewOffers: {
            color: themeColors.primary_color,
            fontFamily: fontFamily?.medium,
            fontSize: textScale(12),
            paddingRight: moderateScale(5),
        },
        removeCoupon: {
            color: colors.themeColor,
            fontFamily: fontFamily?.medium,
            fontSize: textScale(12),
            paddingRight: moderateScale(5),
        },
        LeftRightTextP2p: {
            fontFamily: fontFamily?.regular,
            color: colors.black,
            fontSize: textScale(14),
        },
        priceContainer: {
            borderWidth: 1,
            borderColor: colors.borderColorB,
            borderRadius: moderateScale(4),
            padding: moderateScale(16),
            marginTop: moderateScaleVertical(16),
        },
        sectionTitle: {
            marginTop: moderateScaleVertical(16),
            marginBottom: moderateScaleVertical(8),
            fontFamily: fontFamily?.medium,
            fontSize: textScale(14),
            color: colors.blackOpacity40,
        },
        promoBtn: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 0,
        },
        bottomContainer: {
            backgroundColor: colors.whiteSmokeColor,
            // borderTopLeftRadius: moderateScale(24),
            // borderTopRightRadius: moderateScale(24),
            // height: moderateScaleVertical(120),
            padding: moderateScale(16),
        },
        bookNowBtn: {
            backgroundColor: themeColors?.primary_color,
            borderWidth: 0,
            borderRadius: moderateScale(8),
            marginTop: moderateScaleVertical(16),
        },
        applyPromoTxt: {
            fontFamily: fontFamily?.regular,
            fontSize: textScale(14),
            color: colors.black,
        },
        productImg: {
            width: moderateScale(64),
            height: moderateScale(64),
            borderRadius: moderateScale(12),
        },
        finalAmountTxt: {
            fontFamily: fontFamily?.medium,
            color: colors.greyE,
            fontSize: textScale(13),
        },
        productImgNameContainer: {
            backgroundColor: colors.whiteSmokeColor,
            borderRadius: moderateScale(12),
            padding: moderateScale(16),

        },
    });

    return styles;
}

//make this component available to the app
export default ProductPriceDetails;

