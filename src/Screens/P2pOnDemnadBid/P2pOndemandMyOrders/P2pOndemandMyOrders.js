import { useFocusEffect } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as RNLocalize from 'react-native-localize';
import { useSelector } from 'react-redux';
import ButtonComponent from '../../../Components/ButtonComponent';
import Header2 from '../../../Components/Header2';
import P2pProductComp from '../../../Components/P2pProductComp';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import { hitSlopProp } from '../../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import { showError } from '../../../utils/helperFunctions';
import { getColorSchema } from '../../../utils/utils';
import stylesFunc from './styles';

export default function P2pOndemandMyOrders({navigation, route}) {
  const {
    appData,
    currencies,
    languages,
    appStyle,
    themeColors,
    themeToggle,
    themeColor,
  } = useSelector(state => state?.initBoot);

  const {userData} = useSelector(state => state?.auth);
  const {location} = useSelector(state => state?.home);
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const {preferences} = appData?.profile;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily, themeColors});

  const [tabsData, setTabsData] = useState([
    {
      id: 1,
      title: 'Upcoming rents',
    },
    {
      id: 2,
      title: 'Active rents',
    },
    {
      id: 3,
      title: 'Cancelled rents',
    },
    {
      id: 4,
      title: 'Past rents',
    },
  ]);
  const [selectedTab, setSelectedTab] = useState({
    id: 1,
    title: 'Upcoming rents',
  });

  const [orderHistory, setOrderHistory] = useState([]);
  const [isRefreshing, setisRefreshing] = useState(false);
  const [pageNo, setpageNo] = useState(1);
  const [isLoadMore, setisLoadMore] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [upcomingOngoingOrders, setUpcomingOngoingOrders] = useState([]);
  const [order_type, setOrder_type] = useState('rent');

  useFocusEffect(
    useCallback(() => {
      if (!userData?.auth_token) {
        actions.setAppSessionData('on_login');
        return;
      }
      setIsLoadingOrders(true);
      if (selectedTab?.id == 3) {
        getOrders(1, 'cancel');
      } else {
        getOngoingAndUpcomingOrders(selectedTab);
      }
    }, [selectedTab]),
  );

  const onChangeTab = type => {
    setSelectedTab(type);
    setIsLoadingOrders(true);
    setpageNo(1);
  };

  const handleRefresh = () => {
    setisRefreshing(true);
    setpageNo(1);
    setisLoadMore(true);
    if (selectedTab?.id == 3) {
      getOrders(1, 'cancel');
    } else {
      getOngoingAndUpcomingOrders(selectedTab);
    }
  };
  const onEndReached = () => {
    if (isLoadMore) {
      setpageNo(pageNo + 1);
      getOrders(pageNo + 1);
    }
  };

  const getOngoingAndUpcomingOrders = (type = selectedTab,productType=order_type) => {
    console.log(type, 'typetype',order_type);
    actions
      .getUpcomingAndOngoingOrders(
        `?type=${
          type?.id == 4 ? 'past' : (type?.id == 1||(order_type=='purchase'&& type?.id==2)) ? 'upcoming' : 'ongoing'
        }&productType=${productType}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then(res => {
        console.log(res, '<===res getUpcomingAndOngoingOrders');
        setIsLoadingOrders(false);
        setUpcomingOngoingOrders(res?.data);
        setisRefreshing(false);
      })
      .catch(errorMethod);
  };

  const getOrders = (pageNo = 1, type = 'past',productType=order_type) => {
    console.log(type, 'typetypetype',order_type);
    actions
      .getAllP2pOrders(
        `?limit=${12}&page=${pageNo}&type=${type}&productType=${productType}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          timezone: RNLocalize?.getTimeZone(),
          latitude: location?.latitude?.toString() || '',
          longitude: location?.longitude?.toString() || '',
        },
      )
      .then(res => {
        console.log(res, '<===res getAllP2pOrders');
        setIsLoadingOrders(false);
        setOrderHistory(
          pageNo === 1
            ? res?.data?.data
            : [...orderHistory, ...res?.data?.data],
        );
        setisRefreshing(false);
        if (res?.data?.current_page === res?.data?.last_page) {
          setisLoadMore(false);
        }
      })
      .catch(errorMethod);
  };

  const errorMethod = error => {
    setisRefreshing(false);
    setIsLoadingOrders(false);
    showError(error?.message || error?.error);
  };

  const onChatStart = async item => {
    let productInfo = item?.products[0];
    console.log(item, 'itemitem');

    if (!userData?.auth_token) {
      actions.setAppSessionData('on_login');
      return;
    }
    // setLoadingChat(true);
    try {
      const apiData = {
        sub_domain: '192.168.101.88', //this is static value
        client_id: String(appData?.profile.id),
        db_name: appData?.profile?.database_name,
        user_id: String(userData?.id),
        type: 'user_to_user',
        product_id: String(productInfo?.product_id),
        vendor_id: String(productInfo?.vendor_id),
        order_number: item?.order_number,
      };

      console.log('sending api data', apiData);
      const res = await actions.onStartChat(apiData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      });

      if (!!res?.roomData) {
        navigation.navigate(navigationStrings.CHAT_SCREEN, {
          data: {
            ...res?.roomData,
            vendor_id_order: productInfo?.vendor_id,
            order: item,
            selectedTab: selectedTab,
          },
        });
      }
      // setLoadingChat(false);
    } catch (error) {
      // setLoadingChat(false);
      console.log('error raised in start chat api', error);
      showError(error?.message);
    }
  };

  const renderOrders = useCallback(
    ({item}) => {
      return (
        <P2pProductComp
          isMoreDetails={false}
          isStartChat={
            selectedTab?.id == 1 &&
            item?.order_status_option_id !== 3 &&
            item?.order_status_option_id !== 6
          }
          onChatStart={() => onChatStart(item)}
          selectedTab={selectedTab}
          item={item}
          onViewDetails={() =>
            navigation?.navigate(navigationStrings.P2P_ORDER_DETAIL, {
              selectedTab: selectedTab,
              order_id: item?.order_id,
              isAvailableToRaiseIssue:
                selectedTab?.id == 1 &&
                item?.order_status_option_id !== 3 &&
                item?.order_status_option_id !== 6,
            })
          }
        />
      );
    },
    [orderHistory, selectedTab],
  );

  const renderUpcomingOngoingOrders = useCallback(
    ({item}) => {
      return (
        <P2pProductComp
          isMoreDetails={false}
          isStartChat
          onChatStart={() => onChatStart(item)}
          item={item}
          onViewDetails={() =>
            navigation?.navigate(navigationStrings.P2P_ORDER_DETAIL, {
              selectedTab: selectedTab,
              order_id: item?.order_id,
              type: item?.type || '',
              isAvailableToRaiseIssue: true,
            })
          }
        />
      );
    },
    [upcomingOngoingOrders],
  );

  const updateOrderType = type => {
    setOrder_type(type);
    let newtabdata =
      type == 'purchase'
        ? [
            {
              id: 2,
              title: 'Active Orders',
            },
            {
              id: 3,
              title: 'Cancelled Orders',
            },
            {
              id: 4,
              title: 'Past Orders',
            },
          ]
        : [
            {
              id: 1,
              title: 'Upcoming rents',
            },
            {
              id: 2,
              title: 'Active rents',
            },
            {
              id: 3,
              title: 'Cancelled rents',
            },
            {
              id: 4,
              title: 'Past rents',
            },
          ];
    setTabsData(newtabdata);
    onChangeTab(newtabdata[0]);
  };

  const ListEmptyComp = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={imagePath.noDataFound3}
        style={{
          height: moderateScale(300),
          width: moderateScale(300),
        }}
      />
    </View>
  );

  const ItemSeparatorComponent = () => (
    <View
      style={{
        height: moderateScaleVertical(12),
      }}
    />
  );

  const HeaderView = ({
    leftText = '',
    onPressRight = () => {},
    isRightText = true,
  }) => (
    <View style={styles.headerContainer}>
      <Text
        style={{
          ...styles.leftText,
          color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
        }}>
        {leftText}
      </Text>
      {isRightText && (
        <TouchableOpacity onPress={onPressRight}>
          <Text style={styles.rightTxt}>View all</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderTabs = useCallback(
    ({item, index}) => {
      return (
        <TouchableOpacity
          disabled={isLoadingOrders || selectedTab?.id === item?.id}
          hitSlop={hitSlopProp}
          onPress={() => onChangeTab(item)}
          style={{
            backgroundColor:
              selectedTab?.id === item?.id
                ? themeColors?.primary_color
                : colors.transparent,
            borderRadius: moderateScale(4),
            padding: moderateScale(6),
          }}>
          <Text
            style={{
              fontFamily: fontFamily?.regular,
              fontSize: textScale(12),
              color:
                selectedTab?.id === item?.id
                  ? colors.white
                  : isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.black,
            }}>
            {item?.title}
          </Text>
        </TouchableOpacity>
      );
    },
    [isLoadingOrders, selectedTab, isDarkMode],
  );

  return (
    <WrapperContainer
      isLoading={isLoadingOrders}
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}>
      <Header2
        centerTitle={strings.ORDERS}
        textStyle={{
          fontFamily: fontFamily?.bold,
          fontSize: textScale(18),
          marginLeft: moderateScale(16),
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: moderateScaleVertical(8),
        }}>
        <ButtonComponent
          onPress={() => updateOrderType('rent')}
          btnText={'Rent'}
          textStyle={{
            color:
              order_type == 'rent' ? themeColors?.primary_color : colors.black,
            textTransform: 'none',
          }}
          containerStyle={{
            flex: 0.5,
            height: moderateScaleVertical(40),
            backgroundColor: colors.white,
            borderRadius: 0,
          }}
        />
        <ButtonComponent
          onPress={() => updateOrderType('purchase')}
          btnText={'Purchase'}
          textStyle={{
            color:
              order_type == 'purchase'
                ? themeColors?.primary_color
                : colors.black,
            textTransform: 'none',
          }}
          containerStyle={{
            flex: 0.5,
            height: moderateScaleVertical(40),
            backgroundColor: colors.white,
            borderRadius: 0,
          }}
        />
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: colors.textGreyO,
        }}
      />
      <View
        style={{
          marginVertical: moderateScaleVertical(16),
        }}>
        <FlatList
          data={tabsData}
          horizontal
          renderItem={renderTabs}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            marginLeft: moderateScale(16),
          }}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: moderateScale(8),
              }}
            />
          )}
          ListFooterComponent={() => (
            <View
              style={{
                width: moderateScale(30),
              }}
            />
          )}
        />
      </View>

      <View
        style={{
          flex: 1,
        }}>
        {selectedTab?.id == 3 ? (
          <FlatList
            data={orderHistory}
            renderItem={renderOrders}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={themeColors.primary_color}
              />
            }
            ListHeaderComponent={() => (
              <View
                style={{
                  height: moderateScaleVertical(12),
                }}
              />
            )}
            ItemSeparatorComponent={ItemSeparatorComponent}
            ListEmptyComponent={ListEmptyComp}
          />
        ) : (
          <View style={{flex: 1}}>
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  tintColor={themeColors.primary_color}
                />
              }>
              {!isEmpty(upcomingOngoingOrders?.lender) ||
              !isEmpty(upcomingOngoingOrders?.borrower) ? (
                <View>
                  {!isEmpty(upcomingOngoingOrders?.lender) && (
                    <View
                      style={{
                        marginTop: moderateScaleVertical(12),
                      }}>
                      <HeaderView
                        leftText={order_type=='rent'? strings.AS_LENDER:strings.AS_SELLER}
                        isRightText={upcomingOngoingOrders?.lender?.length > 1}
                        onPressRight={() =>
                          navigation.navigate(
                            navigationStrings.RENT_TYPE_LISTING,
                            {
                              userType: 'lender',
                              type:
                                selectedTab?.id == 4
                                  ? 'past'
                                  : selectedTab?.id == 1||(selectedTab?.id==2&&order_type=='purchase')
                                  ? 'upcoming'
                                  : 'ongoing',
                              selectedTab: selectedTab,
                              productType:order_type
                            },
                          )
                        }
                      />
                      <FlatList
                        data={upcomingOngoingOrders?.lender}
                        renderItem={renderUpcomingOngoingOrders}
                        scrollEnabled={false}
                        ItemSeparatorComponent={ItemSeparatorComponent}
                      />
                    </View>
                  )}

                  {!isEmpty(upcomingOngoingOrders?.borrower) && (
                    <View
                      style={{
                        marginTop: moderateScaleVertical(12),
                      }}>
                      <HeaderView
                        leftText={order_type=='rent'?strings.AS_BORROWER:strings.AS_BUYER}
                        isRightText={
                          upcomingOngoingOrders?.borrower?.length > 1
                        }
                        onPressRight={() =>
                          navigation.navigate(
                            navigationStrings.RENT_TYPE_LISTING,
                            {
                              userType: 'borrower',
                              type:
                                selectedTab?.id == 4
                                  ? 'past'
                                  : selectedTab?.id == 1||(selectedTab?.id==2&&order_type=='purchase')
                                  ? 'upcoming'
                                  : 'ongoing',
                              selectedTab: selectedTab,
                              productType:order_type
                            },
                          )
                        }
                      />
                      <FlatList
                        data={upcomingOngoingOrders?.borrower}
                        renderItem={renderUpcomingOngoingOrders}
                        scrollEnabled={false}
                        // refreshControl={
                        //   <RefreshControl
                        //     refreshing={isRefreshing}
                        //     onRefresh={handleRefresh}
                        //     tintColor={themeColors.primary_color}
                        //   />
                        // }
                        ItemSeparatorComponent={ItemSeparatorComponent}
                      />
                    </View>
                  )}
                </View>
              ) : (
                <ListEmptyComp />
              )}
            </ScrollView>
          </View>
        )}
      </View>
    </WrapperContainer>
  );
}
