//import liraries
import React, {Component, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';

import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';

import colors from '../../styles/colors';
import AtlanticHeader from '../../Components/AtlanticHeader';
import strings from '../../constants/lang';
import imagePath from '../../constants/imagePath';
import fontFamily from '../../styles/fontFamily';
import GradientButton from '../../Components/GradientButton';
import AtlanticBottom from '../../Components/AtlanticBottom';
import navigationStrings from '../../navigation/navigationStrings';
import moment from 'moment';
import actions from '../../redux/actions';
import {
  numberFormate,
  numberOfArraySum,
  tokenConverterPlusCurrencyNumberFormater,
} from '../../utils/commonFunction';
import {useSelector} from 'react-redux';

// create a component
const ChooseAddons = ({
  addOnsData,
  onBackPress = () => {},
  totalPrice,
  addToCart = () => {},
  setAddOnsData = () => { },
  buttonLoader
}) => {
  // const {addons} = route?.params;

  // const [addOnsData, setAddOnsData] = useState(addons || []);

  const {appData, themeColors, themeLayouts, currencies, languages, appStyle} =
    useSelector(state => state?.initBoot);
  const {
    additional_preferences,
    digit_after_decimal,
    seller_sold_title,
    seller_platform_logo,
  } = appData?.profile?.preferences || {};

  let selectedAddOnsOption = addOnsData.filter(
    item => item.selectedAddOns && item.selectedAddOns.length > 0,
  );
  let addon_options = selectedAddOnsOption?.map(item => item?.selectedAddOns);
  let price = [].concat(...addon_options)?.map(item => item?.price);

  // const addAndRemoveAddons = (value, index) => {
  //   let newArray = [...addOnsData];
  //   newArray[index].quantity =
  //     newArray[index].quantity > 0 ? newArray[index].quantity : 0;

  //     newArray[index].addOnTotalPrice =
  //       newArray[index].addOnTotalPrice > 0 ? newArray[index].addOnTotalPrice : 0;

  //   if (value && newArray[index].quantity <  newArray[index].max_select ) {
  //     newArray[index].quantity = newArray[index].quantity + 1;
  //     newArray[index].addOnTotalPrice =newArray[index].addOnTotalPrice + Number(newArray[index]['option'][0]?.price);
  //   } else if (!value && newArray[index].quantity > newArray[index].min_select ) {
  //     newArray[index].quantity = newArray[index].quantity - 1;
  //     newArray[index].addOnTotalPrice =newArray[index].addOnTotalPrice - Number(newArray[index]['option'][0]?.price);

  //   }
  //   setAddOnsData(newArray);
  // };

  const selectAddOns = (parentIndex, index) => {
    const newArray = [...addOnsData];
    const selectedOption = newArray[parentIndex].option[index];

    const isSelected = selectedOption.isSelected || false;
    const selectedAddOns = [...(newArray[parentIndex].selectedAddOns || [])];

    if (isSelected) {
      // Deselect the option
      selectedOption.isSelected = false;
      const indexToRemove = selectedAddOns.findIndex(
        option => option.id === selectedOption.id,
      );
      if (indexToRemove !== -1) {
        selectedAddOns.splice(indexToRemove, 1);
      }
    } else if (selectedAddOns.length < newArray[parentIndex].max_select) {
      // Select the option
      selectedOption.isSelected = true;
      selectedAddOns.push(selectedOption);
    } else {
      console.log('Maximum selections reached.');
    }

    newArray[parentIndex].selectedAddOns = selectedAddOns;
    console.log(selectedAddOns, 'newArraynewArraynewArraynewArray');

    setAddOnsData([...newArray]);
  };

  return (
    <WrapperContainer>
      <AtlanticHeader
        lefttext={strings.choose_addons}
        onPressLeft={onBackPress}
      />
      <View style={{marginBottom: moderateScaleVertical(164)}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={addOnsData || []}
          renderItem={({item, index}) => {
            console.log(item, 'itemitem');
            return (
              <View style={styles.mainview}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Image source={imagePath.additional} />
                  <View style={styles.midview}>
                    <Text style={styles.text1}>{item?.title}</Text>
                    {item?.option?.map((ele, i) => {
                      console.log(ele, 'eleeleeleeleele');
                      return (
                        <View style={{width: width / 1.4}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}>
                            <Text style={styles.text2}>{ele?.title}</Text>
                            <TouchableOpacity
                              onPress={() => selectAddOns(index, i)}>
                              <Image
                                source={
                                  ele?.isSelected
                                    ? imagePath.checkBox2Active
                                    : imagePath.checkBox2InActive
                                }
                                style={{
                                  height: moderateScale(24),
                                  width: moderateScale(24),
                                }}
                              />
                            </TouchableOpacity>
                          </View>

                          <Text style={styles.text3}>
                            {tokenConverterPlusCurrencyNumberFormater(
                              numberFormate(ele?.price),
                              digit_after_decimal,
                              additional_preferences,
                              currencies?.primary_currency?.symbol,
                            )}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>

                {/* <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                <TouchableOpacity
                  style={styles.minusview}
                  onPress={() => addAndRemoveAddons(0, index)}>
                  <Image
                    source={imagePath.atlanticminus}
                    style={styles.minus}
                  />
                </TouchableOpacity>
                <View style={styles.midtext}>
                  <Text>{!!item?.quantity ? item?.quantity : 0}</Text>
                </View>
                <TouchableOpacity
                  style={styles.plusview}
                  onPress={() => addAndRemoveAddons(1, index)}>
                  <Image source={imagePath.atlanticplus} style={styles.plus} />
                </TouchableOpacity>
              </View> */}
              </View>
            );
          }}
        />
      </View>

      <AtlanticBottom
        Totalprice={strings.TOTAL_PRICE}
        total={tokenConverterPlusCurrencyNumberFormater(
          numberFormate(totalPrice) + numberOfArraySum(price),
          digit_after_decimal,
          additional_preferences,
          currencies?.primary_currency?.symbol,
        )}
        buttonLoader={buttonLoader}
        btnText={strings.NEXT}
        onPress={addToCart}
      />
    </WrapperContainer>
  );
};

// define your styles
const styles = StyleSheet.create({
  mainview: {
    width: width - 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: moderateScale(4),
    backgroundColor: colors.grey2,
    alignSelf: 'center',
    paddingVertical: moderateScaleVertical(15),
    paddingHorizontal: moderateScale(10),
    marginVertical: moderateScaleVertical(12),
  },
  midview: {marginLeft: moderateScale(22)},
  minusview: {
    height: moderateScaleVertical(16),
    width: moderateScale(16),
    paddingBottom: 2,
    backgroundColor: colors.greyColor3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusview: {
    height: moderateScaleVertical(16),
    width: moderateScale(16),
    backgroundColor: colors.atlanticgreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text1: {fontSize: textScale(16), fontFamily: fontFamily.semiBold},
  text2: {
    fontSize: textScale(12),
    marginTop: moderateScaleVertical(4),
    marginBottom: moderateScaleVertical(8),
  },
  text3: {
    fontSize: textScale(14),
    color: colors.atlanticgreen,
    fontFamily: fontFamily.semiBold,
  },
  minus: {height: moderateScaleVertical(9), width: moderateScale(9)},
  midtext: {
    height: moderateScaleVertical(16),
    width: moderateScale(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: {height: moderateScaleVertical(9), width: moderateScale(9)},
});

//make this component available to the app
export default ChooseAddons;
