import { debounce, isEmpty } from 'lodash';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import HTMLView from 'react-native-htmlview';
import { useSelector } from 'react-redux';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import {
  StatusBarHeight,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import { tokenConverterPlusCurrencyNumberFormater } from '../../../utils/commonFunction';
import { getImageUrl, showError, showSuccess } from '../../../utils/helperFunctions';

import { useFocusEffect } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import Modal from "react-native-modal";
import { SwipeListView } from 'react-native-swipe-list-view';
import ButtonWithLoader from '../../../Components/ButtonWithLoader';
import ButtonImage from '../../../Components/ImageComp';
import OoryksHeader from '../../../Components/OoryksHeader';
import strings from '../../../constants/lang';
import colors from '../../../styles/colors';
import { MyDarkTheme } from '../../../styles/theme';
import { getColorSchema } from '../../../utils/utils';


const theme = {
  // Define your custom colors here
  selectedDayBackgroundColor: colors.black,
  selectedDayTextColor: colors.white,
};
export default function MyP2pPosts({ route, navigation }) {
  const { appData, themeColors, currencies, languages, themeToggle, themeColor, appStyle } = useSelector(
    (state) => state?.initBoot,
  );
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const { additional_preferences, digit_after_decimal } =
    appData?.profile?.preferences || {};
  const { userData } = useSelector((state) => state?.auth);
  const fontFamily = appStyle?.fontSizeData;


  const styles = stylesData({ fontFamily })

  const [allPosts, setAllPosts] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [isLoading, setLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);
  const [isLoadMore, setLoadMore] = useState(true);
  const [isCalendarModal, setIsCalendarModal] = useState(false)
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({})
  const [isLoadingAddProduct, setisLoadingAddProduct] = useState(false)


  useFocusEffect(
    React.useCallback(() => {
      getAllPosts();
    }, []),
  );

  const getAllPosts = (pageNo = 1, limit = 10) => {
    let query = `/${userData?.vendor_id}?limit=${limit}&page=${pageNo}&type=all`;

    actions
      .allVendorData(query, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        console.log(res, '<===response allVendorData');
        setAllPosts(res?.data?.data || []);
        setLoading(false);
        setRefreshing(false);
        if (res?.data?.current_page < res?.data?.last_page) {
          setLoadMore(false);
        }
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    console.log(error, '<===error allVendorData');
    setLoading(false);
    setRefreshing(false);
    setisLoadingAddProduct(false)
    showError(error?.message || error?.error);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getAllPosts(1);
  };

  const onEndReached = () => {
    if (isLoadMore) {
      setPageNo(pageNo + 1);
      getAllPosts(pageNo + 1);
    }
  };

  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });


  const onEditProduct = (item, rowMap) => {

    const data = item?.item
    let product_imgs = []

    data?.media?.map((item, index) => {
      const imageName = item?.image?.path?.original_image.substring(item?.image?.path?.original_image.lastIndexOf("/") + 1);
      let objj = {
        id: item?.id,
        name: imageName,
        type: "image/jpeg",
        uri: item?.image?.path?.original_image
      }
      product_imgs.push(objj)
    })

    const resultDates = {};


    const dateArray = [];
    data?.product_availability?.forEach(item => {
      const date = item.date_time.split(" ")[0]; // Extract the date part
      if (item?.not_available == 1) {
        resultDates[date] = { selected: false };
      } else {
        resultDates[date] = { selected: true };
      }


      if (!dateArray.includes(date)) {
        dateArray.push(date);
      }
    });



    navigation.navigate(navigationStrings.ATTRIBUTE_INFORMATION, {
      category_id: data?.category_id,
      type_id: data?.productcategory?.type_id,
      productData: {

        id: data?.id,
        sku: data?.sku,
        name: data?.translation[0]?.title,
        description: data?.translation[0]?.body_html,
        productImgs: product_imgs,
        price: Number(data?.variant[0]?.price),
        availablityDates: resultDates,
        selectedDates: dateArray,
        weeklyPrice: Number(data?.variant[0]?.week_price),
        monthlyPrice: Number(data?.variant[0]?.month_price),
        originalPrice: Number(data?.variant[0]?.compare_at_price),
        emirateId: Number(data?.variant[0]?.emirate),
        productLocation: {
          address: data?.address,
          latitude: Number(data?.latitude),
          longitude: Number(data?.longitude)
        }
      }
    });
    // setIsCalendarModal(true)

    // const data = item?.item
    // setSelectedProduct(data)
    // if (!isEmpty(data?.product_availability)) {
    //   let dateObj = []
    //   data?.product_availability?.map((item, index) => {
    //     if (moment(item?.date_time).format("YYYY-MM-DD") >= moment(new Date()).format("YYYY-MM-DD"))
    //       dateObj.push(moment(item?.date_time).format("YYYY-MM-DD"))
    //   })
    //   setSelectedDates([...selectedDates, ...dateObj])
    // }
  }

  const onDeleteProduct = (item, rowMap) => {


    Alert.alert('', "Are you sure you want to delete the product?", [
      {
        text: strings.NO,
        onPress: () => console.log('Cancel Pressed'),
      },
      {
        text: strings.YES, onPress: () => {
          setLoading(true)
          actions.vendorDeleteProduct({
            id: item?.item?.id
          }, {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          }).then((res) => {

            showSuccess(res?.message)
            getAllPosts()

          }).catch(errorMethod)

        },
      }
    ]);



  }




  const handleDateSelect = (day) => {
    const selectedDate = day.dateString;
    const newSelectedDates = [...selectedDates];

    if (newSelectedDates.length === 0) {
      newSelectedDates.push(selectedDate);
    } else if (newSelectedDates.length === 1) {
      const firstDate = newSelectedDates[0];
      const currentDate = new Date(selectedDate);
      const firstDateObj = new Date(firstDate);

      if (currentDate < firstDateObj) {
        newSelectedDates.unshift(selectedDate);
      } else {
        newSelectedDates.push(selectedDate);
      }
    } else {
      newSelectedDates.length = 0;
      newSelectedDates.push(selectedDate);
    }

    setSelectedDates(newSelectedDates);
    console.log(newSelectedDates, "fadsjhgfajsdhgf")

  };





  const getMarkedDates = () => {
    const markedDates = {};
    selectedDates.forEach((date) => {
      markedDates[date] = { selected: true, };
    });

    if (selectedDates.length === 2) {
      const startDate = new Date(selectedDates[0]);
      const endDate = new Date(selectedDates[1]);
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const date = currentDate.toISOString().split('T')[0];
        if (!markedDates[date]) {
          markedDates[date] = { selected: true, };
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    return markedDates;
  };

  const onSubmitChanges = () => {
    setisLoadingAddProduct(true)
    const markedDates = getMarkedDates()
    const datesAry = []
    for (const property in markedDates) {
      datesAry.push({
        "not_available": 0,
        "date_time": property
      })
    }

    let formData = new FormData()
    datesAry.forEach((obj, index) => {
      Object.keys(obj).forEach(key => {
        formData.append(`date_availability[${index}][${key}]`, obj[key]);
      });
    });

    formData.append('product_id', selectedProduct?.id || '');
    formData.append('sku', selectedProduct?.sku || '');

    console.log(formData, 'formDataformDataformDataformData', selectedProduct?.sku);
    actions.updateVendorProduct(formData, {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
      'Content-Type': 'multipart/form-data',
    }).then((res) => {
      setisLoadingAddProduct(false)
      showSuccess(res?.message)
      setIsCalendarModal(false)
      getAllPosts()
    }).catch((error) => {
      console.log(error, 'error++++++++++++')
      Alert.alert('Error', error?.message, [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    })

  }

  const renderAllPostsItem = useCallback(
    ({ item, index }) => {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.itemBox}
          onPress={() => {
            navigation.navigate(navigationStrings.P2P_PRODUCT_DETAIL, {
              product_id: item?.id,
              isMyPost: true
            });
          }}>
          <FastImage
            style={styles.imageStyle}
            source={
              !isEmpty(item?.media)
                ? {
                  uri: getImageUrl(
                    item?.media[0].image?.path?.image_fit,
                    item?.media[0].image?.path?.image_path,
                    '500/500',
                  ),
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,
                }
                : imagePath.icDefaultImg
            }
          />

          <View style={{ flex: 1 }}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {/* <View style={{flex: 1, }}> */}
              <Text
                numberOfLines={1}
                style={[styles.font16medium, { textTransform: 'capitalize' }]}>
                {item.translation[0]?.title}
              </Text>

              {/* <Image style={{alignSelf: 'flex-end'}} source={imagePath.share} /> */}
            </View>
            {item?.category_name?.name ? (
              <Text style={styles.font13Regular}>
                in {item.category_name.name}
              </Text>
            ) : null}

            <View style={{ marginTop: 10 }}>

              {!isEmpty(item?.translation) && (item?.translation[0]?.meta_description || item?.translation[0]?.body_html) &&
                <View>
                  {!!item?.translation[0]?.meta_description
                    ? (
                      <Text
                        numberOfLines={3}
                        style={{
                          fontSize: textScale(10),
                          fontFamily: fontFamily.regular,
                          // lineHeight: moderateScale(14),
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.blackOpacity66,
                          textAlign: 'left',
                          marginTop: moderateScaleVertical(8),
                        }}>
                        {item?.translation[0]?.meta_description}
                      </Text>
                    ) : <HTMLView
                      stylesheet={{
                        p: {
                          fontFamily: fontFamily?.regular,
                          fontSize: textScale(12),
                          color: colors.lightGreyText,
                        },

                      }}
                      value={item?.translation[0]?.body_html
                        ? item?.translation[0]?.body_html
                        : ''}
                      textComponentProps={{
                        numberOfLines: 3,
                      }}
                      nodeComponentProps={{ numberOfLines: 3 }}
                    />
                  }
                </View>
              }
              <View />
            </View>
            <Text
              style={{
                fontFamily: fontFamily.bold,
                fontSize: 14,
                color: colors.black,
                marginTop: moderateScaleVertical(4),
              }}>
              {tokenConverterPlusCurrencyNumberFormater(
                Number(item?.variant[0]?.price),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
              )}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [allPosts],
  );

  return (
    <WrapperContainer isLoading={isLoading} bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}>
      <OoryksHeader leftTitle={strings.MY_POSTS} />
      <View
        style={{
          flex: 1,
          paddingHorizontal: moderateScale(15),
        }}>

        <SwipeListView
          disableRightSwipe
          leftOpenValue={75}
          rightOpenValue={-150}
          previewRowKey={'0'}
          previewOpenDelay={3000}
          extraData={allPosts}
          closeOnRowPress
          data={allPosts}
          renderItem={renderAllPostsItem}
          // onRowDidOpen={()=>console.log()}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          renderHiddenItem={(data, rowMap) => (
            <View style={styles.rowReverse}>
              <ButtonImage image={imagePath.deleteRed} onPress={() => onDeleteProduct(data, rowMap)} btnStyle={{
                marginLeft: moderateScale(20)
              }} />
              <ButtonImage image={imagePath.editPencilIcon} onPress={() => onEditProduct(data, rowMap)} />
            </View>
          )}
          refreshControl={
            <RefreshControl
              onRefresh={handleRefresh}
              refreshing={isRefreshing}
            />
          }
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: moderateScale(600),
                }}>
                {!isLoading && <Image source={imagePath.emptyCartRoyo} />}
              </View>
            );
          }}
          onPreviewEnd={onEndReachedDelayed}
        />
      </View>

      <Modal isVisible={isCalendarModal} style={{
        margin: 0
      }}>
        <View style={{ backgroundColor: colors.white, flex: 1, paddingTop: Platform.OS == "ios" ? StatusBarHeight : 0 }}>
          <OoryksHeader
            leftTitle={"Calendar"}
            onPressLeft={() => setIsCalendarModal(false)}
            isCustomLeftPress
            titleStyle={{
              color: colors.black
            }}
          />
          <View>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={getMarkedDates()}
              theme={theme}
              minDate={String(new Date())}
            />
          </View>


          <ButtonWithLoader
            onPress={onSubmitChanges}
            isLoading={isLoadingAddProduct}
            btnStyle={{ backgroundColor: colors.black, width: width - 30, alignSelf: 'center' }}
            containerStyle={{ ...styles.submitBtn, marginTop: moderateScaleVertical(100), backgroundColor: 'black' }}
            btnText={"Submit Changes"}
          />
        </View>
      </Modal>
    </WrapperContainer>
  );
}

