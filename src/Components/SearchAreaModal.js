import React, { memo, useState } from 'react';
import {
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { getPlaceDetails } from '../utils/googlePlaceApi';
import { getColorSchema } from '../utils/utils';
import ModalView from './Modal';
import SearchPlaces2 from './SearchPlaces2';

const SearchAreaModal = ({
  showModal,
  location = {},
  mapKey,
  value,
  setValue = () => {},
  title,
  onClose = () => {},
  searchResult,
  setSearchResult = () => {},
  onClear,
  getLocation = () => {},
}) => {
  const {themeColor, themeToggle} = useSelector(state => state?.initBoot || {});

  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  let [locationData, setLocationData] = useState('');
  //   const [searchResult, setSearchResult] = useState([]);

  const onPressAddress = async place => {
    Keyboard.dismiss();
    console.log(!!place.place_id && !!place?.name, 'asdbsuydvusdbfuv');
    // return;
    if (!!place.place_id && !!place?.name) {
      getPlaceDetails(place.place_id, mapKey)
        .then(res => {
          console.log('i am here ++++++++++', res);
          getLocation({location:res?.result?.geometry?.location,name:res?.result?.name});
        })
        .catch(err => {
          console.log('i am here ++++++++++', err);
        });
    } else {
      alert(strings.PLACE_ID_NOT_FOUND);
    }
  };
  const renderSearchItem = item => {
    return (
      <TouchableOpacity
        style={{
          ...styles.addressViewStyle,
          borderBottomColor: isDarkMode
            ? colors.whiteOpacity22
            : colors.lightGreyBg,
        }}
        onPress={() => onPressAddress(item)}>
        <View style={{flex: 0.15}}>
          <Image source={imagePath.RecentLocationImage} />
        </View>
        <View style={{flex: 0.9}}>
          <Text
            style={{
              fontSize: textScale(12),
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              fontFamily: fontFamily.regular,
            }}>
            {item?.name}
          </Text>
          <Text
            numberOfLines={2}
            style={{
              fontSize: textScale(10),
              color: colors.textGreyJ,
              fontFamily: fontFamily.regular,
              lineHeight: moderateScaleVertical(20),
            }}>
            {item?.formatted_address}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ModalView
      isVisible={showModal}
      onClose={onClose}
      modalMainContent={() => {
        return (
          <View
            style={{height: height / 2, paddingHorizontal: moderateScale(10),}}>
            <Text style={[styles.titleStyle,{color:isDarkMode?colors.white:colors.black}]}>{title}</Text>
            <SearchPlaces2
              showRightImg={false}
              curLatLng={location}
              containerStyle={{
                backgroundColor: colors.transparent,
                paddingHorizontal: 0,
                // marginBottom:moderateScale(-20)
              }}
              placeHolderColor={colors.grayOpacity51}
              placeHolder={strings.LOCATION}
              textStyle={{fontSize:textScale(13)}}
              value={value}
              mapKey={mapKey} //
              fetchArrayResult={setSearchResult}
              setValue={setValue}
              index={1}
              onClear={onClear}
            />
            <View
              style={[styles.sepratorView, {marginBottom: moderateScale(5)}]}
            />
            <ScrollView>
              {searchResult?.map((item, i) => {
                console.log(item, 'itemm');
                return renderSearchItem(item);
              })}
            </ScrollView>
          </View>
        );
      }}
    />
  );
};

export default memo(SearchAreaModal);

const styles = StyleSheet.create({
  sepratorView: {
    height: moderateScale(1),
    width: '100%',
    borderColor: colors.lightGray,
    borderWidth: 1,
    marginTop: moderateScale(13),
    borderRadius: 1,
  },
  titleStyle:{
    textAlign:'center',fontFamily:fontFamily.circularBold,fontSize:textScale(16)
  },
  addressViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: moderateScale(10),
    borderBottomWidth: 0.5,
    marginBottom: moderateScaleVertical(4),
  },
});
