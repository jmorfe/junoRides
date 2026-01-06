import { StripeProvider, createToken, } from '@stripe/stripe-react-native';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    ImageBackground,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { enableFreeze } from 'react-native-screens';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useSelector } from 'react-redux';
import AddPaymentCard from '../../../Components/AddPaymentCard';
import IconTextRow from '../../../Components/IconTextRow';
import OoryksHeader from '../../../Components/OoryksHeader';
import TextRowInCorners from '../../../Components/TextRowInCorners';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import {
    moderateScale,
    moderateScaleVertical,
    textScale,
    width
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import { getCardImage } from '../../../utils/commonFunction';
import { showError, showSuccess } from '../../../utils/helperFunctions';
import { getColorSchema } from '../../../utils/utils';
import stylesFun from './styles';

enableFreeze(true);

const SavedPaymentCards = ({ navigation, route }) => {

    const { appData, appStyle, themeColors, currencies,
        languages,
        themeToggle,
        themeColor, } = useSelector(state => state.initBoot);
    const { preferences } = appData?.profile;

    const darkthemeusingDevice = getColorSchema();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const fontFamily = appStyle?.fontSizeData;
    const styles = stylesFun({ fontFamily, themeColors });

    const [cardHolderName, setCardHolderName] = useState('')
    const [cardBankName, setCardBankName] = useState('')
    const [isCardModal, setisCardModal] = useState(false)
    const [allPaymentCards, setallPaymentCards] = useState([])
    const [isLoadingSaveCard, setisLoadingSaveCard] = useState(false)
    const [isLoading, setisLoading] = useState(true)
    const [cardDetails, setcardDetails] = useState({})

    useEffect(() => {
        getAllPaymentCards()
    }, [])

    const getAllPaymentCards = () => {
        actions.getAllPaymentCards({
        }, {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
        }).then((res) => {
            console.log(res, "<-----res")
            setallPaymentCards(res?.data)
            setisLoading(false)
            setisCardModal(false)
            setisLoadingSaveCard(false)
        }).catch(errorMethod)
    }


    const onCardChange = (cardDetails) => {
        console.log(cardDetails, "cardDetails>>>>cardDetails")
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
                    card_holder_name: cardHolderName
                }, {
                    code: appData?.profile?.code,
                    currency: currencies?.primary_currency?.id,
                    language: languages?.primary_language?.id,
                }).then((res) => {
                    console.log(res, "<===addPaymentCard")
                    setCardHolderName('')
                    setCardBankName('')
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

    const onDeletePaymentCard = (item) => {
        setisLoading(true)
        actions.deletePaymentCard({
            card_id: item?.id
        }, {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
        }).then((res) => {
            showSuccess("Card deleted successfully!")
            getAllPaymentCards()
        }).catch(errorMethod)
    }



    const errorMethod = (error) => {
        console.log(error, "error>>>>error")
        setisCardModal(false)
        setisLoadingSaveCard(false)
        setisLoading(false)
        showError(error?.message || error?.error);
    };

    const renderSavedCards = ({ item }) => (
        <View style={styles.flat2View1}>
            <View style={styles.flat2View2}>
                <FastImage
                    source={getCardImage(item?.brand)}
                    resizeMode="contain"
                    style={styles.flat2Img}
                />
                <View style={styles.flat2View3}>
                    <Text style={styles.flat2txt1} numberOfLines={1}>
                        {item.bank_name}
                    </Text>
                    <Text style={styles.flat2txt2} numberOfLines={1}>
                        xxxx xxxx xxxx {item.last4}
                    </Text>
                </View>
            </View>
        </View>
    )


    const renderHiddenItem = (rowData, rowMap) => (
        <View style={{
            backgroundColor: colors.white,
            height: moderateScaleVertical(72),
            alignItems: "flex-end",
            justifyContent: "center"
        }}>
            <TouchableOpacity
                onPress={() => onDeletePaymentCard(rowData?.item)}
                style={{
                    marginRight: moderateScale(20)
                }} >
                <Image source={imagePath.delete} />
            </TouchableOpacity>
        </View>
    );

    const renderCards = ({ item, index }) => {
        return <ImageBackground source={imagePath.icCardBg} style={styles.flat1Img} >
            <FastImage
                source={getCardImage(item?.brand)}
                resizeMode="contain"
                style={{ ...styles.flat2Img, position: "absolute", right: 20, top: 10 }}
            />
            <View style={{
                position: "absolute",
                bottom: 20,
                left: 20
            }}>
                <Text style={{
                    fontFamily: fontFamily?.medium,
                    fontSize: textScale(14),
                    color: colors.white
                }}>{item?.card_holder_name}</Text>
                <Text style={{
                    fontFamily: fontFamily?.medium,
                    fontSize: textScale(14),
                    color: colors.white,
                    marginTop: moderateScale(4)
                }}>xxxx xxxx xxxx {item?.last4}</Text>
            </View>
        </ImageBackground>

    }

    return (
        <WrapperContainer
            isLoading={isLoading}
            bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
            statusBarColor={colors.white}>
            <OoryksHeader leftTitle={strings.SAVED_CARDS} />

            <StripeProvider
                publishableKey={preferences?.stripe_publishable_key}
                merchantIdentifier="merchant.identifier">
                <View style={{
                    marginTop: moderateScaleVertical(12),
                }}>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={allPaymentCards}
                        renderItem={renderCards}
                        contentContainerStyle={{
                            paddingLeft: moderateScale(20)
                        }}
                        ItemSeparatorComponent={() => <View style={{
                            width: moderateScale(16)
                        }} />}
                        ListEmptyComponent={() => isLoading ? <React.Fragment /> : <View style={{
                            width: width - moderateScale(40),
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <Image source={imagePath.card} />
                            <Text style={{
                                fontFamily: fontFamily?.regular,
                                fontSize: textScale(12),
                                marginTop: moderateScaleVertical(4)
                            }}>No payment cards found!</Text>

                        </View>}
                    />
                </View>
                <View style={styles.underView1}>
                    <View style={styles.underView2}>
                        <TextRowInCorners
                            leftText={strings.CARDS}
                            lefttextStyle={styles.leftText}
                        />
                    </View>
                    <SwipeListView
                        data={allPaymentCards}
                        renderItem={renderSavedCards}
                        renderHiddenItem={renderHiddenItem}
                        disableRightSwipe
                        rightOpenValue={-150}
                        previewRowKey={'0'}
                        previewOpenDelay={3000}
                        keyboardShouldPersistTaps="always"
                        showsVerticalScrollIndicator={false}
                    />
                    <TouchableOpacity
                        onPress={() => setisCardModal(true)}
                        style={{ width: moderateScale(135) }}>
                        <IconTextRow
                            imgStyle={{
                                tintColor: themeColors?.primary_color
                            }}
                            containerStyle={styles.textContainer}
                            icon={imagePath.card}
                            text={"Add new card"}
                            textStyle={styles.text3}
                        />
                    </TouchableOpacity>
                </View>
                <AddPaymentCard isVisible={isCardModal}
                    onBackdropPress={() => setisCardModal(false)}
                    cardHolderName={cardHolderName}
                    cardBankName={cardBankName}
                    onSave={onSaveCardDetails}
                    isLoading={isLoadingSaveCard}
                    onCardChange={onCardChange}
                    onChangeBankName={(text) => setCardBankName(text)}
                    onChangeAccountHolderName={(text) => setCardHolderName(text)}
                />
            </StripeProvider>
        </WrapperContainer>
    );
};

export default SavedPaymentCards;