function stylesData({ fontFamily, }) {

  const styles = StyleSheet.create({
    font16Semibold: {
      fontFamily: fontFamily.semiBold,
      fontSize: 16,
      color: '#4CB549',
      marginRight: moderateScale(10),
    },
    container: {
      flex: 1,
    },
    font16medium: {
      flex: 1,
      fontSize: 16,
      fontFamily: fontFamily.medium,
      color: colors.black,
    },
    textStyle: {
      color: colors.black,
      fontSize: 24,
      fontFamily: fontFamily.bold,
    },
    imageStyle: {
      width: moderateScale(60),
      height: moderateScaleVertical(60),
      borderRadius: 6,
      marginRight: moderateScale(18),
    },
    rowReverse: {
      flexDirection: 'row-reverse',
      height: '100%',
      alignItems: "center",

    },
    itemBox: {
      padding: moderateScale(18),
      borderRadius: moderateScale(6),
      backgroundColor: colors.whiteSmokeColor,
      flexDirection: 'row',
      marginBottom: moderateScaleVertical(16),
    },
    font13Regular: {
      fontFamily: fontFamily.regular,
      fontSize: 13,
      color: colors.blackOpacity40,
    },
    hiddenButton: {
      paddingHorizontal: moderateScale(14),
      marginBottom: moderateScale(16),
      borderRadius: moderateScaleVertical(8),
      justifyContent: 'center',
      marginLeft: moderateScale(8),
    },
    categoryItem: {
      alignSelf: 'center',
      backgroundColor: '#F8F8F8',
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScaleVertical(16),
      marginBottom: moderateScaleVertical(8),
      borderRadius: moderateScaleVertical(6),
    },
    productBtn: {
      position: 'absolute',
      bottom: Platform.OS == 'ios' ? moderateScale(75) : moderateScale(5),
      borderRadius: moderateScale(100),
      paddingHorizontal: moderateScale(15),
      right: 10,
      backgroundColor: colors.white,
    },
    categoryBtn: {
      position: 'absolute',
      padding: moderateScale(10),
      bottom: moderateScaleVertical(20),
      right: moderateScale(10),
      borderRadius: moderateScale(100),
      paddingHorizontal: moderateScale(15),
    },
    emptyCartBody: {
      justifyContent: 'center',
      alignItems: 'center',
      height: moderateScale(600),
    },
    labelStyle: {
      fontFamily: fontFamily.bold,
      color: colors.blackOpacity43,
      fontSize: textScale(13),
      marginBottom: moderateScale(5),
    },
    addProductBtn: {
      color: colors.white,
      fontSize: textScale(14),
    },
    textInputStyle: {
      fontFamily: fontFamily.bold,
      color: colors.black,
      fontSize: textScale(13),
    },
    noDataFound: {
      width: '100%',
      height: moderateScale(30),
      justifyContent: 'center',
      alignItems: 'center',
    },
    categorySelectDropDownView: {
      borderWidth: 1,
      borderColor: colors.blackOpacity20,
      borderRadius: 5,
      paddingHorizontal: moderateScale(5),
      paddingVertical: moderateScale(5),
      maxHeight: moderateScale(100),
    },
    categoryItm: {
      marginBottom: moderateScale(5),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: 1,
    },
    selectedCategory: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.textGreyB,
      paddingBottom: 8,
    },
    submitBtn:
    {
      backgroundColor: colors.black,
      height: moderateScaleVertical(48),
      width: moderateScale(343),
      alignSelf: 'center',
      borderRadius: 8,
      marginBottom: moderateScaleVertical(60),

    },
  });

  return styles

}
