//import liraries
import {isEmpty} from 'lodash';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import * as Animatable from 'react-native-animatable';
import Modal from 'react-native-modal';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from 'react-native-popup-menu';
import StarRating from 'react-native-star-rating';
import { useSelector } from 'react-redux';
import GradientCartView from '../../../Components/GradientCartView';
import Header from '../../../Components/Header';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import {tokenConverterPlusCurrencyNumberFormater} from '../../../utils/commonFunction';
import {
  getCurrentLocation,
  hapticEffects,
  showError,
  showSuccess,
} from '../../../utils/helperFunctions';
import {getColorSchema, removeItem} from '../../../utils/utils';
import stylesFunc from './styles';
import {MyDarkTheme} from '../../../styles/theme';
import AddressModal3 from '../../../Components/AddressModal3';
import ChooseAddressModal from '../../../Components/ChooseAddressModal';
import DatePicker from 'react-native-date-picker';
import GradientButton from '../../../Components/GradientButton';
import moment from 'moment';
import {hitSlopProp} from '../../../styles/commonStyles';
import ButtonComponent from '../../../Components/ButtonComponent';
import MapView, {Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE} from 'react-native-maps';
import { getAllTravelDetails } from '../../../utils/googlePlaceApi';
import { chekLocationPermission } from '../../../utils/permissions';

