import { CardField } from '@stripe/stripe-react-native';
import React from 'react';
import { Keyboard, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import strings from '../constants/lang';
import colors from '../styles/colors';
import { moderateScale, moderateScaleVertical, textScale } from '../styles/responsiveSize';
import ButtonWithLoader from './ButtonWithLoader';

export default function AddPaymentCard({
    isVisible = false,
    onSave = () => { },
    onBackdropPress = () => { },
    cardHolderName = '',
    cardBankName = '',
    isLoading = false,
    onCardChange = () => { },
    onChangeBankName = () => { },
    onChangeAccountHolderName = () => { }

}) {
    const { appStyle, themeColors } = useSelector(
        state => state?.initBoot,
    );
    const fontFamily = appStyle?.fontSizeData;

    const styles = stylesData({
        fontFamily
    })

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onBackdropPress}
            avoidKeyboard={Platform.OS === "ios"}
            style={{
                margin: 0,
                justifyContent: 'flex-end',
            }}>

            <View style={styles.mainView}>
                <Text style={styles.numStyle}>{strings.ADD_NEW_CARD}</Text>
                <Text style={styles.labelStyle}>{"Name on Card"}</Text>
                <TextInput style={styles.inputStyle}
                    value={cardHolderName}
                    onChangeText={onChangeAccountHolderName} />

                <Text style={styles.labelStyle}>{"Bank Name"}</Text>
                <TextInput style={styles.inputStyle}
                    value={cardBankName}
                    onChangeText={onChangeBankName} />

                <Text style={styles.labelStyle}>{"Card Details"}</Text>
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
                        marginVertical: 10,
                    }}
                    onCardChange={onCardChange}
                    onBlur={() => {
                        Keyboard.dismiss();
                    }}
                />

                <ButtonWithLoader
                    isLoading={isLoading}
                    onPress={onSave}
                    btnText={strings.SAVE}
                    btnStyle={{
                        backgroundColor: themeColors?.primary_color,
                        borderWidth: 0
                    }}
                />
                <View
                    style={{
                        height: moderateScaleVertical(10),
                    }}
                />
            </View>

        </Modal>
    )
}

function stylesData({ fontFamily }) {
    const styles = StyleSheet.create({
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
        labelStyle: {
            fontSize: textScale(14),
            marginTop: moderateScaleVertical(12),
            opacity: 0.5,
            fontFamily: fontFamily?.medium,
        },
        inputStyle: {
            width: "100%",
            height: moderateScale(48),
            borderWidth: 1,
            marginTop: moderateScaleVertical(6),
            borderRadius: moderateScale(4),
            borderColor: colors.profileInputborder,

        },
        numStyle: {
            fontSize: textScale(20),
            fontFamily: fontFamily?.medium,
        },
    })

    return styles

}