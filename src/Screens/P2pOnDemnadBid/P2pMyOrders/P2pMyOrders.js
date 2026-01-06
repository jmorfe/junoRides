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
    View
} from 'react-native';
import * as RNLocalize from 'react-native-localize';
import { useSelector } from 'react-redux';
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
    textScale
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import { showError } from '../../../utils/helperFunctions';
import { getColorSchema } from '../../../utils/utils';
import stylesFunc from './styles';

export default function MyOrders({ navigation, route }) {
    const { appData, currencies, languages, appStyle, themeColors, themeToggle, themeColor } = useSelector(
        state => state?.initBoot,
    );

    const { userData } = useSelector((state) => state?.auth);
    const { location } = useSelector(state => state?.home);
    const darkthemeusingDevice = getColorSchema();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const { preferences } = appData?.profile;
    const fontFamily = appStyle?.fontSizeData;
    const styles = stylesFunc({ fontFamily, themeColors })

    const [tabsData, setTabsData] = useState([
        // {
        //   id: 1,
        //   title: 'All',
        // },
        {
            id: 2,
            title: 'Upcoming orders',
        },
        {
            id: 3,
            title: 'Active orders',
        },
        {
            id: 4,
            title: 'Cancelled orders',
        },
        {
            id: 5,
            title: 'Past orders',
        },
    ]);
    const [selectedTab, setSelectedTab] = useState({
        id: 2,
        title: 'Upcoming orders',
    },);

    const [orderHistory, setOrderHistory] = useState([]);
    const [isRefreshing, setisRefreshing] = useState(false);
    const [pageNo, setpageNo] = useState(1);
    const [isLoadMore, setisLoadMore] = useState(true);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);
    const [upcomingOngoingOrders, setUpcomingOngoingOrders] = useState([]);


    useFocusEffect(
        useCallback(() => {
            if (!userData?.auth_token) {
                actions.setAppSessionData('on_login');
                return;
            }
            setIsLoadingOrders(true)
            if (selectedTab?.id == 4) {
                getOrders(1, 'cancel');
            }
            else {
                getOngoingAndUpcomingOrders(selectedTab);
            }
        }, [selectedTab]),
    );




    const onChangeTab = type => {
        setSelectedTab(type);
        setIsLoadingOrders(true)
        setpageNo(1);
    };


    const handleRefresh = () => {
        setisRefreshing(true);
        setpageNo(1);
        setisLoadMore(true);
        if (selectedTab?.id == 4) {
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



    const getOngoingAndUpcomingOrders = (type = selectedTab) => {
        actions
            .getUpcomingAndOngoingOrders(
                `?type=${type?.id == 5 ? "past" : type?.id == 2 ? 'upcoming' : 'ongoing'}`,
                {},
                {
                    code: appData?.profile?.code,
                    currency: currencies?.primary_currency?.id,
                    language: languages?.primary_language?.id,
                },
            )
            .then(res => {
                console.log(res, '<===res getUpcomingAndOngoingOrders');
                setIsLoadingOrders(false)
                setUpcomingOngoingOrders(res?.data);
                setisRefreshing(false)

            })
            .catch(errorMethod);
    };

    const getOrders = (pageNo = 1, type = 'past') => {
        console.log(type, 'typetypetype')
        actions
            .getAllP2pOrders(
                `?limit=${12}&page=${pageNo}&type=${type}`,
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

    const errorMethod = (error) => {
        setisRefreshing(false);
        setIsLoadingOrders(false);
        showError(error?.message || error?.error);
    }



    const onChatStart = async (item) => {
        let productInfo = item?.products[0]
        console.log(item, 'itemitem')

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
                order_number: item?.order_number
            };

            console.log('sending api data', apiData);
            const res = await actions.onStartChat(apiData, {
                code: appData?.profile?.code,
                currency: currencies?.primary_currency?.id,
                language: languages?.primary_language?.id,
            });
            if (!isEmpty(res?.roomData)) {
                navigation.navigate(navigationStrings.CHAT_SCREEN, {
                    data: {
                        ...res?.roomData, vendor_id_order: productInfo?.vendor_id, order: item, selectedTab: selectedTab
                    }
                });
            }
            else {
                showError("Room not found");
            }
            // setLoadingChat(false);
        } catch (error) {
            // setLoadingChat(false);
            console.log('error raised in start chat api', error);
            showError(error?.message);
        }


    }

    const renderOrders = useCallback(
        ({ item }) => {

            return <P2pProductComp
                isMoreDetails={true}
                isStartChat={selectedTab?.id == 1 && item?.order_status_option_id !== 3 && item?.order_status_option_id !== 6}
                onChatStart={() => onChatStart(item)}
                selectedTab={selectedTab}
                item={item}
                onViewDetails={() => navigation?.navigate(navigationStrings.P2P_ORDER_DETAIL, {
                    selectedTab: selectedTab,
                    order_id: item?.order_id,
                    isAvailableToRaiseIssue: selectedTab?.id == 1 && item?.order_status_option_id !== 3 && item?.order_status_option_id !== 6
                })} />;
        },
        [orderHistory, selectedTab],
    );

    const renderUpcomingOngoingOrders = useCallback(
        ({ item }) => {
            return <P2pProductComp
                isMoreDetails={true}
                isStartChat
                onChatStart={() => onChatStart(item)}
                item={item}
                onViewDetails={() => navigation?.navigate(navigationStrings.P2P_ORDER_DETAIL, {
                    selectedTab: selectedTab,
                    order_id: item?.order_id,
                    type: item?.type || '',
                    isAvailableToRaiseIssue: true
                })}


            />
        },
        [upcomingOngoingOrders],
    );



    const ListEmptyComp = () => <View
        style={styles.emptyContainer}>
        <Image
            source={imagePath.noDataFound3}
            style={{
                height: moderateScale(300),
                width: moderateScale(300),
            }}
        />
    </View>

    const ItemSeparatorComponent = () => <View
        style={{
            height: moderateScaleVertical(12),
        }}
    />

    const HeaderView = ({ leftText = "", onPressRight = () => { }, isRightText = true }) => <View
        style={styles.headerContainer}>
        <Text
            style={{ ...styles.leftText, color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>
            {leftText}
        </Text>
        {isRightText && <TouchableOpacity onPress={onPressRight}>
            <Text
                style={styles.rightTxt}>
                View all
            </Text>
        </TouchableOpacity>}
    </View>

    const renderTabs = ({ item, index }) => {
        return <TouchableOpacity
            hitSlop={hitSlopProp}
            onPress={() => onChangeTab(item)}
            style={{
                backgroundColor: selectedTab?.id === item?.id ? themeColors?.primary_color : colors.transparent,
                borderRadius: moderateScale(4),
                padding: moderateScale(6)
            }}>
            <Text style={{
                fontFamily: fontFamily?.regular,
                fontSize: textScale(12),
                color: selectedTab?.id === item?.id ? colors.white : isDarkMode ? MyDarkTheme.colors.text : colors.black
            }}>{item?.title}</Text>
        </TouchableOpacity>
    }



    return (
        <WrapperContainer isLoading={isLoadingOrders} bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white} >
            <Header2
                centerTitle={strings.ORDERS}
                textStyle={{

                    fontFamily: fontFamily?.bold,
                    fontSize: textScale(18),
                    marginLeft: moderateScale(16)
                }}

            />
            <View
                style={{
                    height: 1,
                    backgroundColor: colors.textGreyO,
                }}
            />
            <View style={{
                marginVertical: moderateScaleVertical(16)
            }}>
                <FlatList
                    data={tabsData}
                    horizontal
                    renderItem={renderTabs}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        marginLeft: moderateScale(16)
                    }}
                    ItemSeparatorComponent={() => <View style={{
                        width: moderateScale(8)
                    }} />}
                    ListFooterComponent={() => <View style={{
                        width: moderateScale(30)
                    }} />}
                />
            </View>


            <View
                style={{
                    flex: 1,
                }}>
                {(selectedTab?.id == 4) ? (
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
                        ListHeaderComponent={() => <View style={{
                            height: moderateScaleVertical(12)
                        }} />}
                        ItemSeparatorComponent={ItemSeparatorComponent}
                        ListEmptyComponent={ListEmptyComp}
                    />
                ) : (
                    <View style={{ flex: 1, }}>
                        <ScrollView

                            refreshControl={
                                <RefreshControl
                                    refreshing={isRefreshing}
                                    onRefresh={handleRefresh}
                                    tintColor={themeColors.primary_color}
                                />
                            }
                        >
                            {!isEmpty(upcomingOngoingOrders?.lender) ||
                                !isEmpty(upcomingOngoingOrders?.borrower) ? (
                                <View>
                                    {!isEmpty(upcomingOngoingOrders?.lender) && (
                                        <View style={{
                                            marginTop: moderateScaleVertical(12)
                                        }}>

                                            <HeaderView leftText={strings.AS_LENDER}
                                                isRightText={upcomingOngoingOrders?.lender?.length > 1}
                                                onPressRight={() => navigation.navigate(navigationStrings.RENT_TYPE_LISTING, {
                                                    userType: "lender",
                                                    type: selectedTab?.id == 5 ? "past" : selectedTab?.id == 2 ? "upcoming" : "ongoing",
                                                    selectedTab: selectedTab
                                                })} />
                                            <FlatList
                                                data={upcomingOngoingOrders?.lender}
                                                renderItem={renderUpcomingOngoingOrders}
                                                scrollEnabled={false}

                                                ItemSeparatorComponent={ItemSeparatorComponent}
                                            />
                                        </View>
                                    )}

                                    {!isEmpty(upcomingOngoingOrders?.borrower) && (
                                        <View style={{
                                            marginTop: moderateScaleVertical(12)
                                        }}>
                                            <HeaderView leftText={strings.AS_BORROWER}
                                                isRightText={upcomingOngoingOrders?.borrower?.length > 1}
                                                onPressRight={() => navigation.navigate(navigationStrings.RENT_TYPE_LISTING, {
                                                    userType: "borrower",
                                                    type: selectedTab?.id == 5 ? "past" : selectedTab?.id == 2 ? "upcoming" : "ongoing",
                                                    selectedTab: selectedTab
                                                })} />
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
                            ) : <ListEmptyComp />}
                        </ScrollView>
                    </View>
                )}

            </View>
        </WrapperContainer>
    );
}
