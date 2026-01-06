import { isEmpty } from 'lodash'
import React, { useEffect, useState } from 'react'
import { I18nManager, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Image } from 'react-native-animatable'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSelector } from 'react-redux'
import DropDown from '../../Components/DropDown'
import GradientButton from '../../Components/GradientButton'
import LeftRightText from '../../Components/LeftRightText'
import WrapperContainer from '../../Components/WrapperContainer'
import imagePath from '../../constants/imagePath'
import strings from '../../constants/lang'
import actions from '../../redux/actions'
import colors from '../../styles/colors'
import { moderateScale, moderateScaleVertical, width } from '../../styles/responsiveSize'
import { MyDarkTheme } from '../../styles/theme'
import { getColorCodeWithOpactiyNumber, showError } from '../../utils/helperFunctions'
import { getColorSchema } from '../../utils/utils'
import stylesFunc from './styles'

const ProductPowerConumption = ({ navigation }) => {
    const { appData, themeColors, appStyle, currencies, languages, themeColor, themeToggle } = useSelector((state) => state?.initBoot || {});
    const darkthemeusingDevice = getColorSchema();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const fontFamily = appStyle?.fontSizeData;
    // const commonStyles = commonStylesFunc({fontFamily});
    const styles = stylesFunc({ themeColors, fontFamily, isDarkMode, MyDarkTheme });

    const [selectedFilterValue, setSelectedFilterValue] = useState(0)
    const [filterTextInputValues, setFilterTextInputValues] = useState([])
    console.log(filterTextInputValues, "filterTextInputValuesiss")
    const [allAppliances, setAllAppliances] = useState([])
    const [calCulatioResult, setCalCulatioResult] = useState(null)

    const [state, setState] = useState({
        powerConsumption: '',
        hoursUsage: '',
        btnLoader: false,
        isLoading: true,
        calculationUnitsData: [{ id: 1, title: 'Power Consumption' }, { id: 2, title: 'Hours of use per day' }]
    })

    const { powerConsumption, hoursUsage, btnLoader,
        isLoading, calculationUnitsData } = state


    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    useEffect(() => {
        getAllAppliances()
    }, [])



    const errorMethod = (error) => {
        console.log('checking error', error);
        updateState({ btnLoader: false, isLoading: false })
        showError(error?.message || error?.error);
    };

    const getAllAppliances = () => {
        updateState({ isLoading: true })
        actions.getAppliances(
            {},
            {
                code: appData?.profile?.code,
                currency: currencies?.primary_currency?.id,
                language: languages?.primary_language?.id,
                //   systemuser: DeviceInfo.getUniqueId(),
            },
        ).then(res => {
            updateState({ isLoading: false })
            console.log(res, "ressssss")
            if (!isEmpty(res)) {
                setAllAppliances(res?.data?.appliances)
            }
        }).catch(errorMethod)
    }

    const onSelectFilterItem = (item) => {
        setSelectedFilterValue(item)
    }

    const onSubmitFilterValues = () => {
      
        if ( isEmpty(selectedFilterValue)) {
            alert('Please Select appliances')
            return
        }
        if (powerConsumption == '') {
            alert('Please input Power Consumption')
            return
        }
        if (hoursUsage === '') {
            alert('Please inputhours')
            return
        }
        Keyboard.dismiss()

        updateState({ btnLoader: true })
        let data = {}
        data['power'] = powerConsumption
        data['hours'] = hoursUsage
        data['appliance_id'] = selectedFilterValue?.id
        console.log(data, "dataaaaa>>>>")
        actions.getPowerConsumptionCalculation(
            data,
            {
                code: appData?.profile?.code,
                currency: currencies?.primary_currency?.id,
                language: languages?.primary_language?.id,
                //   systemuser: DeviceInfo.getUniqueId(),
            },
        ).then(res => {
            updateState({ btnLoader: false })
            setCalCulatioResult(res?.data)
            console.log(res, "resssssoFPower")
        }).catch(errorMethod)

        // getAllProductsByCategoryId(1,slectedValues )

    }
    const onClear = () => {
        console.log(filterTextInputValues, " filterTextInput")
        updateState({ powerConsumption: '', hoursUsage: '' })
        setSelectedFilterValue(null)
        setCalCulatioResult(null)
    }

    const onChangeFilterText = (text, item) => {
        console.log(text, item, "itemmmmmm<<>>")
        if (item?.id === 1) {
            updateState({ powerConsumption: text })
        } else {
            updateState({ hoursUsage: text })
        }
    }

    const electronicConsumptionFilterView = () => {
        return (
            
                <View style={{
                    ...styles.filterElctConsumpView,
                    backgroundColor: isDarkMode ? MyDarkTheme.colors.background : getColorCodeWithOpactiyNumber(colors.greyA.substring(1), 60),
                }} >

                    <DropDown
                        inputStyle={{
                            height: moderateScaleVertical(40),
                        }}
                        value={isEmpty(selectedFilterValue) ? 0 : selectedFilterValue?.name}
                        modalStyle={{
                            marginTop: moderateScaleVertical(42),
                            width: '100%',
                        }}
                        selectedIndexByProps={-1}
                        placeholder={"Select"}
                        data={allAppliances}
                        fetchValues={(val) => onSelectFilterItem({ ...val })}
                        marginBottom={0}
                    />
                    {console.log(allAppliances, "allAppliancesallAppliances")}
                    {calculationUnitsData.map(item => {
                        return (
                            <View style={{ marginBottom: moderateScaleVertical(10), }} >
                                <Text style={styles.labelText} > {item?.title} </Text>
                                <TextInput
                                    // onEndEditing={Keyboard.dismiss()}
                                    style={styles.textInputStyle}
                                    placeholder={item?.title}
                                    value={item?.id == 1 ? powerConsumption : hoursUsage}
                                    onChangeText={text => onChangeFilterText(text, item)}
                                    keyboardType='numeric'
                                />
                            </View>
                        )
                    })}

                    <View style={styles.btnWrapper} >
                        <GradientButton
                            btnStyle={{ width: width / 4, }}
                            btnText={strings.CLEAR}
                            onPress={onClear}
                        />
                        <GradientButton
                            btnStyle={{ width: width / 2 }}
                            btnText={strings.SUBMIT}
                            onPress={onSubmitFilterValues}
                            indicator={btnLoader}
                        />

                    </View>
                </View>
            
        )
    }

    return (
        <WrapperContainer
            bgColor={isDarkMode
                ? MyDarkTheme.colors.lightDark
                : colors.white}
            statusBarColor={colors.white}
            isLoading={isLoading}
        >
          <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid={true}
                style={{
                    flex: 1,
                }}>
                <View style={{ marginBottom: moderateScaleVertical(10) }} >
                    <View style={styles.headerContainer} >
                        <TouchableOpacity
                            hitSlop={{
                                top: 50,
                                right: 50,
                                left: 50,
                                bottom: 50,
                            }}
                            activeOpacity={0.7}
                            onPress={() => navigation.goBack()}>
                            <Image
                                resizeMode="contain"
                                source={imagePath.back}

                                style={{
                                    // ...leftIconStyle,
                                    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                                    tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                                }}
                            />
                        </TouchableOpacity>
                        <Text style={{ ...styles.HeadertextStyle, color: isDarkMode ? colors.white : colors.black, }} >
                            Power Consumption Calculator
                        </Text>
                        <View />
                    </View>
                </View>
                {electronicConsumptionFilterView()}

                <View style={{ padding: moderateScale(16) }} >
                    <Text style={styles.calculationResultHeading} >
                        Energy consumption result
                    </Text>
                    <LeftRightText
                        leftTextStyle={{ color: isDarkMode ? colors.whiteOpacity50 : colors.blackOpacity70, fontFamily: fontFamily.regular }}
                        leftText={`Energy consumed per day: `}
                        rightText={!!calCulatioResult?.energy_per_day ? `${calCulatioResult?.energy_per_day} KWH/day` : ''}
                        rightTextStyle={{ color: isDarkMode ? colors.whiteOpacity85 : colors.black, marginRight: 10, fontFamily: fontFamily.bold }}
                    />
                    <LeftRightText
                        leftTextStyle={{ color: isDarkMode ? colors.whiteOpacity50 : colors.blackOpacity70, fontFamily: fontFamily.regular }}
                        leftText={`Energy consumed per Month: `}
                        rightText={!!calCulatioResult?.energy_per_month ? `${calCulatioResult?.energy_per_month} KWH/month` : ''}
                        rightTextStyle={{ color: isDarkMode ? colors.whiteOpacity85 : colors.black, marginRight: 10, fontFamily: fontFamily.bold }}
                    />
                    <LeftRightText
                        leftTextStyle={{ color: isDarkMode ? colors.whiteOpacity50 : colors.blackOpacity70, fontFamily: fontFamily.regular }}
                        leftText={`Energy consumed per year: `}
                        rightText={!!calCulatioResult?.energy_per_month ? `${calCulatioResult?.energy_per_year}KWH/year` : ''}
                        rightTextStyle={{ color: isDarkMode ? colors.whiteOpacity85 : colors.black, marginRight: 10, fontFamily: fontFamily.bold }}
                    />
                </View>

        </KeyboardAwareScrollView>
        </WrapperContainer>
    )
}

export default ProductPowerConumption

