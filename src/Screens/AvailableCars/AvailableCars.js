import { useNavigation } from '@react-navigation/native';
import React, { memo, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { UIActivityIndicator } from 'react-native-indicators';
import { useSelector } from 'react-redux';
import FilterComp from '../../Components/FilterComp';
import ProductsThemeCard from '../../Components/NewComponents/ProductsThemeCard';
import NoDataFound from '../../Components/NoDataFound';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  width
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { getColorSchema } from '../../utils/utils';
const AvailableCars = ({route}) => {
  const navigation = useNavigation();
  console.log(navigation, 'ehjdkjebdjk');
  let selectedFilters = useRef(null);
  const darkthemeusingDevice = getColorSchema();
  let paramData = route?.params?.data;
console.log(paramData,'paramDataparamDataparamData');
  // --------------------redux state
  const {appData, themeColors, themeColor, themeToggle} = useSelector(
    state => state?.initBoot || {},
  );

  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  // -------------states

  const [isShowFilter, setIsShowFilter] = useState(false);
  const [selectedSortFilter, setSelectedSortFilter] = useState(null);
  const [minimumPrice, setMinimumPrice] = useState(0);
  const [maximumPrice, setMaximumPrice] = useState(50000);
  const [allFilters, setAllFilter] = useState([
    {id: 1, label: 'all', value: [{label: 'sadsfd'}]},
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchFullData, setSearchFullData] = useState({});
  const [searchData, setSearchData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [lastPage, setLastPage] = useState();
  const [moreLoader, setMoreLoader] = useState(false);
  const [searchDataParam, setSearchDataParam] = useState(paramData);
  console.log(searchDataParam, 'searchDatasearchData');


  useEffect(() => {
    getProductDetail();
  }, [pageNo]);


  console.log(pageNo,'pageNo');
  const getProductDetail = () => {
    let data = {
      ...searchDataParam,
      page: pageNo,
      limit: 3,
      // location: {location_latitude: 30.733315, location_longitude: 76.779419},
    };
    let header = {
      code: appData.profile.code,
    };
    console.log(data, 'datadatadatadata');
    actions
      .searchProductByType(data, header)
      .then(res => {
        console.log(res, 'resresresresres++resres');
        setSearchFullData(res?.data)
        setLastPage(res?.data?.products?.last_page);
        setSearchData(pageNo == 1 ?res?.data?.products :[...searchData, ...res?.data?.products])
        setRefreshing(false);
        setMoreLoader(false);
        setIsLoading(false);
      })
      .catch(erro => {
        setRefreshing(false);
        setMoreLoader(false);
        setIsLoading(false);
      });
  };

  const onFilterApply = (filterData = {}) => {
    console.log(filterData, 'filterDatafilterData');
    selectedFilters.current = filterData;
  };

  const allClearFilters = () => {
    selectedFilters.current = null;
  };

  const updateMinMax = (min, max) => {
    setMinimumPrice(min);
    setMaximumPrice(max);
  };
  // ----------------refres sheet-----------
  const handleRefresh = () => {
    setRefreshing(true);
    setPageNo(1);
    getProductDetail();
  };

  const onEndReached = () => {
    if (pageNo <= lastPage) {
      setPageNo(prvPage => prvPage + 1);
      setMoreLoader(true);
    }
    setIsLoading(false);
  };

  // function headerview() {
  //   return (
  //     <View style={styles.flallistheaderview}>
  //       <Text
  //         style={{
  //           ...styles.headertext,
  //           color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
  //         }}>
  //         { searchDataParam?.service == 'yacht' ? strings.AVAILABLE_YACTH :strings.AVAILABLE_CAR}
  //       </Text>
  //     </View>
  //   );
  // }
  const listFooterComponent = () => {
    return (
      <>
        {!!moreLoader ? (
          <View style={{height: moderateScale(60)}}>
            <UIActivityIndicator />
          </View>
        ) : null}
      </>
    );
  };

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      isLoading={isLoading}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: moderateScale(14),
          borderBottomColor: colors.grey3,
          borderBottomWidth: 1,
          paddingBottom: moderateScaleVertical(16),
        }}>
        <View style={{flex: 0.1, justifyContent: 'center'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FastImage
              source={imagePath.backRoyo}
              style={{height: moderateScale(16), width: moderateScale(16)}}
              resizeMode="contain"
              tintColor={isDarkMode ? MyDarkTheme.colors.white : colors.black}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingVertical: moderateScale(20),
            flex: 0.9,
            backgroundColor: isDarkMode ? MyDarkTheme.colors.border : '#F7F7F7',
            flexDirection: 'row',
            marginTop: moderateScale(10),
            paddingHorizontal:moderateScale(10)
          }}>
        
   
          <View style={{flex: 0.9}}>
            {/* ---------place view---------- */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 0.45}}>
                <Text
                  style={{
                    maxWidth: width / 3,
                    color: isDarkMode ? colors.white : colors.black,
                    
                  }}
                  numberOfLines={2}
                >
                  {searchDataParam?.pickup?.address}
                </Text>
              </View>
              {searchDataParam?.service == 'yacht' ? null :
                <>

              <View style={{flex: 0.1, marginRight: moderateScale(20)}}>
                <FastImage
                  source={imagePath.backArrow}
                  style={{
                    height: moderateScale(14),
                    width: moderateScale(20),
                    marginHorizontal: moderateScale(20),
                    transform: [{rotate: '180deg'}],
                    justifyContent: 'center',
                  }}
                  tintColor={isDarkMode ? colors.white : colors.black}
                  resizeMode="contain"
                />
              </View>
              <View style={{flex: 0.45}}>
                <Text
                  style={{
                    maxWidth: width / 3,
                    color: isDarkMode ? colors.white : colors.black,
                      }}
                      numberOfLines={2}
                    >
                  {searchDataParam?.dropOff?.address}
                </Text>
                  </View>
                  </>
              }
            </View>
            {/* ---------date view---------- */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: moderateScale(6),
              }}>
              <View style={{flex: 0.45}}>
                <Text
                  style={{
                    color: isDarkMode ? colors.white : colors.black,
                    maxWidth: width / 3,
                  }}>
                  {searchDataParam?.pickup?.time}
                </Text>
              </View>

              {searchDataParam?.service == 'yacht' ? null :
             <>
             <View
                style={{
                  justifyContent: 'center',
                  // borderWidth: 0.6,
                  flex: 0.1,
                  marginRight: moderateScale(10),
                  width: moderateScale(20),
                  marginHorizontal: moderateScale(10),
                  height: moderateScale(1),
                  backgroundColor: isDarkMode ? colors.white : colors.black,
                }}
              />
              <View style={{flex: 0.45}}>
                <Text
                  style={{
                    color: isDarkMode ? colors.white : colors.black,
                    maxWidth: width / 3,
                  }}>
                  {searchDataParam?.dropOff?.time}
                </Text>
                  </View>
                  </>
              }
            </View>
          </View>
         {/* {searchDataParam?.service == 'yacht' ? null :   <TouchableOpacity
            style={{
              // position: 'absolute',
              //   right: 0,
              flex: 0.1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            // onPress={() => setEditOption(true)}>
            onPress={() => navigation.goBack()}>
            <FastImage
              source={imagePath.edit1Royo}
              style={{
                height: moderateScale(14),
                width: moderateScale(20),
                marginHorizontal: moderateScale(10),
              }}
              tintColor={isDarkMode ? colors.white : colors.black}
              resizeMode="contain"
            />
          </TouchableOpacity>} */}
          {/* )} */}
        </View>
      </View>
      <FlatList
        data={searchData || []}
        style={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
          marginTop: moderateScaleVertical(15),
        }}
        refreshing={refreshing}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={themeColors.primary_color}
          />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        // ListHeaderComponent={headerview}
        contentContainerStyle={{paddingBottom: moderateScale(20)}}
        keyExtractor={(i, index) => index.toString()}
        renderItem={({item}) => {
          return (
            <ProductsThemeCard
              item={item}
              onPressProduct={() => {

                navigation.navigate(navigationStrings.PRODUCTDETAIL, {
                  data: item,
                  searchDataParam: searchDataParam
                })
              }
              }
            />

          );
        }}
        ListEmptyComponent={
          !isLoading && (
            <View
              style={{
                flex: 1,
                marginTop: moderateScaleVertical(width / 2),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <NoDataFound isLoading={isLoading} />
            </View>
          )
        }
        ListFooterComponent={listFooterComponent}
      />
      {/* --------------filter for cars */}
      {isShowFilter ? (
        <FilterComp
          isDarkMode={isDarkMode}
          themeColors={themeColors}
          onFilterApply={onFilterApply}
          onShowHideFilter={() => setIsShowFilter(false)}
          allClearFilters={allClearFilters}
          selectedSortFilter={selectedSortFilter}
          onSelectedSortFilter={val => setSelectedSortFilter(val)}
          maximumPrice={maximumPrice}
          minimumPrice={minimumPrice}
          updateMinMax={updateMinMax}
          filterData={allFilters}
        />
      ) : null}
    </WrapperContainer>
  );
};
export default memo(AvailableCars);