// create a component
const AvailableTechnicians = ({navigation, route}) => {
  // navigation.navigate(navigationStrings.ORDER_DETAIL);
  const {data} = route.params;
  const paramData = route?.params?.data;
  console.log('paramData =>=>', data);
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };
  const darkthemeusingDevice = getColorSchema();
  const {
    appData,
    themeColors,
    themeLayouts,
    currencies,
    languages,
    themeColor,
    themeToggle,
    redirectedFrom,
    appStyle,
  } = useSelector(state => state?.initBoot || {});
  const {dineInType, location} = useSelector(state => state?.home || {});
  const CartItems = useSelector(state => state?.cart?.cartItemCount || {});
  const {userData} = useSelector(state => state?.auth);
  const {reloadData} = useSelector(state => state?.reloadData);
  const {additional_preferences, digit_after_decimal} =
    appData?.profile?.preferences;
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const styles = stylesFunc({themeColors, isDarkMode});
  const selectedAddressData = useSelector(
    state => state?.cart?.selectedAddress,
  );
  const [state, setState] = useState({
    isLoadingC: true,
    availablePersonData: [],
    menuOpened: false,
    menuSortOption: ['By Price', 'By Rating'],
    selectedSortOption: '',
    pageNo: 1,
    focused: false,
    selectedService: {},
    selectedVariant: {},
    openDateTimePicker: false,
    serviceDateTime: '',
    serviceTimeSlot: {},
    isVisibleAddressModal: false,
    selectViaMap: false,
    isVisible: false,
    timeSlots: [
      '08:00 - 10:00',
      '10:01 - 12:00',
      '12:01 - 14:00',
      '14:01 - 16:00',
      '16:01 - 18:00',
      '18:01 - 20:00',
      '18:40 - 20:42',
    ],
    menuOpened: false,
    OrderOptionsType: 2,
    OrderOptionsTypeSelected: true,
    isBookingTypeMenu: false,
    selectedBookingType: {
      id: 1,
      name: 'Book Now',
    },
    bookingTypes: [
      {
        id: 1,
        name: 'Book Now',
      },
      {
        id: 2,
        name: 'Schedule',
      },
    ],
    bookingtypemodal: false,
    profilemodal: false,
    selectedtechnician: {},
    mycuurentloc:{}
  });
  const {
    isLoadingC,
    availablePersonData,
    menuOpened,
    menuSortOption,
    selectedSortOption,
    bookingtypemodal,
    pageNo,
    focused,
    selectedService,
    selectedVariant,
    openDateTimePicker,
    serviceDateTime,
    isVisibleAddressModal,
    selectViaMap,
    isVisible,
    serviceTimeSlot,
    timeSlots,
    OrderOptionsTypeSelected,
    OrderOptionsType,
    isBookingTypeMenu,
    selectedBookingType,
    bookingTypes,
    profilemodal,
    selectedtechnician,
    mycuurentloc
  } = state;
  const [productListId, setProductListId] = useState(data);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productListData, setProductListData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [type, setType] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(
    selectedAddressData ? selectedAddressData : null,
  );
  const [pageNoV, setPageNoV] = useState(1);
  const [isLoadMore, setLoadMore] = useState(false);
  const updateState = data => {
    setState(state => ({...state, ...data}));
  };

  const errorMethod = error => {
    console.log('checking error', error);
    updateState({isLoadingC: false, profilemodal: false});
    showError(error?.message || error?.error);
  };
  const getExpDays = date => {
    return moment(new Date()).diff(moment(date), 'days');
  };
  const getExpMonth = date => {
    return moment(new Date()).diff(moment(date), 'months');
  };
  const getExpYear = date => {
    return moment(new Date()).diff(moment(date), 'years');
  };
  const getAllProductsByVendor = (pageNo = 1) => {
    let vendorId = data?.id;

    let apiData = `/${vendorId}?page=${pageNo}&type=${dineInType}&limit=10`;

    if (!!data?.categoryExist) {
      apiData = apiData + `&category_id=${data?.categoryExist}`;
    }
    actions
      .getProductByVendorIdOptamizeV2(
        apiData,
        {},
        {
          code: appData.profile.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          latitude: location?.latitude,
          longitude: location?.longitude,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then(async res => {
        console.log('get all products by vendor res', res?.data);
        if (!isEmpty(res?.data?.products?.data)) {
          const newProductData = res?.data?.products?.data?.map(v => ({
            ...v,
            qtyText: 1,
          }));
          const newProductListDataWithQty =
            pageNo == 1
              ? newProductData
              : [...productListData, ...newProductData];
          setProductListData(newProductListDataWithQty);
        }

        setLoadMore(
          res?.data?.products?.current_page < res?.data?.products?.last_page ||
            !isEmpty(res?.data?.products?.data),
        );
        setLoading(false);
      })
      .catch(errorMethod);
  };
  const checkOptionsType = type => {
    if (type == 1) {
      updateState({
        OrderOptionsTypeSelected: true,
        OrderOptionsType: type,
      });
    } else if (type == 2) {
      OrderOptionsTypeSelected && OrderOptionsType == type
        ? updateState({
            OrderOptionsTypeSelected: true,
            OrderOptionsType: 1,
          })
        : updateState({
            OrderOptionsTypeSelected: true,
            OrderOptionsType: type,
          });
    }
  };

  useEffect(() => {
    chekLocationPermission(false)
      .then((result) => {
        if (result !== 'goback') {
          getCurrentLocation()
            .then((res) => {
              console.log(res,'testress')
              updateState({
                mycuurentloc: res,
              });
            })
            .catch((err) => {
              console.log('error raised', location);
              // console.log("default location",location)
            });
        }
      })
      .catch((error) => console.log('error while accessing location', error));
  }, []);


  const getAllProductsByCategoryId = () => {
    actions
      .getProductByCategoryIdOptamize(
        `/${productListId?.id}?page=${pageNo}&product_list=${
          data?.rootProducts ? true : false
        }&type=${dineInType} `,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then(res => {
        console.log(res, '<===res getProductByCategoryIdOptamize');
        if (!!res?.data) {
          setCategoryInfo(categoryInfo ? categoryInfo : res.data.category);
          const newProductData = res.data.listData.data.map(v => ({
            ...v,
            qtyText: 1,
          }));
          const newProductListDataWithQty =
            pageNo == 1 ? newProductData : [...productListData, newProductData];

          setProductListData(newProductListDataWithQty);

          if (
            pageNo == 1 &&
            res?.data?.listData?.data.length == 0 &&
            res?.data?.category &&
            res?.data?.category?.childs.length
          ) {
            setSelectedCategory(res.data.category.childs[0]);
            setProductListId(res.data.category.childs[0]);
            updateState({
              pageNo: 1,
            });
          }
        }
        setLoading(false);
      })

      .catch(errorMethod);
  };
  const getalltechnician = selecteditem => {
    var item;
    if (!!selecteditem) {
      item = {
        variant_id: selecteditem?.variant[0].id,
        address_id: selecteditem?.id,
        sku: selecteditem?.variant[0]?.sku,
        qty: selecteditem?.qtyText||1,
        booking_option: selectedBookingType?.id,
        slot:
          selectedBookingType?.id == 2
            ? serviceTimeSlot?.value
            : serviceTimeSlot?.value,
        bookingdateTime:
          selectedBookingType?.id == 2
            ? moment(serviceDateTime).format('YYYY-MM-DD')
            : moment(new Date()).format('YYYY-MM-DD HH:mm'),
      };
    } else {
      item = {
        variant_id: selectedService?.variant[0].id,
        address_id: selectedAddress?.id,
        sku: selectedService?.variant[0]?.sku,
        qty:selectedService?.qtyText||1,
        booking_option: selectedBookingType?.id,
        slot:
          selectedBookingType?.id == 2
            ? serviceTimeSlot?.value
            : serviceTimeSlot?.value,
        bookingdateTime:
          selectedBookingType?.id == 2
            ? moment(serviceDateTime).format('YYYY-MM-DD')
            : moment(new Date()).format('YYYY-MM-DD HH:mm'),
      };
    }
    actions
      .sendProductBookingData(item, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then(res => {
        if (!!res?.data) {
          console.log(res, '<===res sendProductBookingData');
          if (isEmpty(selectedSortOption)) {
            updateState({
              availablePersonData: res?.data,
              isLoadingC: false,
            });
            



          } else {
            if (selectedSortOption === 'By Price') {
              const priceSort = res?.data.sort((a, b) =>
                Number(a?.product_prices[0]?.price)
                  .toFixed(2)
                  .localeCompare(
                    Number(b?.product_prices[0]?.price).toFixed(2),
                  ),
              );
              console.log('priceSort', priceSort);
              updateState({
                availablePersonData: priceSort,
                isLoadingC: false,
              });
            } else {
              const ratingSort = res?.data.sort((a, b) =>
                Number(a?.rating).toFixed(2).localeCompare(Number(b?.rating)),
              );
              console.log('ratingSort', ratingSort);
              updateState({
                availablePersonData: ratingSort,
                isLoadingC: false,
              });
            }
          }
        }
      })
      .catch(errorMethod);
  };
  useEffect(() => {}, [selectedSortOption]);

  const itemSeparator = () => {
    return <View style={{marginTop: moderateScaleVertical(10)}} />;
  };
  const ListFooterComponent = () => {
    return <View style={{marginBottom: moderateScaleVertical(100)}} />;
  };

  const addToCart = data => {
    if (
      !isEmpty(CartItems?.data) &&
      !isEmpty(CartItems?.data?.products) &&
      CartItems?.data?.products[0].dispatch_agent_id !== data?.id
    ) {
      updateState({profilemodal: false});
      showError(strings.SELECT_SAME_PROVIDER_SERVICE);
      return;
    }
    if (!selectedAddress || isEmpty(selectedAddress)) {
      updateState({profilemodal: false});
      showError(strings.PLEASE_SELECT_ADDRESS);
      return;
    }
    updateState({
      isLoadingC: true,
      profilemodal: false,
    });
    let cartData = {};
    cartData['sku'] = selectedService?.variant[0]?.sku;
    cartData['quantity'] = selectedService?.qtyText;
    cartData['product_variant_id'] =
      selectedService?.variant[0].id || data?.productData?.product_variant_id;
    cartData['type'] = dineInType;
    cartData['dispatcherAgentData'] = {
      ['agent_price']: data?.product_prices[0]?.price,
      ['agent_id']: data?.id,
      ['address_id']: selectedAddress?.address_id,
      ['slot']: serviceTimeSlot?.value,
      ['onDemandBookingdate']:
        selectedBookingType?.id == 2
          ? moment(serviceDateTime).format('YYYY-MM-DD')
          : moment(new Date()).format('YYYY-MM-DD HH:mm'),
    };
    if (!!paramData?.productData?.addon_ids) {
      cartData['addon_ids'] = paramData?.productData?.addon_ids || '';
    }
    if (!!paramData?.productData?.addon_options) {
      cartData['addon_options'] = paramData?.productData?.addon_options || '';
    }

    console.log(cartData, 'cartdatatatatatt');
    actions
      .addProductsToCart(cartData, {
        code: appData.profile.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then(res => {
        console.log(res, '<===res addProductsToCart>');
        actions.cartItemQty(res);
        showSuccess(strings.ADDED_CART);
        updateState({cartId: res.data.id, isLoadingC: false});
        moveToNewScreen(navigationStrings.CART)();
      })
      .catch(errorMethod);
  };

  const onProfilePress = driverStatus => {
    moveToNewScreen(navigationStrings.TECHNICIAN_PROFILE, {
      driverData: driverStatus,
    })();
  };
  //screen merge with freelancer service

  const getDriverTimeSlots = date => {
    actions
      .getDriverSlots(
        `?date=${moment(date).format('YYYY-MM-DD')}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then(res => {
        console.log(res, '<===res getDriverSlots');
        if (!!res?.Slots) {
          updateState({timeSlots: res?.Slots});
        }
        setLoading(false);
      })
      .catch(errorMethod);
  };
  const onChangeDateTime = date => {
    console.log('onChangeDateTime => ', date, moment(date, 'HH:mm'));
    const sameDateTrue = moment().isSame(date, 'day');
    updateState({
      serviceDateTime: date,
      openDateTimePicker: false,

      serviceTimeSlot: {},
    });
    getDriverTimeSlots(date);
  };
  const checkDatIsSelected = () => {
    if (!serviceDateTime) {
      updateState({menuOpened: false});
      return showError(strings.SELECT_SERVICE_DATE);
    }
    updateState({menuOpened: !menuOpened});
  };
  const _chooseDay = () => {
    updateState({openDateTimePicker: !openDateTimePicker});
  };

  const addUpdateLocation = childData => {
    updateState({isLoading: true});
    actions

      .addAddress(childData, {
        code: appData?.profile?.code,
      })
      .then(res => {
        updateState({
          isVisibleAddressModal: false,
          selectViaMap: false,
          isVisible: false,
        });
        getAllAddress();
        setTimeout(() => {
          let address = res.data;
          address['is_primary'] = 1;
          setSelectedAddress(address);
          actions.saveAddress(address);
        });
        showSuccess(res.message);
      })
      .catch(error => {
        updateState({
          isVisibleAddressModal: false,
          isVisible: false,
        });
        showError(error?.message || error?.error);
      });
  };

  const setAppSessionRedirection = () => {
    updateState({isVisible: false, bookingtypemodal: false});

    setTimeout(() => {
      actions.setAppSessionData('on_login');
    }, 1000);
  };
  const setModalVisibleForAddessModal = (visible, type, id, data) => {
    updateState({selectViaMap: false});
    if (!!userData?.auth_token) {
      updateState({isVisible: false});
      setTimeout(() => {
        setType(type);
        updateState({
          updateData: data,
          isVisibleAddressModal: visible,
          selectedId: id,
        });
      }, 1000);
    } else {
      setAppSessionRedirection();
    }
  };
  const selectAddress = address => {
    if (!!userData?.auth_token) {
      let data = {};
      let query = `/${address?.id}`;
      actions
        .setPrimaryAddress(query, data, {
          code: appData?.profile?.code,
        })
        .then(res => {
          console.log(res, '<===res setPrimaryAddress');
          actions.saveAddress(address);
          setSelectedAddress(address);
          updateState({
            isVisible: false,
          });
        })
        .catch(errorMethod);
    }
  };
  useEffect(() => {
    if (!data?.is_product) {
      if (!!data?.isVendorList) {
        getAllProductsByVendor();
      } else {
        getAllProductsByCategoryId();
      }
    } else {
      getProductDetailById();
    }
  }, [
    navigation,
    languages,
    currencies,
    reloadData,
    productListId,
    selectedSortOption,
  ]);

  const getProductDetailById = async () => {
    await actions
      .getProductDetailByProductId(
        `/${data.product?.id}`,
        {},
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
        },
      )
      .then(res => {
        setLoading(false);
        updateState({
          selectedService: {...res?.data?.products, qtyText: 1},
        });
        console.log(res, 'testttttt');
        if (!!res?.data) {
          getalltechnician(res?.data?.products);
        }
      })
      .catch(errorMethod);
  };

  const getAllAddress = () => {
    if (!!userData?.auth_token) {
      actions
        .getAddress(
          {},
          {
            code: appData?.profile?.code,
          },
        )
        .then(res => {
          if (res.data) {
            actions.saveAllUserAddress(res.data);
          }
        })
        .catch(errorMethod);
    }
  };
  const checkIsCustomize = useCallback(
    (item, index, type) => {
      // increment
      if (type == 1) {
        const incVal = ++item.qtyText;
        console.log('incVal =>', incVal);
        console.log('item =>', item);
        const newProductListDataWithQty = [...productListData];
        newProductListDataWithQty.map(element => {
          element.id === item.id ? {...item} : element;
        });
        setProductListData(newProductListDataWithQty);
      }

      //decrement
      if (type == 2) {
        if (item.qtyText == 1) {
          return showError(strings.ACCEPTING_ORDER_MSG);
        }
        const incVal = --item.qtyText;
        console.log('incVal =>', incVal);
        console.log('item =>', item);
        const newProductListDataWithQty = [...productListData];
        newProductListDataWithQty.map((element, index) => {
          element.id === item.id ? {...item} : element;
        });
        setProductListData(newProductListDataWithQty);
      }
    },
    [productListData],
  );
  const mapRef = useRef();
  const renderChooseService = useCallback(
    ({item, index}) => {
      return (
        <ServicesCard
          data={item}
          focused={focused}
          selectedService={selectedService}
          selectedVariant={selectedVariant}
          selectedType={selectedVariant}
          setCheckBoxData={setCheckBoxData}
          onSelect={val => updateState({selectedVariant: val})}
          onIncrement={() => checkIsCustomize(item, index, 1)}
          onDecrement={() => checkIsCustomize(item, index, 2)}
        />
      );
    },
    [productListData, focused, setCheckBoxData],
  );

  const setCheckBoxData = data => {
    const {id} = data;
    if (selectedService.id === id) {
      updateState({
        focused: false,
        selectedService: {},
        selectedType: {},
        selectedVariant: {},
      });
    } else {
      updateState({
        focused: true,
        selectedService: data,
      });
    }
  };

  const onEndReached = () => {
    if (isLoadMore) {
      setPageNoV(pageNoV + 1);
      getAllProductsByVendor(pageNoV + 1);
    }
  };

  useEffect(()=>{
    getDistance(selectedtechnician)
  },[profilemodal])

    const getDistance= async(item)=>{
    const distance =await getAllTravelDetails({currlat:mycuurentloc?.latitude,
      currlong:mycuurentloc?.longitude,
      agentlat:item?.agentlog?.lat,
      agentlong:item?.agentlog?.long,
    })
    let agentdata={...item}
    agentdata={...item,distance:distance?.rows[0]?.elements[0]?.distance?.text}
    updateState({selectedtechnician:agentdata}) 
    }
  const listEmptyComponent = () => (
    <View>
      <FastImage
        source={imagePath.noDataFound}
        resizeMode="contain"
        style={{
          width: moderateScale(140),
          height: moderateScale(140),
          alignSelf: 'center',
          marginTop: moderateScaleVertical(30),
        }}
      />
      <Text
        style={{
          textAlign: 'center',
          fontSize: textScale(11),
          fontFamily: fontFamily.regular,
          marginHorizontal: moderateScale(10),
          lineHeight: moderateScale(20),
          marginTop: moderateScale(5),
        }}>
        {strings.NO_SERVICE_FOUND}
      </Text>
    </View>
  );

  const sendProductVariantData = () => {
    if (!isEmpty(selectedService?.check_if_in_cart_app)) {
      showError('The service is already added in cart.');
      return;
    }
    if (isEmpty(selectedService)) {
      return showError("Service and it's Variant should not be empty");
    }
    if (selectedBookingType?.id == 2) {
      if (!serviceDateTime || isEmpty(serviceTimeSlot)) {
        return showError('Service Date and Time should not be empty');
      }
    }
    if (isEmpty(selectedAddress)) {
      return showError('Service Address should not be empty');
    }
    let item = {
      variant_id: selectedService?.variant[0].id,
      address_id: selectedAddress?.id,
      sku: selectedService?.variant[0]?.sku,
      qty: selectedService?.qtyText||1,
      booking_option: selectedBookingType?.id,
      slot:
        selectedBookingType?.id == 2
          ? serviceTimeSlot?.value
          : serviceTimeSlot?.value,
      bookingdateTime:
        selectedBookingType?.id == 2
          ? moment(serviceDateTime).format('YYYY-MM-DD')
          : moment(new Date()).format('YYYY-MM-DD HH:mm'),
    };
    updateState({bookingtypemodal: false});
    getalltechnician();
  };
  const openCloseMapAddress = type => {
    updateState({selectViaMap: type == 1 ? true : false});
  };

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          elevation: 10,
          marginTop: moderateScaleVertical(16),
          marginHorizontal: moderateScale(4),
          shadowColor: colors.blackOpacity30,
          shadowOpacity: moderateScale(0.5),
          borderColor:colors.borderColor,
          borderWidth:1
        }}>
        <TouchableOpacity
          style={{...styles.renderView, width: '100%'}}
          onPress={() =>
            updateState({profilemodal: true, selectedtechnician: item})
          }>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 1,
              alignItems: 'center',
            }}>
            <View style={{flex: 0.2}}>
              <Image style={styles.imgStyle} source={{uri: item.image_url}} />
            </View>
            <View style={{flex: 0.5}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.nameStyle}>{item.name}</Text>
                {!!item.complete_order_count&&<Text
                  style={
                    styles.jobPercentage
                  }>{` (${item.complete_order_count})`}</Text>}
              </View>
              <View
                style={{width: width / 8, marginTop: moderateScaleVertical(4)}}>
                {!!Number(item?.rating)&&<StarRating
                  maxStars={5}
                  rating={Number(item?.rating)}
                  fullStarColor={colors.ORANGE}
                  starSize={10}
                />}
              </View>
            </View>
            <View style={{flex: 0.3, alignItems: 'flex-end'}}>
              <Text style={styles.priceStyle}>
                {currencies?.primary_currency?.symbol}
                {Number(item?.product_prices[0]?.price).toFixed(2)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={{
            height: moderateScaleVertical(100),
            backgroundColor: colors.white,
            justifyContent: 'center',
            borderRadius: moderateScale(4),
            width: '5%',
          }}
          onPress={() => onProfilePress(item)}>
          <Image
            style={{...styles.imageStyle2}}
            resizeMode="contain"
            source={imagePath.ic_right_arrow}
          />
        </TouchableOpacity> */}
      </View>
    );
  };

  const playHapticEffect = (effect = 'clockTick') => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: true,
    };

    ReactNativeHapticFeedback.trigger(effect, options);
  };

  const bottomButtonClick = () => {
    removeItem('selectedTable');
    setTimeout(() => {
      clearEntireCart();
    }, 1000);
  };

  const clearEntireCart = () => {
    actions
      .clearCart(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then(res => {
        actions.cartItemQty({});
        console.log(res, '<==res clearCart');
        updateState({
          isLoadingB: false,
        });
        showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  const onClickSort = () => {
    updateState({menuOpened: !menuOpened});
  };

  return (
    <WrapperContainer
      isLoading={isLoadingC}
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}>
      <Header centerTitle={strings.AVAILABLE_TECHNICIANS} />
      <View
        style={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
          flex: 1,
        }}>
        <View style={styles.container}>
          <View style={styles.addressview}>
            <View style={{flex: 1}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: moderateScaleVertical(6),
                }}>
                <Text style={styles.addressheading}>Type : </Text>
                <Text
                  style={{
                    width: width / 1.6,
                    fontFamily: fontFamily.semiBold,
                    fontSize: textScale(11),
                  }}>
                  {!isEmpty(selectedBookingType)
                    ? selectedBookingType?.name
                    : 'Select booking type'}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.addressheading}>{strings.ADDRESS} : </Text>
                <Text
                  style={{
                    width: width / 1.8,
                    fontFamily: fontFamily.semiBold,
                    fontSize: textScale(11),
                  }}>
                  {selectedAddress?.address
                    ? selectedAddress?.address
                    : 'Select Address'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => updateState({bookingtypemodal: true})}>
              <Image source={imagePath.editPencilIcon} />
            </TouchableOpacity>
            <View></View>
          </View>
          <View style={styles.textView}>
            <View style={{flex: 0.8}}>
              <Text style={styles.timeServiceStyle}>{strings.TECHNICIAN}</Text>
            </View>

            <View style={{flex: 0.4}}>
              <Menu
                style={{alignSelf: 'center'}}
                opened={menuOpened}
                onBackdropPress={onClickSort}>
                <MenuTrigger onPress={onClickSort}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{...styles.pickerView, width: 80}}>
                      <Text
                        style={{
                          ...styles.textStyleTime,
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.black,
                        }}>
                        {selectedSortOption ? selectedSortOption : strings.SORT}
                      </Text>
                      <Image
                        style={[styles.imageStyle]}
                        resizeMode="contain"
                        source={imagePath.newsort}
                      />
                    </View>
                    {!isEmpty(selectedSortOption) && (
                      <TouchableOpacity
                        onPress={() => updateState({selectedSortOption: ''})}>
                        <Image
                          style={{
                            ...styles.imageStyle2,
                            marginLeft: moderateScale(6),
                          }}
                          resizeMode="contain"
                          source={imagePath.cross}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </MenuTrigger>
                <MenuOptions
                  customStyles={{
                    optionsContainer: {
                      marginTop: moderateScaleVertical(36),
                      width: moderateScale(80),
                      height: moderateScale(80),
                    },
                    optionsWrapper: {
                      width: moderateScale(80),
                      height: moderateScale(80),
                    },
                  }}>
                  <ScrollView>
                    {menuSortOption.map((item, index) => {
                      return (
                        <View key={index}>
                          <MenuOption
                            onSelect={() =>
                              updateState({
                                selectedSortOption: item,
                                menuOpened: !menuOpened,
                              })
                            }
                            key={String(index)}
                            text={item}
                            style={{
                              marginVertical: moderateScaleVertical(5),
                              backgroundColor:
                                selectedSortOption === item
                                  ? colors.greyColor
                                  : colors.whiteOpacity15,
                            }}
                            customStyles={{
                              optionText: {textAlign: 'center'},
                            }}
                          />
                          <View style={styles.borderOption} />
                        </View>
                      );
                    })}
                  </ScrollView>
                </MenuOptions>
              </Menu>
            </View>
          </View>
          <View style={{marginTop: moderateScaleVertical(28)}}>
            <FlatList
              keyExtractor={(item, index) => String(index)}
              showsVerticalScrollIndicator={false}
              data={availablePersonData}
              renderItem={renderItem}
              // ItemSeparatorComponent={itemSeparator}
              ListFooterComponent={ListFooterComponent}
              ListEmptyComponent={() => (
                <View>
                  <FastImage
                    source={imagePath.noDataFound}
                    resizeMode="contain"
                    style={{
                      width: moderateScale(140),
                      height: moderateScale(140),
                      alignSelf: 'center',
                      marginTop: moderateScaleVertical(30),
                    }}
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: textScale(11),
                      fontFamily: fontFamily.regular,
                      marginHorizontal: moderateScale(10),
                      lineHeight: moderateScale(20),
                      marginTop: moderateScale(5),
                    }}>
                    {`No Technician Found`}
                  </Text>
                </View>
              )}
            />
          </View>
        </View>

        {/* <GradientCartView
          onPress={() => {
            playHapticEffect(hapticEffects.notificationSuccess);
            moveToNewScreen(navigationStrings.CART)();
          }}
          btnText={
            CartItems && CartItems.data && CartItems.data.item_count
              ? `${CartItems.data.item_count} ${
                  CartItems.data.item_count == 1 ? strings.ITEM : strings.ITEMS
                } | ${tokenConverterPlusCurrencyNumberFormater(
                  Number(CartItems?.data?.gross_paybale_amount),
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol,
                )}`
              : ''
          }
          ifCartShow={
            CartItems && CartItems.data && CartItems.data.item_count > 0
              ? true
              : false
          }
          btnStyle={{position: 'absolute'}}
        /> */}
      </View>

      <Modal
        visible={bookingtypemodal}
        animationType={'slide'}
        transparent={false}>
        <WrapperContainer
          isLoading={isLoading}
          bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}>
          <Header
            noLeftIcon={true}
            customRight={() => (
              <TouchableOpacity
                onPress={() => updateState({bookingtypemodal: false})}>
                <Image source={imagePath.cross} />
              </TouchableOpacity>
            )}
          />
          <MenuProvider>
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}>
              {!!categoryInfo && categoryInfo?.childs?.length > 0 && (
                <View style={{marginHorizontal: moderateScale(20)}}>
                  <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    style={{
                      marginTop: moderateScaleVertical(5),
                    }}>
                    {categoryInfo?.childs?.map((item, inx) => {
                      return (
                        <View key={inx}>
                          <TouchableOpacity
                            style={{
                              padding: moderateScale(10),
                              // backgroundColor: colors.lightGreyBg,
                              marginRight: moderateScale(10),
                              borderRadius: moderateScale(12),
                              backgroundColor:
                                selectedCategory &&
                                selectedCategory?.id == item?.id
                                  ? themeColors.primary_color
                                  : colors.lightGreyBg,
                            }}
                            onPress={() => onPressChildCards(item)}>
                            <Text
                              style={{
                                color:
                                  selectedCategory &&
                                  selectedCategory?.id == item?.id
                                    ? colors.white
                                    : colors.black,
                                opacity:
                                  selectedCategory &&
                                  selectedCategory?.id == item?.id
                                    ? 1
                                    : 0.61,
                                fontSize: textScale(12),
                                fontFamily: fontFamily.medium,
                              }}>
                              {item?.translation[0]?.name}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
              <View
                style={{
                  height: data?.is_product
                    ? moderateScaleVertical(80)
                    : height / 2,
                  justifyContent: 'center',
                }}>
                {data?.is_product ? (
                  <View
                    style={{
                      paddingHorizontal: moderateScale(24),
                    }}>
                    <View
                      style={{
                        height: moderateScaleVertical(52),
                        backgroundColor: colors.backgroundGrey,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: moderateScale(12),
                        borderRadius: moderateScale(4),
                      }}>
                      <TouchableOpacity
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                          style={{
                            height: moderateScaleVertical(18),
                            width: moderateScale(18),
                          }}
                          source={imagePath.icCheck1}
                        />
                        <Text
                          numberOfLines={4}
                          style={{
                            fontSize: textScale(12),
                            padding: moderateScale(10),
                            fontFamily: fontFamily.medium,
                            color: colors.black,
                          }}>
                          {data?.product?.title ||
                            data?.product?.translation_title ||
                            data?.product?.translation[0].title}
                        </Text>
                      </TouchableOpacity>

                      <View
                        style={{
                          borderWidth: 1,
                          borderRadius: moderateScale(8),
                          borderColor: themeColors.primary_color,
                          paddingVertical: 0,
                          height: moderateScale(36),
                          alignItems: 'center',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingHorizontal: moderateScale(12),
                          alignSelf: 'center',
                          backgroundColor: isDarkMode
                            ? themeColors.primary_color
                            : colors.greyColor2,
                        }}>
                        <TouchableOpacity
                          // disabled={selectedItemID == data?.id}
                          onPress={() =>
                            checkIsCustomize(selectedService, 0, 2)
                          }
                          activeOpacity={0.8}
                          hitSlop={hitSlopProp}>
                          <Image
                            style={{
                              tintColor: isDarkMode
                                ? colors.white
                                : themeColors.primary_color,
                            }}
                            source={imagePath.icMinus2}
                          />
                        </TouchableOpacity>

                        <Animatable.View>
                          <Animatable.View style={{overflow: 'hidden'}}>
                            <Animatable.Text
                              duration={200}
                              numberOfLines={2}
                              style={{
                                fontFamily: fontFamily.medium,
                                fontSize: moderateScale(14),
                                color: isDarkMode
                                  ? colors.white
                                  : themeColors.primary_color,
                                marginHorizontal: moderateScale(8),
                              }}>
                              {selectedService?.qtyText}
                            </Animatable.Text>
                          </Animatable.View>
                        </Animatable.View>

                        <TouchableOpacity
                          // disabled={selectedItemID == data?.id}
                          activeOpacity={0.8}
                          hitSlop={hitSlopProp}
                          onPress={() =>
                            checkIsCustomize(selectedService, 0, 1)
                          }>
                          <Image
                            style={{
                              tintColor: isDarkMode
                                ? colors.white
                                : themeColors.primary_color,
                            }}
                            source={imagePath.icAdd4}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ) : (
                  <FlatList
                    nestedScrollEnabled
                    data={productListData || []}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderChooseService}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.5}
                    ListHeaderComponent={() => {
                      return (
                        <View style={styles.mainView}>
                          <Text
                            style={{
                              color: isDarkMode
                                ? MyDarkTheme.colors.text
                                : colors.black,
                            }}>
                            {strings.CHOOSE_SERVICES}
                          </Text>
                        </View>
                      );
                    }}
                    ListEmptyComponent={listEmptyComponent}
                    ListFooterComponent={() => (
                      <View>
                        {isLoadMore ? (
                          <Text
                            style={{
                              textAlign: 'center',
                            }}>
                            Loading...
                          </Text>
                        ) : (
                          <></>
                        )}
                      </View>
                    )}
                  />
                )}
              </View>

              <View style={styles.datePickerView}>
                <View>
                  <View style={styles.timeView}>
                    <Text>{'BOOKING TYPE'}</Text>
                  </View>
                  <View
                    style={{
                      ...styles.timePickerView,
                      marginTop: 0,
                      marginBottom: moderateScaleVertical(30),
                    }}>
                    <Text style={[styles.textStyleTime]}>{'Type'}:</Text>
                    <Menu
                      style={{alignSelf: 'center'}}
                      opened={isBookingTypeMenu}
                      onBackdropPress={() =>
                        updateState({
                          isBookingTypeMenu: !isBookingTypeMenu,
                        })
                      }>
                      <MenuTrigger
                        onPress={() => {
                          updateState({
                            isBookingTypeMenu: !isBookingTypeMenu,
                          });
                        }}>
                        <View style={styles.pickerView}>
                          <Text
                            style={[
                              styles.textStyleTime,
                              {width: moderateScale(140)},
                            ]}>
                            {!isEmpty(selectedBookingType)
                              ? selectedBookingType?.name
                              : 'Select booking type'}
                          </Text>
                          <Image
                            style={[styles.imageStyle]}
                            resizeMode="contain"
                            source={imagePath.icDropdown}
                          />
                        </View>
                      </MenuTrigger>
                      <MenuOptions
                        customStyles={{
                          optionsContainer: {
                            marginTop: moderateScaleVertical(36),
                            width: moderateScale(180),
                            height: moderateScale(100),
                          },
                          optionsWrapper: {
                            width: moderateScale(180),
                            height: moderateScale(100),
                          },
                        }}>
                        <ScrollView>
                          {bookingTypes.map((item, index) => {
                            // const time_12_1 = moment(item.split('-', 2)[0], 'HH:mm').format('hh:mm a')
                            // const time_12_2 = moment(item.split('-', 2)[1], 'HH:mm').format('hh:mm a')
                            return (
                              <View key={index}>
                                <MenuOption
                                  onSelect={() =>
                                    updateState({
                                      selectedBookingType: item,
                                      isBookingTypeMenu: !isBookingTypeMenu,
                                    })
                                  }
                                  key={String(index)}
                                  // text={`${time_12_1} - ${time_12_2}`}
                                  text={item.name}
                                  style={{
                                    marginVertical: moderateScaleVertical(5),
                                    backgroundColor:
                                      selectedBookingType?.name === item?.name
                                        ? colors.greyColor
                                        : colors.whiteOpacity15,
                                  }}
                                  customStyles={{
                                    optionText: {textAlign: 'center'},
                                  }}
                                />
                                <View
                                  style={{
                                    borderBottomWidth: 1,
                                    borderBottomColor: colors.greyColor,
                                  }}
                                />
                              </View>
                            );
                          })}
                        </ScrollView>
                      </MenuOptions>
                    </Menu>
                  </View>
                </View>
                {selectedBookingType?.id == 2 && (
                  <View>
                    <View style={styles.timeView}>
                      <Text>{'SCHEDULE TIME'}</Text>
                    </View>
                    <View style={styles.pickerStyle}>
                      <Text style={[styles.textStyleTime]}>
                        {strings.DATE}:
                      </Text>
                      <TouchableOpacity
                        style={styles.pickerView}
                        onPress={_chooseDay}>
                        <Text
                          style={[
                            styles.textStyleTime,
                            {width: width/2.8},
                          ]}>
                          {serviceDateTime
                            ? moment(serviceDateTime).format('YYYY-MM-DD')
                            : strings.SELECT_DATE}
                        </Text>
                        <Image
                          style={styles.imageStyle}
                          resizeMode="contain"
                          source={imagePath.calendarA}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.timePickerView}>
                      <Text style={[styles.textStyleTime]}>
                        {strings.TIME}:
                      </Text>
                      <Menu
                        style={{alignSelf: 'center'}}
                        opened={menuOpened}
                        onBackdropPress={checkDatIsSelected}>
                        <MenuTrigger onPress={checkDatIsSelected}>
                          <View style={styles.pickerView}>
                            <Text
                              style={[
                                styles.textStyleTime,
                                {width: width/2.8},
                              ]}>
                              {!isEmpty(serviceTimeSlot)
                                ? serviceTimeSlot.name
                                : strings.SELECT_SLOT}
                            </Text>
                            <Image
                              style={[styles.imageStyle]}
                              resizeMode="contain"
                              source={imagePath.icDropdown}
                            />
                          </View>
                        </MenuTrigger>
                        <MenuOptions
                          customStyles={{
                            optionsContainer: {
                              marginTop: moderateScaleVertical(36),
                              width: moderateScale(180),
                              height: moderateScale(100),
                            },
                            optionsWrapper: {
                              width: moderateScale(180),
                              height: moderateScale(100),
                            },
                          }}>
                          <ScrollView>
                            {timeSlots.map((item, index) => {
                              // const time_12_1 = moment(item.split('-', 2)[0], 'HH:mm').format('hh:mm a')
                              // const time_12_2 = moment(item.split('-', 2)[1], 'HH:mm').format('hh:mm a')
                              return (
                                <View key={index}>
                                  <MenuOption
                                    onSelect={() =>
                                      updateState({
                                        serviceTimeSlot: item,
                                        menuOpened: !menuOpened,
                                      })
                                    }
                                    key={String(index)}
                                    // text={`${time_12_1} - ${time_12_2}`}
                                    text={item.name}
                                    style={{
                                      marginVertical: moderateScaleVertical(5),
                                      backgroundColor:
                                        serviceTimeSlot === item
                                          ? colors.greyColor
                                          : colors.whiteOpacity15,
                                    }}
                                    customStyles={{
                                      optionText: {textAlign: 'center'},
                                    }}
                                  />
                                  <View
                                    style={{
                                      borderBottomWidth: 1,
                                      borderBottomColor: colors.greyColor,
                                    }}
                                  />
                                </View>
                              );
                            })}
                          </ScrollView>
                        </MenuOptions>
                      </Menu>
                    </View>
                  </View>
                )}
                <View style={styles.addressView}>
                  <Text style={[styles.textStyleTime]}>{strings.ADDRESS}:</Text>
                  <TouchableOpacity
                    style={styles.pickerView}
                    onPress={() => {
                      updateState({isVisible: true});
                    }}>
                    <Text
                      numberOfLines={2}
                      style={[
                        styles.textStyleTime,
                        {width: width/2.8},
                      ]}>
                      {selectedAddress?.address
                        ? selectedAddress?.address
                        : 'Select Address'}
                    </Text>
                    <Image
                      style={styles.imageStyle}
                      resizeMode="contain"
                      source={imagePath.icDropdown}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.btnStyle}>
                <View style={{marginVertical: moderateScaleVertical(20)}}>
                  {/* <TouchableOpacity style={{ flex: 0.6, flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(10), }}
                            onPress={() => checkOptionsType(1)}>
                            <View style={{ marginLeft: moderateScale(14), marginRight: moderateScale(10) }}>
                                <Image style={{ height: moderateScaleVertical(20), width: moderateScale(20) }}
                                    source={(OrderOptionsTypeSelected && OrderOptionsType == 1) ? imagePath.icCheck1 : imagePath.icCheck2} />
                            </View>
                            <Text style={styles.yearView}>{strings.FLEXIBLE}</Text>
                        </TouchableOpacity> */}
                  {/* <TouchableOpacity
                    style={{
                      flex: 0.6,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                    onPress={() => checkOptionsType(2)}>
                    <View
                      style={{
                        marginLeft: moderateScale(14),
                        marginRight: moderateScale(10),
                      }}>
                      <Image
                        style={{
                          height: moderateScaleVertical(20),
                          width: moderateScale(20),
                        }}
                        source={
                          OrderOptionsTypeSelected && OrderOptionsType == 2
                            ? imagePath.icCheck1
                            : imagePath.icCheck2
                        }
                      />
                    </View>
                    <Text
                      style={{
                        ...styles.yearView,
                        color: isDarkMode ? colors.white : colors.blackB,
                      }}>
                      {strings.EMERGENCY}
                    </Text>
                  </TouchableOpacity> */}
                </View>
                <GradientButton
                  colorsArray={[
                    themeColors.primary_color,
                    themeColors.primary_color,
                  ]}
                  onPress={sendProductVariantData}
                  btnText={strings.PROCEED}
                />
              </View>
              <View style={{height: moderateScaleVertical(80)}} />
            </ScrollView>
          </MenuProvider>
          <DatePicker
            date={new Date()}
            minimumDate={new Date()}
            modal={true}
            open={openDateTimePicker}
            onCancel={() => {
              updateState({openDateTimePicker: !openDateTimePicker});
            }}
            onConfirm={date => onChangeDateTime(date)}
            mode={'date'}
            textColor={isDarkMode ? colors.white : colors.blackB}
            style={{
              width: width / 1.1,
              height: height / 2.6,
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.lightDark
                : colors.white,
              alignSelf: 'center',
            }}
            theme={isDarkMode ? 'dark' : 'light'}
          />

          <AddressModal3
            isVisible={isVisibleAddressModal}
            onClose={() =>
              setModalVisibleForAddessModal(!isVisibleAddressModal)
            }
            type={type}
            passLocation={data => addUpdateLocation(data)}
            navigation={navigation}
            selectViaMap={selectViaMap}
            openCloseMapAddress={openCloseMapAddress}
            constCurrLoc={location}
          />
          <ChooseAddressModal
            isVisible={isVisible}
            onClose={() => {
              updateState({isVisible: false});
            }}
            openAddressModal={() =>
              setModalVisibleForAddessModal(true, 'addAddress')
            }
            selectAddress={data => selectAddress(data)}
            selectedAddress={selectedAddressData}
          />
        </WrapperContainer>
      </Modal>
      <Modal
        style={{
          backgroundColor: colors.white,
          margin: 0,
          padding: moderateScale(12),
        }}
        isVisible={profilemodal}>
        {console.log(selectedtechnician, 'selectedtechnician')}
        <WrapperContainer>
          <View style={{flex: 1}}>
            <Header
              onPressLeft={() => {
                updateState({profilemodal: false});
              }}
              centerTitle={strings.PROFILE}
            />
            <View style={styles.prfiletopview}>
              <View>
                <Image
                  style={{
                    borderRadius: 50,
                    width: moderateScale(100),
                    height: moderateScale(100),
                  }}
                  source={{uri: selectedtechnician.image_url}}
                />
              </View>
              <View style={{marginLeft: moderateScale(16)}}>
                <Text
                  style={{
                    fontFamily: fontFamily.bold,
                    fontSize: textScale(20),
                    marginBottom: moderateScaleVertical(6),
                  }}>
                  {selectedtechnician?.name}
                  {!!selectedtechnician?.complete_order_count
                    ? `(${selectedtechnician?.complete_order_count})`
                    : ''}
                </Text>
                {!!Number(selectedtechnician?.rating) && (
                  <StarRating
                    maxStars={5}
                    rating={Number(selectedtechnician?.rating)}
                    fullStarColor={colors.ORANGE}
                    starSize={16}
                    containerStyle={{width: width / 4.5}}
                  />
                )}
                {!!selectedtechnician?.type &&
                  selectedtechnician?.type != 'undefined' && (
                    <Text
                      style={{
                        marginTop: moderateScaleVertical(6),
                        fontSize: textScale(16),
                      }}>
                      {selectedtechnician?.type}
                    </Text>
                  )}
                  {!!selectedtechnician?.distance && (
                    <Text
                      style={{
                        marginTop: moderateScaleVertical(6),
                        fontSize: textScale(16),
                      }}>
                      {selectedtechnician?.distance} away
                    </Text>
                  )}


                  
              </View>
              <View></View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottomColor: colors.borderColor,
                borderBottomWidth: 2,
                paddingBottom: moderateScale(12),
              }}>
              <View style={styles.experienceview}>
                <Text style={styles.exptitle}>Order Completed</Text>
                <Text style={{fontFamily: fontFamily.bold}}>
                  {selectedtechnician?.complete_order_count}
                </Text>
              </View>
              <View style={styles.experienceview}>
                <Text style={styles.exptitle}>Experience</Text>
                <Text style={{fontFamily: fontFamily.bold}}>
                  {getExpDays(selectedtechnician?.created_at) > 30 &&
                  getExpDays(selectedtechnician?.created_at) < 365
                    ? `${getExpMonth(selectedtechnician?.created_at)} Months`
                    : getExpDays(selectedtechnician?.created_at) > 365
                    ? `${getExpYear(selectedtechnician?.created_at)} Years`
                    : `${getExpDays(selectedtechnician?.created_at)} days`}
                </Text>
              </View>
              <View style={styles.experienceview}>
                <Text style={styles.exptitle}>Ratings</Text>
                <Text style={{fontFamily: fontFamily.bold}}>
                  {Number(selectedtechnician?.rating).toFixed(0)}
                </Text>
              </View>
            </View>
            {!!Number(selectedtechnician?.agentlog?.lat)&& !!Number(selectedtechnician?.agentlog?.long)&&<View
              style={{
                flex: 1,
                borderRadius: moderateScale(18),
                overflow: 'hidden',
                marginTop:moderateScale(12)
              }}>
              <MapView
                ref={mapRef}
                provider={
                  Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
                }
                scrollEnabled
                style={{
                  ...StyleSheet.absoluteFillObject,
                  borderRadius: 18,
                  height: height / 3,
                }}
                region={{
                  latitude: Number(selectedtechnician?.agentlog?.lat),
                  longitude: Number(selectedtechnician?.agentlog?.long) ,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }}>
                 <Marker.Animated
                  // tracksViewChanges={agent_location == null}
                  coordinate={{
                    latitude: Number(selectedtechnician?.agentlog?.lat),
                  longitude: Number(selectedtechnician?.agentlog?.long) ,
                  }}>
                  <Image
                    style={{
                      height:moderateScale(40),width:moderateScaleVertical(40)
                    }}
                    source={imagePath.icmanMarker2}
                  />
                </Marker.Animated>

                </MapView>
            </View>}
            <View
              style={{
                justifyContent: 'flex-end',
                paddingBottom: moderateScale(40),
              }}>
              <ButtonComponent
                onPress={() => addToCart(selectedtechnician)}
                btnText={'Select Agent'}
              />
            </View>
          </View>
        </WrapperContainer>
      </Modal>
    </WrapperContainer>
  );
};

//make this component available to the app
export default AvailableTechnicians;
