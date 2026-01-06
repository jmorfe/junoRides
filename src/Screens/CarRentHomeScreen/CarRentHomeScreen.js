import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { memo, useState } from 'react';
import { FlatList, Platform, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'react-native-animatable';
import { useSelector } from 'react-redux';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import SearchAreaModal from '../../Components/SearchAreaModal';
import SelectDatePicker from '../../Components/SelectDatePicker';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  width
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import {
  getColorCodeWithOpactiyNumber,
  showError
} from '../../utils/helperFunctions';
import { getColorSchema } from '../../utils/utils';
import stylesFunc from './styles';
const CarRentHomeScreen = ({ route }) => {
  const navigation = useNavigation();
  const { data } = route?.params
  // -----------------redux data
  const { appData, themeColors, themeColor, themeToggle, currencies, languages } = useSelector(
    state => state?.initBoot || {},
  );
  const userData = useSelector(state => state?.auth?.userData || {});
  const { location, appMainData } = useSelector((state) => state?.home || {});

  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const styles = stylesFunc({ themeColors, isDarkMode, MyDarkTheme })
  const profileInfo = appData?.profile;

  // -------------states
  const [showPickUpTime, setShowPickUpTime] = useState(false);

  const [showReturnTime, setShowReturnTime] = useState(false);


  const [addressModal, showAddressModal] = useState(false);
  const [locationIndex, setLocationIndex] = useState(null);
  const [returnlocation, setreturnlocation] = useState('');
  const [searchResult, setSearchResult] = useState([]);


  const [dropLocationData, setDropLocationData] = useState([
    {
      type: 'pickup',
      address: '',
      location: { latitude: 0, longitude: 0 },
    },
    {
      type: 'dropOff',
      address: '',
      location: { latitude: 0, longitude: 0 },
    },
  ]);

  const [pickTimeDate, setPickTimeDate] = useState(
    {
      time: '',
      date: '',
      period: '',
      dateAndTime: ''
    },
  );

  const [returnTimeDate, setReturnPickTimeDate] = useState(
    {
      time: '',
      date: '',
      period: '',
      dateAndTime: ''
    },
  );
  const [loader, setLoader] = useState(false);

  const [checkBox, setCheckBox] = useState(false);
  console.log(dropLocationData, 'dropLocationDatadropLocationData', returnTimeDate);


  // ----------selectedSearch -------------

  const onSearchHandler = val => {
    setLocationIndex(val);
    showAddressModal(true);
  };


  const onShowCars = () => {
    if (!dropLocationData[0]?.location?.lat) {
      showError('Please enter pickup location')
      return
    }
    if (!checkBox && !dropLocationData[1]?.location?.lat) {
      showError('Please enter dropLocation location')
      return
    }

    if (data?.type == 'product') {
      setLoader(true)
      let apiData = {
        start_time: !!pickTimeDate.dateAndTime ? pickTimeDate.dateAndTime : moment().format('YYYY-MM-DD hh:mm a'),
        end_time: !!returnTimeDate.dateAndTime ? returnTimeDate.dateAndTime : moment().format('YYYY-MM-DD hh:mm a'),
        pickup_latitude: dropLocationData[0]?.location?.latitude || dropLocationData[0]?.location?.lat,
        pickup_longitude: dropLocationData[0]?.location?.longitude || dropLocationData[0]?.location?.lng
      }

      actions.productCheckAvailibility(
        `/${data?.id}`,
        apiData,
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        }
      ).then((res) => {
        setLoader(false)

        navigation.navigate(navigationStrings.PRODUCTDETAIL, {
          data: data,
          searchDataParam: {
            pickup: {
              latitude: dropLocationData[0]?.location?.lat,
              longitude: dropLocationData[0]?.location?.lng,
              address: dropLocationData[0]?.address,
              time: !!pickTimeDate.dateAndTime ? pickTimeDate.dateAndTime : moment().format('YYYY-MM-DD hh:mm a'),
            },
            dropOff: {
              latitude:
                dropLocationData[!!checkBox ? 0 : 1]?.location
                  ?.lat,
              longitude:
                dropLocationData[!!checkBox ? 0 : 1]?.location
                  ?.lng,
              address:
                dropLocationData[!!checkBox ? 0 : 1]?.address,
              time: !!returnTimeDate.dateAndTime ? returnTimeDate.dateAndTime : moment().format('YYYY-MM-DD hh:mm a'),
            },
            service: 'rental',
          }
        })
      }).catch((error) => {
        showError(error?.message)
        setLoader(false)

      })

      return
    }

    navigation?.navigate(navigationStrings.AVAILABLE_CARS, {
      data: {
        pickup: {
          latitude: dropLocationData[0]?.location?.lat,
          longitude: dropLocationData[0]?.location?.lng,
          address: dropLocationData[0]?.address,
          time: !!pickTimeDate.dateAndTime ? pickTimeDate.dateAndTime : moment().format('YYYY-MM-DD hh:mm a'),
        },
        dropOff: {
          latitude:
            dropLocationData[!!checkBox ? 0 : 1]?.location
              ?.lat,
          longitude:
            dropLocationData[!!checkBox ? 0 : 1]?.location
              ?.lng,
          address:
            dropLocationData[!!checkBox ? 0 : 1]?.address,
          time: !!returnTimeDate.dateAndTime ? returnTimeDate.dateAndTime : moment().format('YYYY-MM-DD hh:mm a'),
        },
        service: 'rental',
        category_id: data?.id
      },
    })
  }


  return (
    <WrapperContainer>


      <View
        style={{
          flex: 1,
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
        }}>
        <Header onPressLeft={() => navigation.goBack()} />

        {/* -----------------rentbook container-------------- */}
        <View
          style={[
            styles.taxiBookContainer,
            {
              backgroundColor: isDarkMode
                ? colors.background
                : colors.white,

            },
          ]}>
          <View style={styles.texiBookView}>
          
            <FlatList
              data={dropLocationData}
              renderItem={({ item, index }) => (
                <View style={{ flexDirection: 'row', marginTop: moderateScaleVertical(16), }}>
                  <View style={{ flex: 0.15, alignItems: 'flex-start', justifyContent: 'flex-end', paddingBottom: moderateScale(16) }}>
                    <Image
                      resizeMode="contain"
                      source={imagePath.oval}
                      style={{
                        tintColor: index == 0 ?isDarkMode? colors.white: colors.black : themeColors?.primary_color,
                        height: moderateScale(18),
                        width: moderateScale(18),
                        resizeMode:'contain'
                      }}
                    />
                  </View>
                  <View style={{ flex: 0.85 }} >
                    <TouchableOpacity
                      style={{
                        marginBottom: moderateScaleVertical(0),

                      }}
                      onPress={() => onSearchHandler(index) } activeOpacity={0.9}>
                      <Text style={styles.locationHadingText}>
                        {index == 0 ? strings.PICKUP_LOCATION : strings.RETURN_LOCATION}
                      </Text>


                      <Text
                        style={[
                          styles.locationText,
                          {
                            textTransform: 'capitalize',
                            color: isDarkMode
                              ? colors.white
                              : colors.black,
                          },
                        ]}>
                        {!!item?.address
                          ? item?.address
                          : index == 0 ? strings.MY_CURRENT_LOCATION : strings.MY_RETURN_LOCATION}
                      </Text>


                    </TouchableOpacity>
                    <View style={styles.sepratorView} />

                  </View>
                </View>
              ) }
              ItemSeparatorComponent={() => <View><View style={{
                height: moderateScale(40), borderColor:isDarkMode? colors.white:colors.black, position: 'absolute', borderStyle: 'dotted',
                borderLeftWidth: 1, left: moderateScale(8), top: -5,
                borderRadius: 1,
              }} /></View>}
              />
          </View>

          <View
            style={{
              backgroundColor: isDarkMode ? MyDarkTheme.colors.lightDark: getColorCodeWithOpactiyNumber(
                themeColors?.primary_color?.substr(1),
                10,
              ),
              ...styles.datepickerview,
            }}>

            {/* --------------------piuck time ----------- */}
            <TouchableOpacity
              style={{}}
              onPress={() => setShowPickUpTime(!showPickUpTime)}>
              <Text style={styles.dateTitleText}>
                {strings.PICKUP_DATE}
              </Text>
              <View
                style={styles.dateView}>
                <Text style={styles.dateText}>
                  {!!pickTimeDate?.dateAndTime ? pickTimeDate?.dateAndTime : moment().format('YYYY-MM-DD hh:mm a')}
                </Text>
                <Image
                  source={imagePath.ic_down_arrow1}
                  style={styles.dropDownIcon}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                borderWidth: 0.6,
                width: moderateScale(10),
                marginLeft: moderateScale(-30),
                marginTop: moderateScale(-10),
                borderColor:isDarkMode? colors.white:colors.black
              }}
            />
            {/* -------------------------return date button */}
            <TouchableOpacity
              style={{}}
              onPress={() => setShowReturnTime(!showReturnTime)}>
              <Text style={styles.dateTitleText}>
                {strings.RETURN_DATE}
              </Text>
              <View
                style={styles.dateView}>
                <Text style={styles.dateText}>
                  {!!returnTimeDate?.dateAndTime ? returnTimeDate?.dateAndTime : moment().format('YYYY-MM-DD hh:mm a')}
                </Text>
                <Image
                  source={imagePath.ic_down_arrow1}
                  style={styles.dropDownIcon}
                />
              </View>
            </TouchableOpacity>
          </View>

        </View>
        <GradientButton
          containerStyle={[styles.showCarButtonStyle,]}
          textStyle={{
            color: isDarkMode
              ? MyDarkTheme.colors.text
              : colors.atlanticgreen,
            fontSize: moderateScale(13),
            fontWeight: '600',

          }}
          btnStyle={{
            backgroundColor:isDarkMode ? MyDarkTheme.colors.lightDark:  getColorCodeWithOpactiyNumber(
              themeColors?.primary_color?.substr(1),
              10,
            ), width: width - 30, marginBottom: moderateScale(20)
          }}
          btnText={data?.type == 'product' ? strings.PRODUCTS_DETAIL : strings.SHOW_CARS}
          onPress={onShowCars}
          colorsArray={[colors.transparent, colors.transparent]}
          indicator={loader}
          disabled={loader}
        />
      </View>
      <SearchAreaModal
        showModal={addressModal}
        location={`${location.latitude}-${location.longitude}`}
        mapKey={Platform.OS=='ios'?appData?.profile?.preferences?.map_key_for_ios_app||appData?.profile?.preferences?.map_key : appData?.profile?.preferences?.map_key_for_app|| appData?.profile?.preferences?.map_key}
        title={locationIndex ? 'My Return Location' : 'My Current Location'}
        onClose={() => {
          showAddressModal(false);
          setSearchResult([]);
          setreturnlocation('');
        }}
        searchResult={searchResult}
        setSearchResult={data => setSearchResult(data)}
        value={returnlocation}
        setValue={text => setreturnlocation(text)}
        onClear={() => {
          setreturnlocation('');
          setSearchResult([]);
        }}
        getLocation={async val => {
          let newArr = [...dropLocationData];
          if (newArr[locationIndex]) {
            newArr[locationIndex].location = val?.location;
            newArr[locationIndex].address = val?.name;
          }
          await setDropLocationData(newArr);
          showAddressModal(false);
          setSearchResult([]);
          setreturnlocation('');
        }}
      />
      <SelectDatePicker
        showTime={showPickUpTime}
        setShowTime={val => setShowPickUpTime(val)}
        timeDate={pickTimeDate}
        setTimeAndDate={(vel) => setPickTimeDate(vel)}
        title={strings.PICKUP_DATE}
      />

      <SelectDatePicker
        showTime={showReturnTime}
        setShowTime={val => setShowReturnTime(val)}
        timeDate={returnTimeDate}
        setTimeAndDate={(vel) => setReturnPickTimeDate(vel)}
        title={strings.RETURN_DATE}
      />
    </WrapperContainer>
  );
};

export default memo(CarRentHomeScreen);