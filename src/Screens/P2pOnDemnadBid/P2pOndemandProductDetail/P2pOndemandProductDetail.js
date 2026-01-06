import {
  BottomSheetModal,
  BottomSheetModalProvider
} from '@gorhom/bottom-sheet';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { getDistance } from 'geolib';
import { cloneDeep, isEmpty } from 'lodash';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import ImageView from "react-native-image-viewing";
import MapView, { Circle, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import Modal from 'react-native-modal';
import RenderHTML from 'react-native-render-html';
import { Shadow } from 'react-native-shadow-2';
import Carousel from 'react-native-snap-carousel';
import StarRating from 'react-native-star-rating';
import { useSelector } from 'react-redux';
import ButtonWithLoader from '../../../Components/ButtonWithLoader';
import GradientButton from '../../../Components/GradientButton';
import OoryksHeader from '../../../Components/OoryksHeader';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import { hitSlopProp } from '../../../styles/commonStyles';
import {
  StatusBarHeight,
  height,
  moderateScale,
  moderateScaleVertical,
  scale,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import { tokenConverterPlusCurrencyNumberFormater } from '../../../utils/commonFunction';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  showError,
  showSuccess
} from '../../../utils/helperFunctions';
import { dialCall } from '../../../utils/openNativeApp';
import { getColorSchema } from '../../../utils/utils';
import styleFun from './styles';



let calendarTheme = {
  selectedDayBackgroundColor: colors.black,
  selectedDayTextColor: colors.white,
}

const P2pProductDetail = ({ navigation, route, item }) => {
  const carouselRef = useRef(null);
  const mapRef = useRef(null)
  const snapPoints = useMemo(() => [height], []);
  const bottomSheetModalRef = useRef(null);
  const paramData = route?.params;

  const {
    appData,
    currencies,
    languages,
    themeColor,
    themeToggle,
    appStyle,
    themeColors,
    redirectedFrom
  } = useSelector(state => state?.initBoot);
  const { userData } = useSelector(state => state?.auth);
  const { dineInType, location } = useSelector((state) => state?.home);
  const reloadData = useSelector((state) => state?.reloadData?.reloadData);
  const navigationRef = useNavigation();


  const { additional_preferences, digit_after_decimal } = appData?.profile?.preferences || {};

  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;
  const styles = styleFun({ themeColor, themeToggle, fontFamily });
  const [indexSelected, setIndexSelected] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [productInfo, setProductInfo] = useState({});
  const [productAttributeInfo, setProductAttributeInfo] = useState([]);
  const [selectedPanoImg, setSelectedPanoImg] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [region, setRegion] = useState({
    latitude: null,
    longitude: null,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });
  const [pickUpTime, setPickUpTime] = useState("1:00 AM")
  const [dropOffTime, setDropOffTime] = useState("12:00 PM")
  const [selectedDates, setSelectedDates] = useState({});
  const [isLoadingAddToCart, setisLoadingAddToCart] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [isImagesModal, setImagesModal] = useState(false)
  const [productAllImgs, setProductAllImgs] = useState([])
  const [activeImgInx, setActiveImgInx] = useState(0)
  const [isKycErrorModal, setIsKycErrorModal] = useState(false)
  const [pickupvalues, setPickupValues] = useState(1)
  const [dropoffValues, setDropoffValues] = useState(1);
  const [isOtherProducts, setIsOtherProducts] = useState(true)
  const [otherProducts, setOtherProducts] = useState([]);
  const [isLoadingChat, setLoadingChat] = useState(false);


  const moveToNewScreen = (screenName, data = {}) => () => { navigation.navigate(screenName, { data }) };
  useEffect(() => {
    getP2pProductDetail();
    // return () => {
    //   if (!!redirectedFrom && !userData?.auth_token) {
    //     actions.setRedirection(``);
    //   }
    // }
  }, []);


  useEffect(() => {
    if (!isEmpty(selectedDates)) {
      let date = new Date()
      let values = Object.values(selectedDates)[0]
      let keys = Object.keys(selectedDates)[0]
      if (!!values.is_selected && keys == startDate && startDate == endDate) {
        let dateto = moment(date).format('HH')
        const resj = dateto.split(':')
        setPickupValues(resj[0])
        setDropoffValues(resj[0])
        setPickUpTime(moment(date).format('hh:mm A'))
        setDropOffTime(moment(date).format('hh:mm A'))
      }
      else if (keys != startDate) {
        setPickupValues(1)
        setPickUpTime('1:00 AM')
        setDropOffTime('12:00 PM')
      }
      else if (startDate != endDate) {
        setDropoffValues(1)
        setDropOffTime('12:00 PM')
      }
    }
  }, [selectedDates])

  const renderReview = ({ item, index }) => {
    const imageUrl = getImageUrl(item.userimage?.image.image_fit, item.userimage?.image.image_path, '400/400');
    return (
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: moderateScale(16),
        }}>
        <View style={{
          flexDirection: 'row',
        }}>
          <Image
            resizeMode='contain'
            style={{
              height: moderateScale(40),
              width: moderateScale(40),
              borderRadius: moderateScale(50),
              borderWidth: 3,
              borderColor: themeColors?.primary_color
            }}
            source={{ uri: imageUrl }} />
          <View style={{ marginLeft: moderateScale(12), }}>
            <Text style={{
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              fontFamily: fontFamily?.regular,

            }}>{item?.userimage?.name}</Text>
            <StarRating
              starStyle={{
                height: moderateScaleVertical(15),
                marginTop: moderateScaleVertical(5),
              }}
              disabled={false}
              maxStars={5}
              emptyStar={imagePath.ic_star}
              rating={Number(item?.rating)}
              // selectedStar={(rating) => onStarRatingPress(rating)}
              fullStarColor={colors.ORANGE}
              starSize={12}
            />
          </View>
        </View>
        <Text
          style={{
            flex: 1,
            marginLeft: moderateScaleVertical(16),
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            fontFamily: fontFamily?.regular,

          }}>
          {item?.review}
        </Text>

      </View>
    );
  };


  const getP2pProductDetail = (routeProductId) => {
    const parts = redirectedFrom.split("-"); // Split the string into an array using "-"
    const charactersAfterDash = parts[1];


    actions
      .getProductDetailByProductId(
        `/${charactersAfterDash || paramData?.product_id}`,
        {},
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
        },
      )
      .then(res => {
        console.log(res, '<===response getProductDetailByProductId');
        setIsLoading(false);
        setProductInfo(res?.data?.products);
        setOtherProducts(res?.data?.suggested_vendor_products)
        if (!isEmpty(res?.data?.products?.product_availability)) {
          let dateObj = {}
          res?.data?.products?.product_availability?.map((item, index) => {
            if (moment(item?.date_time).format("YYYY-MM-DD") >= moment(new Date()).format("YYYY-MM-DD"))
              dateObj[moment(item?.date_time).format("YYYY-MM-DD")] = { selected: true, customStyles: { container: { backgroundColor: !!item?.not_available ? colors.grey1 : colors.black }, text: { color: colors.white } }, is_blocked: !!item?.not_available }
          })
          setSelectedDates({ ...selectedDates, ...dateObj })
        }
        setRegion({
          latitude: Number(res?.data?.products?.latitude),
          longitude: Number(res?.data?.products?.longitude),
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        })
        var results = res?.data?.product_attribute.reduce(function (
          results,
          org,
        ) {
          (results[org.attribute_id] = results[org.attribute_id] || []).push(
            org,
          );
          return results;
        },
          {});

        setProductAttributeInfo(Object.values(results) || []);
      })
      .catch(errorMethod);
  };

  const onSelect = indexSelected => {
    setIndexSelected(indexSelected);
  };


  const errorMethod = error => {
    console.log(error, '<===error getProductDetailByProductId');
    setIsLoading(false);
    showError(error?.message || error?.error);
  };

  const createRoom = async () => {
    if (!userData?.auth_token) {
      showError("Please login to access this feature")
      setTimeout(() => {
        actions.setAppSessionData('on_login');
      }, 400);
      return;
    }
    setLoadingChat(true);
    try {
      const apiData = {
        sub_domain: '192.168.101.88', //this is static value
        client_id: String(appData?.profile.id),
        db_name: appData?.profile?.database_name,
        user_id: String(userData?.id),
        type: 'user_to_user',
        product_id: String(productInfo?.id),
        vendor_id: String(productInfo?.vendor?.id),
      };

      console.log('sending api data', apiData);
      const res = await actions.onStartChat(apiData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      });

      if (!!res?.roomData) {
        onChat(res.roomData);
      }
      setLoadingChat(false);
    } catch (error) {
      setLoadingChat(false);
      console.log('error raised in start chat api', error);
      showError(error?.message);
    }
  };

  const onChat = item => {
    navigation.navigate(navigationStrings.CHAT_SCREEN, { data: { ...item } });
  };


  const renderItem = useCallback(({ item, index }) => {

    return (
      <View style={styles.item}>
        <FastImage
          source={{
            uri: getImageUrl(
              item?.image?.path?.image_fit,
              item?.image?.path?.image_path,
              '600/600',
            ),
          }}
          resizeMode='contain'
          style={{
              width: "100%",
              height: "auto",
              aspectRatio: 1,
            borderBottomLeftRadius: moderateScale(12),
            borderBottomRightRadius: moderateScale(12),

          }}
        />
      </View>
    );
  }, [productInfo]);

  const toggleModal = () => {

    let firstSelectedDate = null;
    let lastSelectedDate = null;

    let markedDates = cloneDeep(selectedDates)
    let newDates = {}
    Object.keys(markedDates).forEach(date => {
      if (markedDates[date].is_selected) {
        newDates[date] = markedDates[date]
      }
    });

    if (!isEmpty(newDates)) {
      let minDate = String(moment(Math.min(...Object.keys(newDates).map(Date.parse))).format("YYYY-MM-DD"))
      let maxDate = String(moment(Math.max(...Object.keys(newDates).map(Date.parse))).format("YYYY-MM-DD"))
      setStartDate(minDate)
      setEndDate(maxDate)
    }





    setModalVisible(!isModalVisible);
  };

  const renderaAttributeItems = useCallback(
    ({ item, index }) => {
      console.log(item,'itemitemtest')
      return (
        <View
          style={{
            marginTop: moderateScaleVertical(5),
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            {item?.map((item, index) => {
              return (
                <Text
                  style={{
                    fontFamily: fontFamily?.regular,
                    fontSize: textScale(12),
                    color: isDarkMode
                      ? MyDarkTheme?.colors?.text
                      : colors.black,
                  }}>
                  <Text
                    style={{
                      fontFamily: fontFamily?.bold,
                      fontSize: textScale(12),
                      color: isDarkMode
                        ? MyDarkTheme?.colors?.text
                        : colors.black,
                    }}>
                    {index == 0 ? `${item?.title}: ` : ''}
                  </Text>
                  {index == 0 ? '' : ','} {item?.value}
                </Text>
              );
            })}
          </View>
        </View>
      );
    },
    [productInfo],
  );
  const modalContent = () => {
    return (
      <View
        style={{
          height: height,
          backgroundColor: colors.green,
        }}>
        <WrapperContainer>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
              zIndex: 1,
            }}
            onPress={() => {
              bottomSheetModalRef.current.close();
              setSelectedPanoImg(null);
            }}>
            <Image source={imagePath.back1} />
          </TouchableOpacity>

          <FastImage
            source={{
              uri: getImageUrl(
                selectedPanoImg?.image?.path?.image_fit,
                selectedPanoImg?.image?.path?.image_path,
                '400/400',
              ),
            }}
            style={{
              height: height - moderateScaleVertical(40),
              width: width,
            }}
          />
        </WrapperContainer>
      </View>
    );
  };
  // console.log(moment(`${startDate}${pickUpTime}`), 'moment(startDate,pickUpTime).utc()moment(startDate,pickUpTime).utc()')

  const markStartEndDate = (markedDates) => {

    let newDates = {}
    for (let key in markedDates) {
      if (markedDates[key]?.is_selected) {
        newDates[key] = markedDates[key]
      }
    }
    if (isEmpty(newDates)) {
      setStartDate('')
      setEndDate('')
      return
    }
    let minDate = String(moment(Math.min(...Object.keys(newDates).map(Date.parse))).format("YYYY-MM-DD"))
    let maxDate = String(moment(Math.max(...Object.keys(newDates).map(Date.parse))).format("YYYY-MM-DD"))
    setStartDate(minDate || '')
    setEndDate(maxDate || '')
  }



  const handleDayPress = (day) => {
    let markedDates = cloneDeep(selectedDates)

    if (isEmpty(markedDates[day?.dateString]) || markedDates[day?.dateString]?.is_blocked) {
      alert("Please select available date only")
      return
    }
    // return
    let is_selected_count = 0;
    for (const date in markedDates) {
      if (markedDates[date].is_selected) {
        is_selected_count++;
      }
    }
    if (is_selected_count > 1) {
      for (const property in markedDates) {
        if (!!markedDates[property]?.is_selected) {
          delete markedDates[property]?.is_selected
          markedDates[property] = { selected: true, customStyles: { container: { backgroundColor: colors.black }, text: { color: colors.white } } }
        }
      }
      markedDates[day?.dateString] = { selected: true, customStyles: { container: { backgroundColor: themeColors?.primary_color }, text: { color: colors.white } }, is_selected: true }
      markStartEndDate(markedDates)
      setSelectedDates(markedDates)
    } else {

      if (markedDates[day?.dateString] && markedDates[day?.dateString].is_selected) {
        markedDates[day?.dateString] = { selected: true, customStyles: { container: { backgroundColor: colors.black }, text: { color: colors.white } } }
        markStartEndDate(markedDates)
        setSelectedDates(markedDates)
      }
      else {
        console.log(markedDates, "<===markedDates")
        const keys = Object.keys(markedDates);
        const selectedIndex = keys.findIndex(key => markedDates[key].is_selected === true);
        if (selectedIndex !== -1) {
          const start = Object.keys(markedDates)[selectedIndex];
          const end = day.dateString;

          let isSelectedInRange = false;

          for (let date = start; date <= end; date = new Date(Date.parse(date) + 86400000).toISOString().slice(0, 10)) {
            if (!markedDates[date]) {
              isSelectedInRange = true;
              break;
            }
            if (markedDates[date] && markedDates[date].is_blocked) {
              isSelectedInRange = true;
              break;
            }
          }

          if (!isSelectedInRange) {
            const range = {};
            for (let d = new Date(start); d <= new Date(end); d.setDate(d.getDate() + 1)) {
              const date = moment(d).format('YYYY-MM-DD');
              if (date === start) {
                range[date] = { selected: true, customStyles: { container: { backgroundColor: themeColors?.primary_color }, text: { color: colors.white } }, is_selected: true }
              } else if (date === end) {
                range[date] = { selected: true, customStyles: { container: { backgroundColor: themeColors?.primary_color }, text: { color: colors.white } }, is_selected: true }
              } else {
                range[date] = { selected: true, customStyles: { container: { backgroundColor: themeColors?.primary_color }, text: { color: colors.white } }, is_selected: true }
              }
            }
            let newMarkDates = { ...markedDates, ...range }
            markStartEndDate(newMarkDates)
            setSelectedDates(newMarkDates);
          }
          else {
            alert("You can not select blocked dates")
          }
        }
        else {
          markedDates[day?.dateString] = { selected: true, customStyles: { container: { backgroundColor: themeColors?.primary_color }, text: { color: colors.white } }, is_selected: true }
          markStartEndDate(markedDates)
          setSelectedDates(markedDates)
        }
      }
    }

    return
  };



  const onTimeSlider = (value, key) => {
    let val = value[0]
    let minSelectedDate = null
    let selectedDatesCount = 0

    for (let val in selectedDates) {
      if (!!selectedDates[val]?.is_selected) {
        selectedDatesCount = selectedDatesCount + 1
        if (!minSelectedDate) {
          minSelectedDate = val
        }
      }
    }


    let currentTime = moment(new Date()).format("h")
    let currentTimeToSet = moment(new Date()).format("hh:mm")

    if (val === 24 || val === 12) {
      key == "P" ? setPickUpTime(val === 24 ? "12:00 AM" : "12:00 PM") : setDropOffTime(val === 24 ? "12:00 AM" : "12:00 PM")
    }
    else if (val >= 13) {

      key == "P" ? setPickUpTime((minSelectedDate == moment(new Date()).format("YYYY-MM-DD") && val - 12 == currentTime) ? `${currentTimeToSet} PM` : `${val - 12}:00 PM`) : setDropOffTime((minSelectedDate == moment(new Date()).format("YYYY-MM-DD") && val - 12 == currentTime && selectedDatesCount === 1) ? `${currentTimeToSet} PM` : `${val - 12}:00 PM`)


    }
    else {
      key == "P" ? setPickUpTime((minSelectedDate == moment(new Date()).format("YYYY-MM-DD") && val - 12 == currentTime) ? `${currentTimeToSet} AM` : `${val}:00 AM`) : setDropOffTime((minSelectedDate == moment(new Date()).format("YYYY-MM-DD") && val - 12 == currentTime && selectedDatesCount === 1) ? `${currentTimeToSet} AM` : `${val}:00 AM`)
    }

  }




  const _finalAddToCart = () => {
    const combinedStartDateTimeString = `${startDate} ${pickUpTime}`;

    // Parse the combined date and time string in a specific format
    const dateStartTime = moment(combinedStartDateTimeString, 'YYYY-MM-DD h:mm A');

    // Convert to UTC
    const utcStartDateTime = dateStartTime.format('YYYY-MM-DD HH:mm:ss');
    const combinedEndDateTimeString = `${endDate} ${dropOffTime}`;

    // Parse the combined date and time string in a specific format
    const dateEndTime = moment(combinedEndDateTimeString, 'YYYY-MM-DD h:mm A');

    // Convert to UTC
    const utcEndDateTime = dateEndTime.format('YYYY-MM-DD HH:mm:ss');



    const data = {};
    data['sku'] = productInfo?.sku;
    data['quantity'] = 1;
    data['product_variant_id'] = productInfo?.variant[0]?.id;
    data['type'] = dineInType;
    data['start_date_time'] = productInfo?.category?.category_detail?.type_id == 13 ? moment().format("YYYY-MM-DD HH:mm:ss") : utcStartDateTime;
    data['end_date_time'] = productInfo?.category?.category_detail?.type_id == 13 ? moment().format("YYYY-MM-DD 23:59:59") : utcEndDateTime;
    data['emirate_id'] = productInfo?.variant[0]?.emirate;

    actions.addProductsToCart(data, {
      code: appData.profile.code,
      currency: currencies.primary_currency.id,
      language: languages.primary_language.id,
      systemuser: DeviceInfo.getUniqueId(),
    })
      .then((res) => {
        setisLoadingAddToCart(false)
        actions.cartItemQty(res);
        actions.reloadData(!reloadData);
        // showSuccess(strings.PRODUCT_ADDED_SUCCESS);
        moveToNewScreen(navigationStrings.PRODUCT_PRICE_DETAILS, {
          type_id: productInfo?.category?.category_detail?.type_id,
          distance: Number(distance() / 1000).toFixed(2),
          vendor_name: productInfo?.vendor?.name,
          vendor_rating: productInfo?.averageRating
        })()
      })
      .catch((error) => {

        if (error?.data?.is_kyc == 1) {
          setIsKycErrorModal(true)
          setisLoadingAddToCart(false)
          return
        } else {
          setisLoadingAddToCart(false)
          showError(error?.message || error?.error)
        }

      });
  }


  const clearEntireCart = () => {
    if (!userData?.auth_token) {
    showError('Please login to access check final price')
    return
      const parts = redirectedFrom.split("-"); // Split the string into an array using "-"
      const charactersAfterDash = parts[1];
      actions.setRedirection(`productDetail-${paramData?.product_id || charactersAfterDash}`);
      actions.setAppSessionData('on_login');
      return;
    }

    if (productInfo?.category?.category_detail?.type_id == 10 && (!startDate || !endDate)) {
      showError("Please select rental date range")
      return
    }


    if (productInfo?.vendor?.id === userData?.vendor_id) {
      showError("Product is added by you!")
      return;
    }
    setisLoadingAddToCart(true)
    actions.clearCart({},
      {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      },
    )
      .then(res => {
        actions.cartItemQty({});
        if (res?.message) {
          _finalAddToCart()
        }
      })
      .catch((error) => showError('something went wrong'));
  };


  //add Product to wishlist
  const _onAddtoWishlist = () => {
    const item = cloneDeep(productInfo)
    if (!!userData?.auth_token) {
      actions
        .updateProductWishListData(
          `/${item.product_id || item.id}`,
          {},
          {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          },
        )
        .then(res => {
          showSuccess(res.message);

          if (item?.is_wishlist) {
            item.is_wishlist = null;
            setProductInfo(item)
          } else {
            item.is_wishlist = { product_id: item?.id };
            setProductInfo(item)
          }
        })
        .catch(errorMethod);
    } else {
      actions.setAppSessionData('on_login');
    }
  };


  const focusOnLocation = () => {
    const reg = {
      latitude: region?.latitude,
      longitude: region?.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };

    mapRef.current.animateToRegion(reg, 1000); // Animation duration in milliseconds
  };


  const [visible, setIsVisible] = useState(false);

  const distance = () => {
    return getDistance(
      {
        latitude: !!productInfo?.latitude?productInfo?.latitude:0,
        longitude: !!productInfo?.longitude?productInfo?.longitude:0,
      },
      { latitude: location?.latitude, longitude: location?.longitude },
    );

  }

  const getEmirateName = (productInfo) => {
    const itemWithName = appData?.emirates?.find(item => item.id === Number(productInfo?.variant[0]?.emirate));
    return itemWithName?.name || productInfo?.variant[0]?.emirate || ''
  }





  const getPlanType = () => {
    let count = 0;
    let newSelectedDates = cloneDeep(selectedDates)
    for (var key in newSelectedDates) {
      if (!!newSelectedDates[key]?.is_selected) {
        count = count + 1
      }
    }
    return count == 0 ? "0" : count < 7 ? "day" : count >= 7 && count < 30 ? "week" : "month"
  }


  const renderOtherProducts = useCallback(
    (item, index) => {

      return <TouchableOpacity

        onPress={() => navigation.push(navigationStrings.P2P_PRODUCT_DETAIL, {
          product_id: item?.id,
        })}
        style={{
          width: (width - moderateScale(48)) / 2,
          marginTop: index > 1 ? moderateScaleVertical(16) : 0,

        }}>
        <View style={{
          backgroundColor: "#FAFAFA"
        }}>
          <FastImage

            source={{
              uri: getImageUrl(
                item?.media[0]?.image?.path?.image_fit,
                item?.media[0]?.image?.path?.image_path,
                '1000/1000',
              )
            }}
            resizeMode='contain'
            style={{
              width: "100%",
              height: "auto",
              maxWidth:moderateScale( (width - moderateScale(48)) / 2),
              maxHeight:moderateScaleVertical( (width - moderateScale(48)) / 2),
              aspectRatio: 1,
              alignSelf: "center",

            }} />
          <View style={{
            bottom: 0,
            height: moderateScaleVertical(28),
            width: moderateScale(60),
            backgroundColor: item?.category?.category_detail?.type_id == 10 ? colors.purple : colors.blue,
            position: "absolute",
            zIndex: 1,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: moderateScale(3)
          }} >

            <Text style={{
              fontFamily: fontFamily?.regular,
              fontSize: textScale(10),
              color: colors.white
            }}>{item?.category?.category_detail?.type_id == 10 ? "For Rent" : "For Sale"}</Text>
          </View>
        </View>
        <View style={{
          paddingVertical: moderateScaleVertical(6)
        }}>
          <Text style={{
            fontFamily: fontFamily?.regular,
            fontSize: textScale(11),
            color: colors.blackOpacity30
          }}>{item?.category_name?.name}</Text>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: fontFamily?.regular,
              fontSize: textScale(12),
              color: colors.black,
              marginTop: moderateScaleVertical(4)
            }}>{item?.title}</Text>
          <Text style={{
            fontFamily: fontFamily?.regular,
            fontSize: textScale(12),
            color: colors.black,
            marginTop: moderateScaleVertical(4)
          }}>{tokenConverterPlusCurrencyNumberFormater(
            item?.variant[0]?.price,
            digit_after_decimal,
            additional_preferences,
            currencies?.primary_currency?.symbol,
          )} {item?.type_id == 13 && <Text style={{
            color: colors.blackOpacity30
          }}> / day</Text>}</Text>
        </View>

      </TouchableOpacity>
    },
    [],
  )



  if (isLoading) {
    return <WrapperContainer isLoading={isLoading} />;
  }
  const { month_price: monthPrice = '', week_price: weekPrice = '', price: dayPrice = '',
  } = productInfo && productInfo?.variant ? productInfo?.variant[0] : {}
  return (
    <WrapperContainer>
    <View
      style={{
        ...styles.container,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.white,
        paddingBottom: paramData?.isMyPost ? 0 : moderateScaleVertical(50)
      }}>
      {!isEmpty(productInfo) && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, }}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => {
                let productImgs = []
                productInfo?.product_media?.map((item) => {
                  let url = getImageUrl(
                    item?.image?.path?.image_fit,
                    item?.image?.path?.image_path,
                    '1000/1000',
                  )
                  productImgs.push({
                    uri: url
                  })
                })
                setProductAllImgs(productImgs)
                setImagesModal(true)
              }}
              activeOpacity={0.9}
              disabled={isEmpty(productInfo?.product_media)} style={{ backgroundColor: colors.white }}>

              {!isEmpty(productInfo?.product_media) ? (
                <Carousel
                  ref={carouselRef}
                  sliderWidth={width}
                  sliderHeight={height}
                  itemWidth={width}
                  data={productInfo?.product_media}
                  renderItem={renderItem}
                  onSnapToItem={index => onSelect(index)}
                />
              ) : (
                <FastImage
                  source={imagePath.icDefaultImg}
                  style={{
                    height: moderateScale(250),
                    width: width,

                  }}
                />
              )}

            </TouchableOpacity>
            <View
              style={{ ...styles.back, paddingLeft: moderateScale(16) }}
            >
              <Shadow

                style={{
                  backgroundColor: colors.white,
                  height: 35, width: 35,

                  borderRadius: moderateScale(4)

                }}
                distance={1}
              >

                <TouchableOpacity
                  hitSlop={hitSlopProp}
                  style={{
                    height: "100%",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}

                  onPress={() => {
                    actions.setRedirection(``);
                    if (!!redirectedFrom?.includes("productDetail")) {
                      const resetAction = CommonActions.reset({
                        index: 0,
                        routes: [{ name: navigationStrings.HOME }], // Replace 'NewScreen' with your desired starting screen
                      });
                      navigationRef.dispatch(resetAction);
                    }
                    else {
                      navigation.goBack()
                    }


                  }}>
                  <Image source={imagePath.icBackb} />
                </TouchableOpacity>

              </Shadow>

              {/* <TouchableOpacity
                  onPress={() => navigation.goBack()}>
                  <Image source={imagePath.icBckBtn} />
                </TouchableOpacity> */}

              <TouchableOpacity


                onPress={_onAddtoWishlist}>
                <Image source={!!productInfo?.is_wishlist ? imagePath.icHeart : imagePath.wishlist} style={{
                  height: moderateScale(30),
                  width: moderateScale(30),
                  resizeMode: 'contain',
                  tintColor: themeColors?.primary_color

                }} />
              </TouchableOpacity>

            </View>

            {!isEmpty(productInfo?.product_media) &&
              productInfo?.product_media.length >= 2 && (
                <View
                  style={{
                    position: 'absolute',
                    top: moderateScaleVertical(140),
                    zIndex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: width,
                  }}>
                  <TouchableOpacity
                    hitSlop={hitSlopProp}
                    onPress={() => carouselRef.current.snapToPrev()}
                    style={{ ...styles.leftRightBtn, left: moderateScale(15) }}>
                    <Image
                      source={imagePath.backRoyo}
                      style={{
                        tintColor: themeColors.primary_color,
                      }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    hitSlop={hitSlopProp}
                    onPress={() => carouselRef.current.snapToNext()}
                    style={{ ...styles.leftRightBtn, right: moderateScale(15) }}>
                    <Image
                      source={imagePath.backRoyo}
                      style={{
                        tintColor: themeColors.primary_color,
                        transform: [{ rotate: '180deg' }],
                      }}
                    />
                  </TouchableOpacity>
                </View>
              )}

            <View style={styles.pagination}>
              {
                !isEmpty(productInfo?.product_media)
                &&
                productInfo?.product_media?.length >= 2
                &&
                productInfo?.product_media?.map((item, index) => {
                  return (
                    <View
                      key={String(index)}
                      style={[
                        styles.dotStyle,
                        {
                          backgroundColor:
                            index === indexSelected
                              ? colors.orange1
                              : colors.white,
                          marginLeft: index !== 0 ? moderateScale(8) : 0,
                        },
                      ]}
                    />
                  );
                })
              }
            </View>



            <Text
              style={{
                marginTop: moderateScale(11),
                fontFamily: fontFamily?.medium,
                fontSize: textScale(20),
                marginHorizontal: moderateScale(16),
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black
              }}>
              {productInfo?.translation[0]?.title}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginLeft: moderateScale(16),
                marginTop: moderateScaleVertical(18),
              }}>
              <Image source={{ uri: getImageUrl(productInfo?.vendor?.logo?.image_fit, productInfo?.vendor?.logo?.image_path, "200/200") }} style={{
                height: 40, width: 40,
                borderRadius: 20
              }} />
              <View style={{ marginLeft: moderateScale(16) }}>
                <Text style={{
                  fontFamily: fontFamily?.regular,
                  fontSize: textScale(13),
                  color: colors.textGreyL
                }}>{strings.LENT_BY} <Text style={{
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black
                }}>{productInfo?.vendor?.name}</Text></Text>
                <StarRating
                  starStyle={{
                    width: moderateScale(19),
                    height: moderateScaleVertical(15),
                    marginTop: moderateScaleVertical(5),
                  }}
                  disabled={false}
                  maxStars={5}
                  emptyStar={imagePath.ic_star}
                  rating={Number(productInfo?.averageRating)}
                  // selectedStar={(rating) => onStarRatingPress(rating)}
                  fullStarColor={colors.ORANGE}
                  containerStyle={{ width: width / 9 }}
                  starSize={15}
                />
              </View>
            </View>
            {!isEmpty(productInfo) && !!productInfo?.address &&
              <View>

                {(!!productInfo?.latitude && !!productInfo?.longitude) &&
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: moderateScale(20),
                      marginHorizontal: moderateScale(16),
                    }}>
                    <Image
                      source={imagePath.distance}
                      style={{ tintColor: isDarkMode ? MyDarkTheme.colors.white : colors.black }}
                    />
                    <Text
                      style={{
                        fontFamily: fontFamily?.regular,
                        fontSize: scale(14),
                        marginHorizontal: moderateScale(16),
                        color: colors.textGreyN,
                      }}>
                      <Text style={{
                        color: isDarkMode ? MyDarkTheme.colors.text : colors.black
                      }}>{Number(distance() / 1000).toFixed(2)}km</Text> away
                    </Text>
                  </View>}
              </View>
            }

            {productInfo?.variant[0]?.compare_at_price && <View
              style={{
                flexDirection: 'row',
                marginHorizontal: moderateScale(16),
                marginTop: moderateScale(20),
                width: width - moderateScale(30),
                justifyContent: "space-between"
              }}>
              <Text style={{
                fontFamily: fontFamily?.regular,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                fontSize: textScale(13)
              }}>Original Price</Text>

              <Text style={{
                fontFamily: fontFamily?.medium, color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                fontSize: textScale(12)
              }}>
                {tokenConverterPlusCurrencyNumberFormater(productInfo?.category?.category_detail?.type_id == 10 ? productInfo?.variant[0]?.compare_at_price : dayPrice, digit_after_decimal, additional_preferences, currencies?.primary_currency?.symbol) || ''}
              </Text>

            </View>}

            {(appData?.profile?.preferences?.chat_button == 1 ||
              appData?.profile?.preferences?.call_button == 1) &&
              productInfo?.vendor?.id !== userData?.vendor_id && (
                <View style={styles.view3}>
                  {appData?.profile?.preferences?.chat_button == 1 && (
                    <GradientButton
                      onPress={() => createRoom()}
                      btnText={'Chat'}
                      isImgWithTxt
                      indicator={isLoadingChat}
                      indicatorColor={themeColors?.primary_color}
                      textImgViewStyle={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                      leftImgSrc={imagePath.icChatP2p}
                      textStyle={{ ...styles.chatBtn, color: themeColors?.primary_color, }}
                      btnStyle={{ ...styles.btn1, borderColor: themeColors?.primary_color, }}
                      source={imagePath.message}
                      containerStyle={{ alignItems: 'flex-start' }}
                      colorsArray={
                        isDarkMode
                          ? [
                            MyDarkTheme?.colors?.lightDark,
                            MyDarkTheme?.colors?.lightDark,
                          ]
                          : [colors.white, colors.white]
                      }
                      leftImgStyle={{
                        tintColor: themeColors?.primary_color,
                      }}
                    />
                  )}
                  {appData?.profile?.preferences?.call_button == 1 && (
                    <GradientButton
                      btnText={'Call'}
                      isImgWithTxt
                      textImgViewStyle={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        if (!userData?.auth_token) {
                          actions.setAppSessionData('on_login');
                          return;
                        }
                        dialCall(productInfo?.vendor?.phone_no);
                      }}
                      leftImgSrc={imagePath.icCallP2p}
                      textStyle={styles.chatBtn}
                      colorsArray={[themeColors?.primary_color, themeColors?.primary_color, themeColors?.primary_color]}
                      btnStyle={styles.btn2}
                      source={imagePath.call}
                      containerStyle={{ alignItems: 'flex-start' }}
                    />
                  )}
                </View>
              )}

            {productInfo?.category?.category_detail?.type_id == 10 &&
              <View>
                <Text style={{
                  fontFamily: fontFamily?.regular,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  fontSize: textScale(14),
                  marginTop: moderateScale(20),
                  marginLeft: moderateScale(16),
                }}>Offers for a:</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: moderateScale(16),
                    marginTop: moderateScale(12),
                    justifyContent: "space-between"
                  }}>
                  <TouchableOpacity style={{
                    ...styles.priceBtn, borderWidth: getPlanType() == "day" ? 1 : 0, borderColor: themeColors?.primary_color,
                    backgroundColor: getColorCodeWithOpactiyNumber(
                      themeColors?.primary_color.substr(1),
                      10,
                    ),

                  }}>
                    <Text style={{ ...styles.priceType, fontFamily: getPlanType() == "day" ? fontFamily?.bold : fontFamily?.regular }}>Daily</Text>
                    <Text style={{ ...styles.price, color: themeColors?.primary_color, fontFamily: getPlanType() == "day" ? fontFamily?.bold : fontFamily?.medium }}>{Number(dayPrice).toFixed(2)}/Day</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={{
                    ...styles.priceBtn, borderWidth: getPlanType() == "week" ? 1 : 0, borderColor: themeColors?.primary_color,
                    backgroundColor: getColorCodeWithOpactiyNumber(
                      themeColors?.primary_color.substr(1),
                      10,
                    ),
                  }}>

                    <Text style={{ ...styles.priceType, fontFamily: getPlanType() == "week" ? fontFamily?.bold : fontFamily?.regular }}>7 Days +</Text>
                    <Text style={{ ...styles.price, color: themeColors?.primary_color, fontFamily: getPlanType() == "week" ? fontFamily?.bold : fontFamily?.medium }}> {Number(weekPrice).toFixed(2)}/Day</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{
                    ...styles.priceBtn, borderWidth: getPlanType() == "month" ? 1 : 0, borderColor: themeColors?.primary_color,
                    backgroundColor: getColorCodeWithOpactiyNumber(
                      themeColors?.primary_color.substr(1),
                      10,
                    ),

                  }}>
                    <Text style={{ ...styles.priceType, fontFamily: getPlanType() == "month" ? fontFamily?.bold : fontFamily?.regular }}>30 Days +</Text>
                    <Text style={{ ...styles.price, color: themeColors?.primary_color, fontFamily: getPlanType() == "month" ? fontFamily?.bold : fontFamily?.medium }}>{Number(monthPrice).toFixed(2)}/Day</Text>
                  </TouchableOpacity>

                </View>
              </View>}


            {productInfo?.category?.category_detail?.type_id == 10 && !paramData?.isMyPost && < TouchableOpacity
              onPress={toggleModal}
              style={{
                ...styles.dateBox, backgroundColor: getColorCodeWithOpactiyNumber(
                  themeColors?.primary_color.substr(1),
                  10,
                ),
              }}>
              <Text style={{ ...styles.dateTxt, color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyM }}>
                {!startDate ? "Select Start Date & Time" : `${moment(startDate).format("dddd DD MMMM'YY")} \n ${pickUpTime}`}

              </Text>
              <Image style={{ margin: moderateScale(6) }} source={imagePath.ic_right_arrow} />
              <Text style={{ ...styles.dateTxt, color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyM }}>
                {!endDate ? "Select End Date & Time" : `${moment(endDate).format("dddd DD MMMM'YY")} \n ${dropOffTime}`}
              </Text>
            </TouchableOpacity>}
            {productInfo?.translation[0]?.body_html && <View>
              <Text
                style={{
                  fontFamily: fontFamily?.bold,
                  marginHorizontal: moderateScale(16),
                  marginTop: moderateScale(20),
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black
                }}>
                {strings.DESCRIPTION}
              </Text>
              <View style={{
                marginHorizontal: moderateScale(16),
                marginTop: moderateScale(4)
              }}>

                <RenderHTML
                  contentWidth={width}
                  source={{
                    html: productInfo?.translation[0]?.body_html
                      ? productInfo?.translation[0]?.body_html
                      : ''
                  }}
                  tagsStyles={{
                    p: {
                      color: isDarkMode ? colors.white : colors.black,
                      textAlign: 'left',
                    },

                  }}
                />
                 {!isEmpty(productAttributeInfo) &&<FlatList
                data={productAttributeInfo}
                renderItem={renderaAttributeItems}
              />}

              </View>
            </View>}
            {!!region?.latitude &&<View
              style={{
                marginTop: moderateScaleVertical(40),
                marginHorizontal: moderateScale(12),
              }}>
              <Text
                style={{
                  fontFamily: fontFamily?.bold,
                  fontSize: textScale(14),
                  marginBottom: moderateScale(10),
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black
                }}>
                {strings.LOCATION_ON_MAP}
              </Text>
              <View
                style={{
                  height: height / 6,
                  width: width - 20,
                  alignSelf: 'center',
                }}>
                  {console.log(region?.latitude,'region?.latitude')}
                
                  <MapView
                    ref={mapRef}
                    provider={
                      Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
                    }
                    style={{
                      borderRadius: moderateScale(12),
                      ...StyleSheet.absoluteFillObject,
                    }}
                    region={region}
                    initialRegion={region}
                  >



                    <Circle
                      center={{ latitude: Number(region?.latitude), longitude: Number(region?.longitude) }}
                      radius={500}
                      // specify the fill color for the circle
                      strokeColor={themeColors?.primary_color} // specify the stroke color for the circle outline
                      strokeWidth={1} // specify the width of the circle outline
                    />


                  </MapView>


                

                <TouchableOpacity

                  onPress={focusOnLocation}
                  style={{
                    position: "absolute",
                    left: 10,
                    top: 10
                  }}>
                  <Image source={imagePath.currentLocation} />
                </TouchableOpacity>

              </View>
            </View>}
            <View style={{
              backgroundColor: colors.borderColorB,
              height: moderateScaleVertical(8),
              marginVertical: moderateScaleVertical(16)
            }} />

            <View style={{
              marginHorizontal: moderateScale(20),
              borderBottomWidth: 1,
              borderBottomColor: colors.borderColorB,
              marginBottom: moderateScaleVertical(16),
              flex: 1,
              flexDirection: "row"
            }}>
              <TouchableOpacity
                onPress={() => setIsOtherProducts(true)}
                style={{
                  borderBottomWidth: isOtherProducts ? 2 : 0,
                  borderColor: colors.black,
                  paddingBottom: moderateScaleVertical(16),
                }}>
                <Text style={{
                  fontFamily: fontFamily?.regular,
                  fontSize: textScale(16),
                  color: isOtherProducts ? colors.black : colors.blackOpacity43
                }}>{`Products (${otherProducts.length})`}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsOtherProducts(false)}
                style={{
                  paddingBottom: moderateScaleVertical(16),
                  marginLeft: moderateScale(24),
                  borderBottomWidth: isOtherProducts ? 0 : 2,
                  borderColor: colors.black,
                }}>
                <Text style={{
                  fontFamily: fontFamily?.regular,
                  fontSize: textScale(16),
                  color: isOtherProducts ? colors.blackOpacity43 : colors.black
                }}>{`Reviews (${productInfo?.product_reviews?.length})`}</Text>
              </TouchableOpacity>
            </View>
            {isOtherProducts ?
              <View style={{
                marginHorizontal: moderateScale(16),
                flexDirection: "row",
                flexWrap: "wrap",
                marginBottom: moderateScaleVertical(40),
                justifyContent: "space-between"
              }}>
                {isEmpty(otherProducts) ? <View style={{
                  width: "100%"
                }}>
                  <Text style={{
                    fontFamily: fontFamily?.regular,
                    fontSize: textScale(14),
                    textAlign: "center",
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black
                  }}>No data found!</Text>
                </View> : otherProducts?.map(renderOtherProducts)}
              </View> :
              <View>
                <FlatList
                  data={productInfo?.product_reviews || []}
                  ListFooterComponent={() => <View style={{
                    height: moderateScale(50)
                  }} />}

                  renderItem={renderReview}
                  ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.borderColor, marginVertical: moderateScaleVertical(9) }} />}
                  ListEmptyComponent={() => <View style={{
                    alignItems: "center",
                    justifyContent: "center",
                    marginVertical: moderateScaleVertical(8),

                  }}
                  >
                    <Text style={{
                      fontFamily: fontFamily?.regular,
                      fontSize: textScale(14),
                      color: isDarkMode ? MyDarkTheme.colors.text : colors.black
                    }}>No Reviews Yet !</Text>

                  </View>
                  } />
              </View>
            }
          </View>
        </ScrollView>
      )
      }

      {
        !paramData?.isMyPost
        && <View
          style={{
            position: "absolute",
            bottom: moderateScaleVertical(10),
            width: width - moderateScale(30),
            alignSelf: "center",
          }}>
          <ButtonWithLoader
            isLoading={isLoadingAddToCart}
            btnText={strings.CHECK_FINAL_PRICE}
            onPress={clearEntireCart}
            btnStyle={{
              backgroundColor: isDarkMode ? themeColors?.primary_color : themeColors?.primary_color,
              borderWidth: 0,
              borderRadius: moderateScale(4),

            }} />

        </View>
      }



      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          index={0}
          handleComponent={() => <></>}>
          {modalContent()}
        </BottomSheetModal>
      </BottomSheetModalProvider>
      <Modal isVisible={isModalVisible} style={{
        margin: 0
      }}>
        <ScrollView style={{ backgroundColor: colors.white, flex: 1, paddingTop: Platform.OS == "ios" ? StatusBarHeight : 0 }}>
          <OoryksHeader
            leftTitle={strings.DATE_AND_TIME}
            onPressLeft={() => setModalVisible(false)}
            isCustomLeftPress
            titleStyle={{
              color: colors.black
            }}
          />
          <View
            style={{
              ...styles.dateBox, backgroundColor: getColorCodeWithOpactiyNumber(
                themeColors?.primary_color.substr(1),
                10,
              ),
            }}>
            <Text style={styles.dateTxt}>
              {!startDate ? "Select Start Date & Time" : `${moment(startDate).format("dddd DD MMMM'YY")} \n ${pickUpTime}`}</Text>
            <Image source={imagePath.ic_right_arrow} style={{
              marginHorizontal: moderateScale(4)
            }} />
            <Text style={styles.dateTxt}>
              {!endDate ? "Select End Date & Time" : `${moment(endDate).format("dddd DD MMMM'YY")} \n ${dropOffTime}`}
            </Text>
          </View>
          <Calendar
            markingType={'custom'}
            markedDates={selectedDates}
            onDayPress={handleDayPress}
            maxDate={String(moment(Math.max(...Object.keys(selectedDates).map(Date.parse))).format("YYYY-MM-DD"))}
            minDate={String(moment(Math.min(...Object.keys(selectedDates).map(Date.parse))).format("YYYY-MM-DD"))} />
          <View
            style={{
              backgroundColor: colors.grey1,
              marginTop: moderateScaleVertical(43),
              marginBottom:moderateScaleVertical(height/10)
            }}>
            <View
              style={styles.sliderContainer}>
              <Text
                style={{
                  fontFamily: fontFamily?.bold,
                }}>
                {strings.PICK_UP}
              </Text>
              <MultiSlider
                min={Number(pickupvalues) > 1 ? Number(pickupvalues) : 1}
                max={24}
                step={1}
                // enabledOne={pickupvalues > 1 ? false : true}
                values={[Number(pickupvalues)]}
                sliderLength={moderateScale(250)}
                allowOverlap={false}
                onValuesChange={(val) => onTimeSlider(val, "P")}
                selectedStyle={{
                  backgroundColor: colors.greyNew1,
                }}
                unselectedStyle={{
                  backgroundColor: colors.black,
                }}
                customMarker={() => (
                  <View
                    style={styles.customMarker}>
                    <Text style={{
                      fontFamily: fontFamily?.regular,
                      fontSize: textScale(10)
                    }}>{pickUpTime}</Text>
                  </View>
                )}
              />
            </View>
            <View
              style={styles.sliderContainer}>
              <Text
                style={{
                  fontFamily: fontFamily?.bold,
                }}>
                {strings.DROP_OFF}
              </Text>
              <MultiSlider
                onValuesChange={(val) => onTimeSlider(val, "D")}
                values={Number(dropoffValues) > 1 ? [Number(dropoffValues)] : [12]}
                sliderLength={moderateScale(250)}
                min={Number(dropoffValues) > 1 ? Number(dropoffValues) : 1}
                max={24}
                step={1}
                allowOverlap={false}
                unselectedStyle={{
                  backgroundColor: colors.black,
                }}
                selectedStyle={{
                  backgroundColor: colors.greyNew1,
                }}
                customMarker={() => (
                  <View
                    style={styles.customMarker}>
                    <Text style={{
                      fontFamily: fontFamily?.regular,
                      fontSize: textScale(10)
                    }}>{dropOffTime}</Text>
                  </View>
                )}
              />
            </View>
            <GradientButton
              onPress={toggleModal}
              containerStyle={{
                marginHorizontal: moderateScale(16),
                marginTop: moderateScaleVertical(12),
              }}
              colorsArray={[themeColors?.primary_color, themeColors?.primary_color]}

              btnText={strings.CONTINUE}
            />
          </View>

        </ScrollView>
      </Modal >

      {/* <Modal isVisible={true} style={{
        margin: 0
      }}>
        <View style={{ backgroundColor: colors.white, height:100, flex: 1, paddingTop: Platform.OS == "ios" ? StatusBarHeight : 0 }}>
          
          
          
          <View
            style={{
              backgroundColor: colors.grey1,
              marginTop: moderateScaleVertical(43),
            }}>
            
                
            <GradientButton
              onPress={toggleModal}
              containerStyle={{
                width:width-30,
                marginHorizontal: moderateScale(16),
                marginTop: moderateScaleVertical(12),
              }}
              colorsArray={['#000000', '#000000']}

              btnText={strings.CONTINUE}
            />
          </View>

        </View>
      </Modal > */}


      <ImageView
        images={productAllImgs}
        imageIndex={0}
        visible={isImagesModal}
        animationType="slide"
        onImageIndexChange={(inx) => setActiveImgInx(inx)}
        onRequestClose={() => setImagesModal(false)}
        swipeToCloseEnabled={false}
        presentationStyle={"formSheet"}

        FooterComponent={() => <View>
          {productAllImgs?.length <= 10 ?
            <View style={{ flexDirection: "row", alignSelf: "center", bottom: 20, position: "absolute", flexWrap: "wrap" }}>
              {productAllImgs?.map((item, index) =>
                <TouchableOpacity onPress={() => setActiveImgInx(index)}>
                  <Text style={{
                    alignSelf: "center",
                    padding: 3,
                    fontSize: textScale(40),
                    color: activeImgInx === index ? themeColors?.primary_color : colors.white
                  }}>{"•"}</Text>
                </TouchableOpacity>
              )}
            </View>
            : <View>
              <Text style={{
                alignSelf: "center",

                fontSize: textScale(16),
                color: colors.white,
                marginBottom: moderateScaleVertical(20)
              }}>{activeImgInx + 1} / {productAllImgs?.length}</Text>
            </View>
          }
        </View>

        }
      />

      {isKycErrorModal && <View>
        <Modal isVisible={isKycErrorModal} >
          <View style={{ height: height / 3, borderRadius: 10, padding: 16, backgroundColor: colors.white }} >
            <Text style={{ alignSelf: 'center', marginBottom: 10, lineHeight: 18, fontFamily: fontFamily.bold, }} >Error </Text>
            <Text style={{ textAlign: 'center', lineHeight: 18, fontFamily: fontFamily.medium, }} >{`You are almost there! But first, please go to Account->Emirate to provide Emirates ID verification.
              Once approved, you can then start with your first booking.`}</Text>

            <GradientButton
              containerStyle={{ width: width - 60, marginTop: 45, alignSelf: 'center' }}
              btnText={'Ok'}
              onPress={() => setIsKycErrorModal(false)}
            />
          </View>

        </Modal>
      </View>}

    </View >
    </WrapperContainer>
  );
};

export function stylesFunc({ fontFamily }) {
  const styles = StyleSheet.create({
    headerStyle: {
      // padding: moderateScaleVertical(16),
      paddingHorizontal: moderateScale(16),
      height: StatusBarHeight,
    },

    textStyle: {
      color: colors.black2Color,
      fontSize: textScale(16),
      lineHeight: textScale(28),
      textAlign: 'center',
      fontFamily: fontFamily?.medium,
    },
  });
  return styles;
}

export default P2pProductDetail;
