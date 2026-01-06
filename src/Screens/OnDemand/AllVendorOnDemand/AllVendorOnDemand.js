import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useSelector } from 'react-redux';
import NoDataFound from '../../../Components/NoDataFound';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import { moderateScale, moderateScaleVertical, width, } from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';

import { debounce } from 'lodash';
import { UIActivityIndicator } from 'react-native-indicators';
import { enableFreeze } from "react-native-screens";
import Header from '../../../Components/Header';
import VendorCardOnDemand from '../../../Components/VendorCardOnDemand';
import { getColorSchema } from '../../../utils/utils';
enableFreeze(true);


var noMoreData = false;

export default function AllVendorOnDemand({ route, navigation }) {
    const { appData, themeColors, currencies, languages, appStyle } = useSelector((state) => state.initBoot || {});
    const theme = useSelector((state) => state?.initBoot?.themeColor);
    const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
    const { appMainData, dineInType, location } = useSelector((state) => state?.home || {});
    const darkthemeusingDevice = getColorSchema();
    const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
    const fontFamily = appStyle?.fontSizeData;
    const commonStyles = commonStylesFun({ fontFamily });

    const [state, setState] = useState({
        isLoading: true,
        pageNo: 1,
        limit: 10,
        data: [],
    });

    const {
        isLoading,
        pageNo,
        limit,
        data,
    } = state;


    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    useEffect(() => {
        apiHit(pageNo);
        return () => noMoreData = false
    }, []);

    //Home data
    const apiHit = (pageNo) => {
        let latlongObj = {};
        if (!!appData?.profile?.preferences?.is_hyperlocal) {
            latlongObj = {
                latitude: location?.latitude,
                longitude: location?.longitude,
            };
        }


        let query = `?limit=${limit}&page=${pageNo}&type=${dineInType ? dineInType : dineInType
            }&latitude=${latlongObj?.latitude || ''}&longitude=${latlongObj?.longitude || ''
            }`;

        let headers = {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
        };
        console.log('sending headers', headers);
        console.log('sending query', query);

        actions
            .vendorAll(query, {}, headers)
            .then((res) => {
                console.log('Home data++++++', res?.data);
                if (res?.data?.data?.length == 0) {
                    noMoreData = true
                }
                updateState({
                    data: pageNo == 1 ? res?.data?.data : [...data, ...res?.data?.data],
                    isLoading: false,
                });
            })
            .catch((error) => {
                console.log('error raised', error);
                updateState({
                    isLoading: false,
                });
            });
    };
    console.log('data length', data.length);

    //Naviagtion to specific screen
    const moveToNewScreen =
        (screenName, data = {}) =>
            () => {
                navigation.navigate(screenName, { data });
            };

    const _checkRedirectScreen = (item) => {


        //vendor_templete_id == 1 //only_product
        //vendor_templete_id == 2 //only_category
        //vendor_templete_id == 5 //product_with_category
        //vendor_templete_id == 6 //product_with_category_extended
        if (item?.vendor_templete_id == 1) {
            moveToNewScreen(navigationStrings.ONLY_PRODUCT_OD, {
                id: item?.id,
                vendor: true,
                name: item?.name,
                isVendorList: true,
                fetchOffers: true,
            })()
        }
        if (item?.vendor_templete_id == 2) {
            moveToNewScreen(navigationStrings.ONLY_CATEGORY_OD, {
                id: item?.id,
                vendor: true,
                name: item?.name,
                isVendorList: true,
                fetchOffers: true,
            })()
        }
        if (item?.vendor_templete_id == 5) {
            moveToNewScreen(navigationStrings.PRODUCT_WITH_CATEGORY_OD, {
                id: item?.id,
                vendor: true,
                name: item?.name,
                isVendorList: true,
                fetchOffers: true,
            })()
        }
        if (item?.vendor_templete_id == 6) {
            moveToNewScreen(navigationStrings.PRODUCT_WITH_EXTENDED_CATEGORY, {
                id: item?.id,
                vendor: true,
                name: item?.name,
                isVendorList: true,
                fetchOffers: true,
            })()
        }
        console.log("itemitem", item)
        return;
        {
            item?.is_show_category
                ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
                    item,
                    rootProducts: true,
                    categoryData: data,
                })()
                : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
                    id: item.id,
                    vendor: true,
                    name: item.name,
                    isVendorList: true,
                    fetchOffers: true,
                })();
        }
    };

    /**********/

    const _renderItem = ({ item, index }) => {
        return (
            <Animatable.View
                style={{ marginHorizontal: moderateScale(15) }}
            >
                <VendorCardOnDemand onPress={() => _checkRedirectScreen(item)} data={item} />
            </Animatable.View>
        );
    };



    const onEndReached = () => {
        if (!noMoreData) {
            updateState({ pageNo: pageNo + 1 });
            apiHit(pageNo + 1);
        } else {
            noMoreData = true
        }
    };
    const onEndReachedDelayed = debounce(onEndReached, 1000, {
        leading: true,
        trailing: false,
    });

    const listFooterComponent = () => {
        return (
            <View style={{ marginBottom: moderateScale(100), marginTop: moderateScaleVertical(16) }}>
                <UIActivityIndicator
                    color={themeColors?.primary_color}
                    size={30}
                />
            </View>
        )
    }



    if (isLoading) {
        return (
            <WrapperContainer
                bgColor={
                    isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
                }
                statusBarColor={colors.backgroundGrey}>

                <Header
                    leftIcon={imagePath.icBackD}
                    showAddress={false}
                    centerTitle={route.params?.title}
                    headerStyle={{
                        borderBottomWidth: 0.5,
                        borderBottomColor: isDarkMode ? colors.whiteOpacity22 : colors.blackOpacity10
                    }}
                />


                <UIActivityIndicator
                    color={themeColors?.primary_color}
                    size={30}
                />

            </WrapperContainer>
        );
    }
    return (
        <WrapperContainer
            bgColor={
                isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
            }
            statusBarColor={colors.backgroundGrey}
        // isLoading={loadMore}
        >

            <Header
                leftIcon={imagePath.icBackD}
                showAddress={false}
                centerTitle={route.params?.title}
                headerStyle={{
                    borderBottomWidth: 0.5,
                    borderBottomColor: isDarkMode ? colors.whiteOpacity22 : colors.blackOpacity10
                }}
            />

            <FlatList
                showsVerticalScrollIndicator={false}
                data={data}
                extraData={data}
                ItemSeparatorComponent={() => <View style={{
                    height: 1,
                    borderBottomWidth: 0.5,
                    marginVertical: moderateScaleVertical(14),
                    borderBottomColor: isDarkMode ? colors.whiteOpacity22 : colors.blackOpacity10
                }} />}
                keyExtractor={(item, index) => String(index)}
                renderItem={_renderItem}
                onEndReachedThreshold={0.5}
                onEndReached={onEndReachedDelayed}
                initialNumToRender={6}
                ListHeaderComponent={() => <View style={{ height: 20 }} />}
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
                ListFooterComponent={!noMoreData ?
                    <>{listFooterComponent()}</>
                    : <View />}
            />
        </WrapperContainer>
    );
}
